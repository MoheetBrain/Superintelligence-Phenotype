import * as T from 'three';
import type { AtlasRobot } from '../createRobot';
import { proportionMetrics, robotSpec, U } from '../robotSpec';
export function createRobotDebug(
  el: HTMLElement,
  pair: { a: AtlasRobot; b: AtlasRobot },
  view: (direction: T.Vector3) => void,
  redraw: () => void,
  selectHost: (host: 'host-a' | 'host-b') => void,
) {
  let mode = 'clay',
    stage = 1,
    showGuides = true;
  const originals = new Map<T.Mesh, T.Material | T.Material[]>(),
    clay = new T.MeshStandardMaterial({
      color: '#686e72',
      roughness: 0.95,
      metalness: 0,
      envMapIntensity: 0.2,
    });
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
    ['LEFT SIDE', [-1, 0, 0.001]],
    ['BACK', [0, 0.02, -1]],
    ['RIGHT SIDE', [1, 0, 0.001]],
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
  button('GRAPHITE', () => {
    selectHost('host-a');
    setMode('pbr', 4);
  });
  button('PEARL', () => {
    selectHost('host-b');
    setMode('pbr', 4);
  });
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
    ['head bottom', 1 - robotSpec.head.height],
    ['shoulder', robotSpec.arm.shoulderY],
    ['elbow', robotSpec.arm.elbowY],
    ['wrist', robotSpec.arm.wristY],
    ['torso bottom', robotSpec.torso.bottom],
    ['pelvis', robotSpec.pelvis.y],
    ['hip axis', robotSpec.leg.hipY],
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
    guide.add(
      new T.Line(
        new T.BufferGeometry().setFromPoints([new T.Vector3(0, 0, 0), new T.Vector3(0, U(1), 0)]),
        new T.LineBasicMaterial({
          color: '#a89979',
          transparent: true,
          opacity: 0.4,
          depthTest: false,
        }),
      ),
    );
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
  document.body.classList.add('robot-comparison');
  const style = document.createElement('style');
  style.textContent = `.robot-comparison .app-header,.robot-comparison .title-row,.robot-comparison .atlas-breadcrumb,.robot-comparison .mobility-controls,.robot-comparison .site-footer,.robot-comparison .scene-heading,.robot-comparison .scene-footer,.robot-comparison .host-camera-controls,.robot-comparison .cloud-navigation{display:none!important}
    .robot-comparison .atlas-stage-footer,.robot-comparison .compact-footer{display:none!important}
    .robot-comparison .app-shell,.robot-comparison .atlas-stage{margin:0!important;padding:0!important;max-width:none!important;height:100vh!important;min-height:0!important}
    .robot-comparison .scene-panel{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;border:0!important;border-radius:0!important;z-index:100}
    .robot-comparison .robot-scene,.robot-comparison .canvas-host{height:100%!important;min-height:0!important}
    [data-robot-debug] .floating-host-label,[data-robot-debug] .operational-handle,[data-robot-debug] .operational-target,[data-robot-debug] .communication-label,[data-robot-debug] .part-label{display:none!important}`;
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
    clay.color.set('#686e72');
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
      document.body.classList.remove('robot-comparison');
    },
  };
}
