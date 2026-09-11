import { useEffect, useRef, useState } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { createRobot } from './createRobot';
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
}
export function RobotScene({ state, dispatch, onChoose }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const latest = useRef({ state, dispatch, onChoose });
  latest.current = { state, dispatch, onChoose };
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
        '3D is unavailable in this browser. Explore every concept using the catalogue below or beside this scene.',
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
    const pmrem = new T.PMREMGenerator(renderer);
    const room = new RoomEnvironment();
    const env = pmrem.fromScene(room, 0.04);
    scene.environment = env.texture;
    scene.environmentIntensity = 0.75;
    room.dispose();
    pmrem.dispose();
    scene.add(new T.HemisphereLight('#edf5ff', '#6c756c', 1.1));
    const key = new T.DirectionalLight('#fff4df', 2.3);
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
    const rim = new T.DirectionalLight('#d0e9ff', 2.1);
    rim.position.set(4, 4, -4);
    scene.add(rim);
    const stage = new T.Group();
    scene.add(stage);
    const floor = new T.Mesh(new T.PlaneGeometry(30, 30), new T.ShadowMaterial({ opacity: 0.1 }));
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
        renderer.render(scene, camera);
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
      const parts = s.selected ? capabilityById[s.selected]?.viewCoordinates.body.partIds : [];
      for (const p of registry.values())
        p.group.visible = s.isolate ? !!parts?.includes(p.id) : s.visible.includes(p.domain);
      decoration.visible = !s.isolate && s.explode === 0 && s.visible.length === 12;
      stage.visible = !s.isolate && s.explode < 0.25 && s.visible.length > 0;
      applyExplosion(registry, s.explode, camera.aspect);
      robot.updateMatrixWorld(true);
      highlightParts(registry, s.selected, null);
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
      const rect = canvas.getBoundingClientRect(),
        id = pickPart(e.clientX, e.clientY, rect, camera, registry);
      highlightParts(registry, latest.current.state.selected, id);
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
    const up = (e: PointerEvent) => {
      if (!tap.up(e.pointerId, e.clientX, e.clientY)) return;
      const id = pickPart(e.clientX, e.clientY, canvas.getBoundingClientRect(), camera, registry);
      if (id) {
        tooltip.hidden = true;
        latest.current.onChoose(conceptsForPart(id).map((c) => c.id));
      }
    };
    const cancel = (e: PointerEvent) => tap.cancel(e.pointerId);
    const leave = () => {
      tooltip.hidden = true;
      highlightParts(registry, latest.current.state.selected, null);
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
        if (o instanceof T.Mesh || o instanceof T.LineSegments) {
          o.geometry.dispose();
          for (const m of Array.isArray(o.material) ? o.material : [o.material]) m.dispose();
        }
      });
      key.shadow.dispose();
      env.dispose();
      renderer.dispose();
      canvas.remove();
      tooltip.remove();
      for (const l of labels.values()) l.remove();
    };
  }, []);
  useEffect(() => update.current(), [state]);
  return (
    <div className="robot-scene" ref={host} data-testid="robot-scene">
      {error && (
        <div className="scene-error" role="status">
          <strong>Explore through the catalogue</strong>
          <p>{error}</p>
        </div>
      )}
    </div>
  );
}
