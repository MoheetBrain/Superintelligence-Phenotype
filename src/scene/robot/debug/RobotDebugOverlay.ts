import * as T from 'three';
import type { AtlasRobot } from '../createRobot';
import { proportionMetrics, robotSpec, U } from '../robotSpec';
export function createRobotDebug(
  el: HTMLElement,
  pair: { a: AtlasRobot; b: AtlasRobot },
  view: (direction: T.Vector3) => void,
  redraw: () => void,
) {
  let mode = 'clay',
    stage = 1,
    showGuides = true;
  const originals = new Map<T.Mesh, T.Material | T.Material[]>(),
    clay = new T.MeshStandardMaterial({ color: '#9b9d9c', roughness: 0.8, metalness: 0 });
  const panel = document.createElement('section');
  panel.className = 'robot-debug';
  panel.setAttribute('aria-label', 'Development robot comparison');
  panel.style.cssText =
    'position:absolute;z-index:20;left:8px;top:8px;width:210px;padding:12px;border:1px solid #9caaa5;background:#f8faf6ed;color:#24332d;font:11px/1.5 monospace;border-radius:8px;max-height:95%;overflow:auto';
  const heading = document.createElement('strong');
  heading.textContent = 'ROBOT QA · H = 1';
  panel.append(heading);
  function button(label: string, fn: () => void) {
    const b = document.createElement('button');
    b.textContent = label;
    b.style.cssText =
      'color:#24332d;background:#e5ece6;border:1px solid #94a89b;min-height:30px;font:10px monospace;padding:4px;margin:3px 2px 3px 0;border-radius:3px';
    b.onclick = fn;
    panel.append(b);
    return b;
  }
  for (const [label, dir] of [
    ['FRONT', [0, 0, 1]],
    ['3/4 LEFT', [-0.66, 0.025, 1]],
    ['SIDE', [-1, 0.02, 0.02]],
    ['BACK', [0, 0.02, -1]],
    ['3/4 RIGHT', [0.66, 0.025, 1]],
  ] as const)
    button(label, () => view(new T.Vector3(...dir)));
  const phase = document.createElement('p');
  panel.append(phase);
  const setMode = (next: string, n: number) => {
    mode = next;
    stage = n;
    phase.textContent = `${mode.toUpperCase()} · checkpoint ${stage}`;
    redraw();
  };
  for (const [label, next, n] of [
    ['Clay', 'clay', 1],
    ['Assembly', 'clay', 2],
    ['Details', 'clay', 3],
    ['Materials', 'pbr', 4],
  ] as const)
    button(label, () => setMode(next, n));
  button('Guides', () => {
    showGuides = !showGuides;
    redraw();
  });
  const values = document.createElement('pre');
  values.style.cssText = 'font:10px/1.55 monospace;white-space:pre-wrap';
  values.textContent = Object.entries(proportionMetrics())
    .map(([k, v]) => `${k.padEnd(21)} ${v.toFixed(3)}`)
    .join('\n');
  panel.append(values);
  const axes = [
    ['head top', 1],
    ['shoulder', robotSpec.arm.shoulderY],
    ['elbow', robotSpec.arm.elbowY],
    ['wrist', robotSpec.arm.wristY],
    ['pelvis', robotSpec.pelvis.y],
    ['knee', robotSpec.leg.kneeY],
    ['ankle', robotSpec.leg.ankleY],
    ['floor', 0],
  ] as const;
  const landmarks = document.createElement('p');
  landmarks.textContent = axes.map(([k, v]) => `${k} ${v.toFixed(3)}`).join(' · ');
  panel.append(landmarks);
  const count = document.createElement('p');
  panel.append(count);
  const guides: T.Group[] = [];
  for (const item of [pair.a, pair.b]) {
    for (const p of item.registry.values())
      for (const mesh of p.meshes) originals.set(mesh, mesh.material);
    const guide = new T.Group();
    guides.push(guide);
    item.robot.add(guide);
    for (const [, y] of axes) {
      const geometry = new T.BufferGeometry().setFromPoints([
        new T.Vector3(U(-0.19), U(y), 0.03),
        new T.Vector3(U(0.19), U(y), 0.03),
      ]);
      guide.add(
        new T.Line(
          geometry,
          new T.LineBasicMaterial({
            color: '#cb9435',
            transparent: true,
            opacity: 0.55,
            depthTest: false,
          }),
        ),
      );
    }
  }
  el.append(panel);
  el.setAttribute('data-robot-debug', 'true');
  const style = document.createElement('style');
  style.textContent =
    '[data-robot-debug] .floating-host-label,[data-robot-debug] .operational-handle,[data-robot-debug] .operational-target,[data-robot-debug] .part-label{display:none!important}';
  panel.append(style);
  phase.textContent = 'CLAY · checkpoint 1';
  function prepare() {
    let triangles = 0;
    for (const item of [pair.a, pair.b])
      for (const p of item.registry.values())
        for (const mesh of p.meshes) {
          mesh.material = mode === 'clay' ? clay : originals.get(mesh)!;
          mesh.visible = p.group.visible && (mesh.userData.stage ?? 1) <= stage;
          if (mesh.visible && item.robot.visible)
            triangles +=
              (mesh.geometry.index?.count ?? mesh.geometry.getAttribute('position').count) / 3;
        }
    clay.color.set('#9b9d9c');
    clay.emissive.set('#000000');
    clay.emissiveIntensity = 0;
    for (const guide of guides) guide.visible = showGuides;
    count.textContent = `Visible body triangles: ${triangles.toLocaleString()}`;
  }
  return {
    prepare,
    dispose() {
      for (const [mesh, material] of originals) mesh.material = material;
      clay.dispose();
      for (const g of guides) {
        g.removeFromParent();
        g.traverse((o) => {
          if (o instanceof T.Line) {
            o.geometry.dispose();
            (o.material as T.Material).dispose();
          }
        });
      }
      panel.remove();
      el.removeAttribute('data-robot-debug');
    },
  };
}
