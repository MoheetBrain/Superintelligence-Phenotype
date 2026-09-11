import { useEffect, useRef, useState } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CloudNavigation, nodeAction } from '../components/CloudNavigation';
import { discoveryNodes } from '../data/discovery';
import { mechanicalContext } from '../data/illustrations';
import { createDiscovery, disposeGroup } from './createDiscovery';
import { projected, placeCallouts } from './discoveryLayout';
import { createRobot } from './createRobot';
import { createExecution } from './createExecution';
import { applyExplosion } from './explosionLayout';
import { fitCamera, readCamera } from './camera';
import { highlightParts, conceptsForPart } from './partRegistry';
import { pickPart } from './picking';
import { PointerTap } from './pointerTap';
import { capabilityById } from '../data/capabilities';
import type { Action, ExplorerState } from '../state/explorerReducer';
interface Props {
  state: ExplorerState;
  dispatch: (a: Action) => void;
  onChoose: (ids: string[]) => void;
  onNavigate?: (a: Action) => void;
}
export function RobotScene({ state, dispatch, onChoose, onNavigate = dispatch }: Props) {
  const nodeElements = useRef(new Map<string, HTMLButtonElement>());
  const hoverCloud = useRef<(key: string | null) => void>(() => {});
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef({ state, dispatch, onChoose, onNavigate });
  latest.current = { state, dispatch, onChoose, onNavigate };
  const update = useRef<() => void>(() => {});
  const [error, setError] = useState('');
  useEffect(() => {
    const el = host.current!;
    let renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'low-power',
      });
    } catch {
      setError(
        '3D is unavailable in this browser. Choose a discovery group here, or open List view to explore every concept.',
      );
      return;
    }
    let disposed = false,
      frame = 0,
      cameraTimer: ReturnType<typeof setTimeout> | undefined,
      applying = false,
      failed = false;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor('#111615', 0);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    canvas.setAttribute(
      'aria-label',
      'Interactive robot. Drag to rotate; scroll or pinch to zoom. Use the catalogue for keyboard selection.',
    );
    canvas.setAttribute('role', 'img');
    const scene = new T.Scene();
    const camera = new T.PerspectiveCamera(34, 1, 0.05, 250);
    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = false;
    controls.minDistance = 0.3;
    controls.maxDistance = 150;
    controls.enablePan = true;
    controls.maxPolarAngle = Math.PI * 0.97;
    const { robot, registry, decoration } = createRobot();
    scene.add(robot);
    const execution = createExecution();
    scene.add(execution.group);
    const executionLabels = execution.labels.map(() => {
      const label = document.createElement('span');
      label.className = 'execution-label';
      label.hidden = true;
      label.setAttribute('aria-hidden', 'true');
      el.appendChild(label);
      return label;
    });
    const visibleBodyBounds = new T.Box3();
    let nodes = discoveryNodes(latest.current.state.group);
    let clouds = createDiscovery(nodes, !latest.current.state.group);
    scene.add(clouds.group);
    const leader = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    leader.classList.add('callout-leaders');
    leader.setAttribute('aria-hidden', 'true');
    el.appendChild(leader);
    const connector = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    connector.classList.add('selected-connector');
    leader.appendChild(connector);
    const nodeLines = new Map<string, SVGLineElement>();
    const syncLines = () => {
      for (const line of nodeLines.values()) line.remove();
      nodeLines.clear();
      for (const node of nodes) {
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('stroke', node.color);
        leader.appendChild(line);
        nodeLines.set(node.key, line);
      }
    };
    syncLines();
    hoverCloud.current = (key) => {
      for (const mesh of clouds.meshes) {
        const mat = mesh.material as T.MeshStandardMaterial;
        if (mat.emissive) mat.emissiveIntensity = mesh.userData.cloudKey === key ? 1.3 : 0.65;
      }
      invalidate();
    };

    const pmrem = new T.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04);
    scene.environment = env.texture;
    scene.environmentIntensity = 0.65;
    room.dispose();
    pmrem.dispose();
    scene.add(new T.HemisphereLight('#cae7ff', '#17212c', 0.65));
    const key = new T.DirectionalLight('#fff0df', 3.0);
    key.position.set(-3, 12, 5);
    key.target.position.set(0, 3, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, {
      left: -4,
      right: 4,
      top: 4,
      bottom: -4,
      near: 0.5,
      far: 20,
    });
    key.shadow.normalBias = 0.025;
    scene.add(key.target);
    scene.add(key);
    const rim = new T.DirectionalLight('#82daff', 3.0);
    rim.position.set(4, 4, -4);
    scene.add(rim);
    const stage = new T.Group();
    scene.add(stage);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.ShadowMaterial({ opacity: 0.28 }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.069;
    floor.receiveShadow = true;
    stage.add(floor);
    for (const radius of [1.5, 1.65]) {
      const ring = new T.Mesh(
        new T.RingGeometry(radius, radius + 0.013, 96),
        new T.MeshBasicMaterial({
          color: '#85978c',
          side: T.DoubleSide,
          transparent: true,
          opacity: 0.4,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.071;
      stage.add(ring);
    }
    const tooltip = document.createElement('div');
    tooltip.className = 'part-tooltip';
    tooltip.hidden = true;
    tooltip.setAttribute('aria-hidden', 'true');
    el.appendChild(tooltip);
    const labels = new Map<string, HTMLSpanElement>();
    for (const p of registry.values()) {
      const label = document.createElement('span');
      label.className = 'part-label';
      label.textContent = p.label;
      label.hidden = true;
      label.setAttribute('aria-hidden', 'true');
      el.appendChild(label);
      labels.set(p.id, label);
    }
    function render() {
      frame = 0;
      if (disposed || failed) return;
      try {
        for (const mesh of clouds.meshes)
          if (mesh.geometry instanceof T.TorusGeometry) mesh.quaternion.copy(camera.quaternion);
        renderer.render(scene, camera);
        canvas.dataset.renderCount = String(Number(canvas.dataset.renderCount ?? 0) + 1);
        canvas.dataset.triangles = String(renderer.info.render.triangles);
        canvas.dataset.geometries = String(renderer.info.memory.geometries);
        const w = el.clientWidth,
          h = el.clientHeight;
        if (!visibleBodyBounds.isEmpty()) {
          const ys: number[] = [];
          for (const x of [visibleBodyBounds.min.x, visibleBodyBounds.max.x])
            for (const y of [visibleBodyBounds.min.y, visibleBodyBounds.max.y])
              for (const z of [visibleBodyBounds.min.z, visibleBodyBounds.max.z])
                ys.push(projected(new T.Vector3(x, y, z), camera, w, h).y);
          canvas.dataset.bodyHeightRatio = String((Math.max(...ys) - Math.min(...ys)) / h);
        }
        for (const [i, label] of executionLabels.entries()) {
          const p = projected(execution.labels[i], camera, w, h);
          label.style.left = `${Math.max(75, Math.min(w - 75, p.x))}px`;
          label.style.top = `${p.y}px`;
          label.hidden = !execution.group.visible || !p.visible;
        }
        const points = nodes.map((n) => ({
          key: n.key,
          ...projected(clouds.anchors.get(n.key)!, camera, w, h),
        }));
        const compact =
          w < 840 ||
          h < 400 ||
          parseFloat(getComputedStyle(document.documentElement).fontSize) > 20;
        el.parentElement?.classList.toggle('compact-clouds', compact);
        const placements = placeCallouts(points, w, h);
        for (const p of points) {
          const button = nodeElements.current.get(p.key),
            place = placements.get(p.key),
            line = nodeLines.get(p.key);
          if (!button || !place || !line) continue;
          button.style.left = `${place.x}px`;
          button.style.top = `${place.y}px`;
          button.style.visibility = compact || place.visible ? 'visible' : 'hidden';
          button.tabIndex = clouds.group.visible && (compact || place.visible) ? 0 : -1;
          line.style.display = compact || !place.visible || !clouds.group.visible ? 'none' : '';
          line.setAttribute('x1', String(p.x));
          line.setAttribute('y1', String(p.y));
          line.setAttribute('x2', String(p.x < w / 2 ? place.x + 205 : place.x));
          line.setAttribute('y2', String(place.y + 24));
        }
        const s = latest.current.state;
        const selected = s.selected
          ? registry.get(capabilityById[s.selected]!.viewCoordinates.body.partIds[0])
          : null;
        const p = selected ? projected(selected.group.position, camera, w, h) : null;
        connector.style.display =
          p?.visible && s.selected && s.illustration !== 'execution' ? '' : 'none';
        if (p?.visible)
          connector.setAttribute(
            'd',
            `M ${p.x} ${p.y} Q ${w - 90} ${p.y} ${w} ${Math.min(h - 35, 170)}`,
          );

        let index = 0;
        for (const p of registry.values()) {
          index++;
          const label = labels.get(p.id)!;
          label.textContent = el.clientHeight < 450 ? String(index).padStart(2, '0') : p.label;
          label.hidden = !p.group.visible || latest.current.state.explode < 0.8;
          if (!label.hidden) {
            const point = p.group.position
              .clone()
              .add(new T.Vector3(0, -1.3, 0))
              .project(camera);
            label.style.left = `${((point.x + 1) * el.clientWidth) / 2}px`;
            label.style.top = `${((1 - point.y) * el.clientHeight) / 2}px`;
            label.hidden = point.z > 1 || point.z < -1;
          }
        }
      } catch {
        failed = true;
        setError('The 3D renderer stopped. The full catalogue remains available. Reload to retry.');
      }
    }
    function invalidate() {
      if (!frame && !disposed && !failed) frame = requestAnimationFrame(render);
    }
    const saveCamera = () => {
      clearTimeout(cameraTimer);
      cameraTimer = setTimeout(() => {
        if (!disposed && !failed && !applying)
          latest.current.dispatch({ type: 'camera', camera: readCamera(camera, controls) });
      }, 180);
    };
    const changed = () => {
      invalidate();
      if (!applying) saveCamera();
    };
    const commitCamera = () => {
      clearTimeout(cameraTimer);
      if (!disposed && !failed && !applying)
        latest.current.dispatch({ type: 'camera', camera: readCamera(camera, controls) });
    };
    controls.addEventListener('change', changed);
    controls.addEventListener('end', commitCamera);
    let revision = -1,
      lastState: ExplorerState | undefined;
    function apply() {
      if (disposed || failed) return;
      const s = latest.current.state;
      applying = true;
      let fitted = false;
      if (s.group !== lastState?.group) {
        disposeGroup(clouds.group);
        nodes = discoveryNodes(s.group);
        clouds = createDiscovery(nodes, !s.group);
        scene.add(clouds.group);
        syncLines();
      }
      clouds.group.visible = s.explode === 0 && !s.isolate && s.illustration !== 'execution';
      const executionText = execution.update(s);
      executionLabels.forEach((l, i) => (l.textContent = executionText[i]));
      for (const mesh of clouds.meshes) {
        const node = nodes.find((n) => n.key === mesh.userData.cloudKey);
        const selected = node?.profile
          ? s.profile === node.profile
          : !s.profile && node?.capability === s.selected;
        const mat = mesh.material as T.MeshStandardMaterial;
        mat.emissiveIntensity = selected ? 1.4 : 0.65;
      }
      for (const p of registry.values())
        for (const mesh of p.meshes) {
          const mat = mesh.material as T.MeshStandardMaterial;
          const dim = s.illustration === 'execution' && !s.bodyAvailable;
          if (mat.transparent !== dim) {
            mat.transparent = dim;
            mat.needsUpdate = true;
          }
          mat.depthWrite = !dim;
          mesh.castShadow = !dim;
          mat.opacity = dim ? 0.2 : 1;
        }
      canvas.dataset.context = mechanicalContext(s.profile, s.illustration, s.example, s.step).join(
        ',',
      );
      for (const button of nodeElements.current.values()) button.hidden = !clouds.group.visible;
      const context = mechanicalContext(s.profile, s.illustration, s.example, s.step);
      const parts = context.length
        ? [...registry.values()].filter((p) => context.includes(p.domain)).map((p) => p.id)
        : s.selected
          ? capabilityById[s.selected]?.viewCoordinates.body.partIds
          : [];
      for (const p of registry.values())
        p.group.visible = s.isolate ? !!parts?.includes(p.id) : s.visible.includes(p.domain);
      decoration.visible =
        !s.isolate &&
        s.explode === 0 &&
        s.visible.length === 12 &&
        !(s.illustration === 'execution' && !s.bodyAvailable);
      stage.visible = !s.isolate && s.explode < 0.25 && s.visible.length > 0;
      applyExplosion(registry, s.explode, camera.aspect);
      robot.updateMatrixWorld(true);
      visibleBodyBounds.makeEmpty();
      for (const p of registry.values())
        if (p.group.visible) visibleBodyBounds.union(new T.Box3().setFromObject(p.group));
      highlightParts(registry, s.selected, null, s.finish, context);
      if (revision !== s.cameraRevision || !lastState) {
        clearTimeout(cameraTimer);
        revision = s.cameraRevision;
        if (s.cameraIntent === 'restore') {
          camera.position.fromArray(s.camera.position);
          controls.target.fromArray(s.camera.target);
          controls.update();
        } else {
          fitCamera(camera, controls, registry, s);
          fitted = true;
        }
      }
      lastState = s;
      applying = false;
      if (fitted) commitCamera();
      invalidate();
    }
    update.current = apply;
    let lastWidth = 0,
      lastHeight = 0;
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      if (!w || !h || (w === lastWidth && h === lastHeight)) return;
      const wasSized = lastWidth > 0;
      lastWidth = w;
      lastHeight = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (wasSized) latest.current.dispatch({ type: 'refit' });
      apply();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    const tap = new PointerTap();
    const down = (e: PointerEvent) => {
      tooltip.hidden = true;
      tap.down(e.pointerId, e.clientX, e.clientY, e.pointerType === 'touch' ? 10 : 5);
    };
    const move = (e: PointerEvent) => {
      tap.move(e.pointerId, e.clientX, e.clientY);
      if (e.buttons || e.pointerType === 'touch') {
        tooltip.hidden = true;
        return;
      }
      const cloudKey = cloudAt(e);
      if (cloudKey) {
        const node = nodes.find((n) => n.key === cloudKey);
        tooltip.hidden = false;
        tooltip.textContent = node?.preview ?? '';
        const r = canvas.getBoundingClientRect();
        tooltip.style.left = `${Math.max(8, Math.min(e.clientX - r.left + 12, r.width - 235))}px`;
        tooltip.style.top = `${Math.max(8, e.clientY - r.top - 55)}px`;
        canvas.style.cursor = 'pointer';
        hoverCloud.current(cloudKey);
        return;
      }
      const rect = canvas.getBoundingClientRect(),
        id = pickPart(e.clientX, e.clientY, rect, camera, registry);
      highlightParts(
        registry,
        latest.current.state.selected,
        id,
        latest.current.state.finish,
        mechanicalContext(
          latest.current.state.profile,
          latest.current.state.illustration,
          latest.current.state.example,
          latest.current.state.step,
        ),
      );
      canvas.style.cursor = id ? 'pointer' : 'grab';
      tooltip.hidden = !id;
      if (id) {
        tooltip.textContent = conceptsForPart(id)
          .map((c) => c.name)
          .join(' / ');
        tooltip.style.left = `${Math.max(8, Math.min(e.clientX - rect.left + 15, rect.width - 235))}px`;
        tooltip.style.top = `${Math.max(8, e.clientY - rect.top - 35)}px`;
      }
      invalidate();
    };
    const cloudAt = (e: PointerEvent) => {
      if (!clouds.group.visible) return null;
      const r = canvas.getBoundingClientRect(),
        ray = new T.Raycaster();
      ray.setFromCamera(
        new T.Vector2(
          ((e.clientX - r.left) / r.width) * 2 - 1,
          (-(e.clientY - r.top) / r.height) * 2 + 1,
        ),
        camera,
      );
      return ray.intersectObjects([
        ...clouds.meshes,
        ...[...registry.values()].filter((p) => p.group.visible).flatMap((p) => p.meshes),
      ])[0]?.object.userData.cloudKey as string | undefined;
    };
    const up = (e: PointerEvent) => {
      if (!tap.up(e.pointerId, e.clientX, e.clientY)) return;
      const cloud = cloudAt(e);
      if (cloud) {
        const node = nodes.find((n) => n.key === cloud);
        if (node) latest.current.onNavigate(nodeAction(node));
        return;
      }
      const id = pickPart(e.clientX, e.clientY, canvas.getBoundingClientRect(), camera, registry);
      if (id) {
        tooltip.hidden = true;
        latest.current.onChoose(conceptsForPart(id).map((c) => c.id));
      }
    };
    const cancel = (e: PointerEvent) => tap.cancel(e.pointerId);
    const leave = () => {
      tooltip.hidden = true;
      highlightParts(
        registry,
        latest.current.state.selected,
        null,
        latest.current.state.finish,
        mechanicalContext(
          latest.current.state.profile,
          latest.current.state.illustration,
          latest.current.state.example,
          latest.current.state.step,
        ),
      );
      invalidate();
    };
    canvas.addEventListener('pointerdown', down);
    canvas.addEventListener('pointermove', move);
    canvas.addEventListener('pointerup', up);
    canvas.addEventListener('pointercancel', cancel);
    canvas.addEventListener('pointerleave', leave);
    const lost = (e: Event) => {
      e.preventDefault();
      failed = true;
      cancelAnimationFrame(frame);
      clearTimeout(cameraTimer);
      setError(
        'The device paused this 3D session. The catalogue still works. Reload to restart the scene.',
      );
    };
    canvas.addEventListener('webglcontextlost', lost);
    resize();
    return () => {
      disposed = true;
      update.current = () => {};
      clearTimeout(cameraTimer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.removeEventListener('change', changed);
      controls.removeEventListener('end', commitCamera);
      controls.dispose();
      canvas.removeEventListener('pointerdown', down);
      canvas.removeEventListener('pointermove', move);
      canvas.removeEventListener('pointerup', up);
      canvas.removeEventListener('pointercancel', cancel);
      canvas.removeEventListener('pointerleave', leave);
      canvas.removeEventListener('webglcontextlost', lost);
      scene.traverse((o) => {
        if (o instanceof T.Mesh || o instanceof T.Line) {
          o.geometry.dispose();
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) m.dispose();
        }
      });
      key.shadow.dispose();
      env.dispose();
      renderer.dispose();
      leader.remove();
      canvas.remove();
      tooltip.remove();
      for (const l of labels.values()) l.remove();
      for (const l of executionLabels) l.remove();
    };
  }, []);
  useEffect(() => update.current(), [state]);
  return (
    <div className={`robot-scene ${error ? 'scene-unavailable' : ''}`} data-testid="robot-scene">
      <div className="canvas-host" ref={host}>
        {error && (
          <div className="scene-error" role="status">
            <strong>Explore through the catalogue</strong>
            <p>{error}</p>
          </div>
        )}
      </div>
      <CloudNavigation
        state={state}
        dispatch={onNavigate}
        elements={nodeElements}
        hover={(key) => hoverCloud.current(key)}
      />
    </div>
  );
}
