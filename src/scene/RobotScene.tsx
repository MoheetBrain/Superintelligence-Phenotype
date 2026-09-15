import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';
import * as T from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { CloudNavigation, nodeAction } from '../components/CloudNavigation';
import { HostCameraControls } from '../components/MobilityControls';
import { Modal } from '../components/Modal';
import { relevantState } from '../content/mobility';
import { discoveryNodes } from '../data/discovery';
import { mechanicalContext } from '../data/illustrations';
import { createDiscovery, disposeGroup } from './createDiscovery';
import { projected } from './discoveryLayout';
import { createRobotPair, syncRobotPresentation } from './createRobot';
import { robotSpec, U } from './robot/robotSpec';
import { createOperationalState } from './createOperationalState';
import { applyExplosion } from './explosionLayout';
import { fitCamera, readCamera } from './camera';
import { highlightParts, conceptsForPart, type PartRegistry } from './partRegistry';
import { pickPart } from './picking';
import { PointerTap } from './pointerTap';
import { capabilityById } from '../data/capabilities';
import {
  hostSnapshots,
  isTransferred,
  isTransferring,
  type MobilityState,
} from '../state/mobility';
import type { Action, ExplorerState } from '../state/explorerReducer';
interface Props {
  state: ExplorerState;
  dispatch: (a: Action) => void;
  onChoose: (ids: string[]) => void;
  onNavigate?: (a: Action) => void;
}
interface Drag {
  pointerId: number;
  x: number;
  y: number;
  startX: number;
  startY: number;
  moved: boolean;
  eligible: boolean;
}
/** Legacy execution URLs continue to display their original three-step arrangements. */
function sceneMobility(s: ExplorerState): MobilityState {
  if (s.illustration !== 'execution') return s.mobility;
  return {
    ...s.mobility,
    remote: s.execution === 'remote',
    mode: s.execution === 'copy' ? 'copy' : 'migrate',
    phase: s.step === 2 ? 'complete' : s.step === 1 ? 'restoring' : 'ready',
  };
}
function sceneHosts(s: ExplorerState) {
  const hosts = hostSnapshots(sceneMobility(s));
  if (s.illustration === 'execution')
    for (const h of hosts) {
      if (!s.recoveryAvailable) {
        h.status = 'inactive';
        h.detail = 'Execution unavailable';
        h.state = null;
      } else if (!s.bodyAvailable) h.detail = 'Body unavailable · runtime retained';
    }
  return hosts;
}
export function RobotScene({ state, dispatch, onChoose, onNavigate = dispatch }: Props) {
  const host = useRef<HTMLDivElement>(null),
    nodeElements = useRef(new Map<string, HTMLButtonElement>());
  const stateButtons = useRef(new Map<string, HTMLButtonElement>()),
    hostLabels = useRef(new Map<string, HTMLButtonElement>());
  const linkLabel = useRef<HTMLSpanElement>(null),
    dragRef = useRef<Drag | null>(null),
    suppressClick = useRef(false);
  const [drag, setDrag] = useState<Drag | null>(null),
    [error, setError] = useState(''),
    [info, setInfo] = useState(false),
    [annotationsHidden, setAnnotationsHidden] = useState(false),
    [gestureStatus, setGestureStatus] = useState('');
  const latest = useRef({ state, dispatch, onChoose, onNavigate, drag, annotationsHidden });
  latest.current = { state, dispatch, onChoose, onNavigate, drag, annotationsHidden };
  const update = useRef<() => void>(() => {}),
    hoverCloud = useRef<(key: string | null) => void>(() => {});
  const demo = sceneMobility(state),
    snapshots = sceneHosts(state);
  const canDrag =
    !error &&
    !demo.remote &&
    !isTransferring(demo) &&
    !isTransferred(demo) &&
    state.illustration !== 'execution' &&
    state.hostView !== 'host-a' &&
    state.hostView !== 'host-b' &&
    !state.isolate &&
    state.explode === 0;
  const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  useEffect(() => {
    const m = state.mobility;
    if (state.illustration === 'execution') return;
    if (!isTransferring(m) && !(m.phase === 'complete' && m.mode === 'fork')) return;
    const timer = setTimeout(
      () => dispatch({ type: 'mobility', action: { type: 'advance', revision: m.revision } }),
      reduced() ? 0 : m.phase === 'complete' ? 2500 : 650,
    );
    return () => clearTimeout(timer);
  }, [state.mobility, state.illustration, dispatch]);
  useEffect(() => {
    if (!canDrag && dragRef.current) {
      dragRef.current = null;
      setDrag(null);
    }
  }, [canDrag]);
  const dropEligible = (x: number, y: number) => {
    const target = stateButtons.current.get('host-b');
    if (!target || target.hidden) return false;
    const r = target.getBoundingClientRect();
    // Match the rectangular callout, with a small touch tolerance.
    return x >= r.left - 8 && x <= r.right + 8 && y >= r.top - 8 && y <= r.bottom + 8;
  };
  const endDrag = (cancelled = false) => {
    const d = dragRef.current;
    if (!d) return;
    suppressClick.current = d.moved;
    dragRef.current = null;
    setDrag(null);
    if (!cancelled && d.moved && d.eligible) {
      dispatch({
        type: 'mobility',
        action: { type: 'start', mode: state.mobility.mode, immediate: reduced(), fromDrop: true },
      });
      setGestureStatus('Drop accepted.');
    } else if (d.moved || cancelled)
      setGestureStatus(
        cancelled
          ? 'Drag cancelled. Operational state remains on Host A.'
          : 'Drop cancelled. Operational state returned to Host A.',
      );
  };
  const pointerDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
    if (!canDrag || e.button !== 0 || !e.isPrimary) return;
    e.preventDefault();
    e.currentTarget.focus({ preventScroll: true });
    e.currentTarget.setPointerCapture(e.pointerId);
    const d = {
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      startX: e.clientX,
      startY: e.clientY,
      moved: false,
      eligible: false,
    };
    dragRef.current = d;
    setDrag(d);
    setGestureStatus('Hold and drag into Host B.');
  };
  const pointerMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current;
    if (!d || d.pointerId !== e.pointerId) return;
    const next = {
      ...d,
      x: e.clientX,
      y: e.clientY,
      moved: d.moved || Math.hypot(e.clientX - d.startX, e.clientY - d.startY) > 6,
      eligible: dropEligible(e.clientX, e.clientY),
    };
    dragRef.current = next;
    setDrag(next);
  };
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
        '3D is unavailable in this browser. The transfer buttons, host status and full capability catalogue remain available.',
      );
      return;
    }
    let disposed = false,
      failed = false,
      frame = 0,
      applying = false,
      cameraTimer: ReturnType<typeof setTimeout> | undefined;
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
    renderer.setClearColor('#eeefea', 0);
    renderer.outputColorSpace = T.SRGBColorSpace;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.85;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    el.appendChild(renderer.domElement);
    const canvas = renderer.domElement;
    canvas.setAttribute('role', 'img');
    canvas.setAttribute(
      'aria-label',
      'Two original humanoid hosts. Drag to orbit; scroll or pinch to zoom. Use the operational-state control or action buttons to compare execution arrangements.',
    );
    const scene = new T.Scene(),
      camera = new T.PerspectiveCamera(robotSpec.cameraFov, 1, 0.05, 250),
      controls = new OrbitControls(camera, canvas);
    controls.enableDamping = false;
    const comparison =
      import.meta.env.DEV && new URLSearchParams(location.search).has('robotDebug');
    controls.minDistance = comparison ? 0.3 : 2;
    controls.maxDistance = comparison ? 150 : 40;
    controls.minPolarAngle = comparison ? 0 : T.MathUtils.degToRad(55);
    controls.maxPolarAngle = comparison ? Math.PI : T.MathUtils.degToRad(120);
    const pair = createRobotPair();
    scene.add(pair.a.robot, pair.b.robot);
    const allRegistry: PartRegistry = new Map();
    for (const [id, item] of [
      ['host-a', pair.a],
      ['host-b', pair.b],
    ] as const)
      for (const [key, p] of item.registry) allRegistry.set(`${id}:${key}`, p);
    const operational = createOperationalState();
    scene.add(operational.group);
    let debug: { prepare: () => void; dispose: () => void } | undefined;
    if (import.meta.env.DEV && new URLSearchParams(location.search).get('robotDebug') === '1') {
      import('./robot/debug/RobotDebugOverlay').then(({ createRobotDebug }) => {
        if (disposed) return;
        debug = createRobotDebug(
          el,
          pair,
          (direction) => {
            fitCamera(camera, controls, allRegistry, {
              ...latest.current.state,
              camera: {
                position: direction.toArray() as [number, number, number],
                target: [0, 0, 0],
              },
            });
            commitCamera();
            invalidate();
          },
          invalidate,
          (value) => latest.current.dispatch({ type: 'host-view', value }),
        );
        invalidate();
      });
    }
    let nodes = discoveryNodes(latest.current.state.group),
      clouds = createDiscovery(nodes, !latest.current.state.group);
    scene.add(clouds.group);
    const pmrem = new T.PMREMGenerator(renderer),
      room = new RoomEnvironment(),
      env = pmrem.fromScene(room, 0.05);
    scene.environment = env.texture;
    scene.environmentIntensity = 0.85;
    room.dispose();
    pmrem.dispose();
    scene.add(new T.HemisphereLight('#f6f7f2', '#89938c', 0.9));
    const key = new T.DirectionalLight('#fff8ed', 2.1);
    key.position.set(-3, 10, 6);
    key.target.position.set(0, 3, 0);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    Object.assign(key.shadow.camera, {
      left: -6,
      right: 6,
      top: 6,
      bottom: -6,
      near: 0.5,
      far: 24,
    });
    key.shadow.normalBias = 0.03;
    scene.add(key, key.target);
    const rim = new T.DirectionalLight('#e3ecf1', 1.4);
    rim.position.set(5, 6, -4);
    scene.add(rim);
    const fill = new T.DirectionalLight('#ffffff', 0.8);
    fill.position.set(1, 5, 8);
    scene.add(fill);
    const stage = new T.Group();
    scene.add(stage);
    const floor = new T.Mesh(
      new T.PlaneGeometry(50, 50),
      new T.MeshPhysicalMaterial({
        color: '#d7dfdc',
        roughness: 0.4,
        metalness: 0.13,
        transparent: true,
        opacity: 0.58,
      }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.006;
    floor.receiveShadow = true;
    stage.add(floor);
    const grid = new T.GridHelper(32, 64, '#9caaa8', '#b9c6c2');
    grid.position.y = -0.005;
    (grid.material as T.Material).transparent = true;
    (grid.material as T.Material).opacity = 0.09;
    stage.add(grid);
    const podiums = [-1, 1].map((side) => {
      const mesh = new T.Mesh(
        new T.CylinderGeometry(1.3, 1.34, 0.045, 64),
        new T.MeshStandardMaterial({ color: '#cbd5d1', roughness: 0.4, metalness: 0.32 }),
      );
      mesh.position.set(side * 1.85, -0.028, 0);
      mesh.receiveShadow = true;
      stage.add(mesh);
      return mesh;
    });
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = shadowCanvas.height = 64;
    const shadowContext = shadowCanvas.getContext('2d')!;
    const gradient = shadowContext.createRadialGradient(32, 32, 3, 32, 32, 32);
    gradient.addColorStop(0, '#24353188');
    gradient.addColorStop(0.45, '#24353155');
    gradient.addColorStop(1, '#24353100');
    shadowContext.fillStyle = gradient;
    shadowContext.fillRect(0, 0, 64, 64);
    const contactTexture = new T.CanvasTexture(shadowCanvas);
    const contacts = [pair.a, pair.b].map(() => {
      const group = new T.Group();
      for (const side of [-1, 1]) {
        const mesh = new T.Mesh(
          new T.PlaneGeometry(0.62, 1.02),
          new T.MeshBasicMaterial({ map: contactTexture, transparent: true, depthWrite: false }),
        );
        mesh.rotation.x = -Math.PI / 2;
        mesh.position.set(side * U(robotSpec.leg.hipX), -0.003, U(robotSpec.leg.footForward));
        group.add(mesh);
      }
      stage.add(group);
      return group;
    });
    const tooltip = document.createElement('div');
    tooltip.className = 'part-tooltip';
    tooltip.hidden = true;
    tooltip.setAttribute('aria-hidden', 'true');
    el.appendChild(tooltip);
    const labels = new Map<string, HTMLSpanElement>();
    for (const p of pair.a.registry.values()) {
      const label = document.createElement('span');
      label.className = 'part-label';
      label.hidden = true;
      label.setAttribute('aria-hidden', 'true');
      el.appendChild(label);
      labels.set(p.id, label);
    }
    const visibleBounds = new T.Box3(),
      anchors = [new T.Vector3(), new T.Vector3()];
    const leaders = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    leaders.classList.add('state-leaders');
    leaders.setAttribute('aria-hidden', 'true');
    const leaderLines = anchors.map(() => {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      leaders.appendChild(path);
      return path;
    });
    el.appendChild(leaders);
    let phaseStart = 0,
      lastPhase = '',
      lastWidth = 0,
      lastHeight = 0,
      revision = -1,
      lastState: ExplorerState | undefined;
    function invalidate() {
      if (!frame && !disposed && !failed) frame = requestAnimationFrame(render);
    }
    function place(button: HTMLElement | undefined | null, p: T.Vector3, show = true) {
      if (!button) return;
      const v = projected(p, camera, el.clientWidth, el.clientHeight);
      button.hidden =
        !show || !v.visible || v.x < 0 || v.x > el.clientWidth || v.y < 0 || v.y > el.clientHeight;
      button.style.left = `${v.x}px`;
      button.style.top = `${v.y}px`;
    }
    function render() {
      frame = 0;
      if (disposed || failed) return;
      try {
        const { state: s, drag: d } = latest.current,
          m = sceneMobility(s),
          compact = camera.aspect < 0.85;
        const legacy = s.illustration === 'execution',
          animated = isTransferring(m) && !legacy && !reduced();
        const progress = legacy
          ? 0.5
          : m.fromDrop
            ? 1
            : Math.min(1, (performance.now() - phaseStart) / 650);
        let dragPoint: T.Vector3 | null = null;
        if (d) {
          const rect = canvas.getBoundingClientRect(),
            ray = new T.Raycaster();
          ray.setFromCamera(
            new T.Vector2(
              ((d.x - rect.left) / rect.width) * 2 - 1,
              (-(d.y - rect.top) / rect.height) * 2 + 1,
            ),
            camera,
          );
          dragPoint = new T.Vector3();
          const normal = camera.getWorldDirection(new T.Vector3());
          ray.ray.intersectPlane(
            new T.Plane().setFromNormalAndCoplanarPoint(normal, anchors[0]),
            dragPoint,
          );
        }
        operational.update(m, anchors[0], anchors[1], dragPoint, progress);
        operational.face(camera);
        operational.a.visible = operational.a.visible && pair.a.robot.visible;
        operational.b.visible = operational.b.visible && pair.b.robot.visible;
        operational.target.visible = operational.target.visible && pair.b.robot.visible;
        operational.path.visible =
          operational.path.visible && pair.a.robot.visible && pair.b.robot.visible;
        operational.group.visible =
          !latest.current.annotationsHidden &&
          !s.isolate &&
          s.explode === 0 &&
          s.visible.length === 12;
        if (legacy && !s.recoveryAvailable) {
          operational.a.visible = operational.b.visible = false;
          operational.path.visible = false;
        }
        for (const mesh of clouds.meshes)
          if (mesh.geometry instanceof T.TorusGeometry) mesh.quaternion.copy(camera.quaternion);
        debug?.prepare();
        if (debug) operational.group.visible = clouds.group.visible = false;
        renderer.render(scene, camera);
        canvas.dataset.renderCount = String(Number(canvas.dataset.renderCount ?? 0) + 1);
        canvas.dataset.triangles = String(renderer.info.render.triangles);
        canvas.dataset.drawCalls = String(renderer.info.render.calls);
        canvas.dataset.polarAngle = String(controls.getPolarAngle());
        canvas.dataset.cameraDistance = String(controls.getDistance());
        canvas.dataset.geometries = String(renderer.info.memory.geometries);
        canvas.dataset.hostView = s.hostView;
        canvas.dataset.transferPhase = m.phase;
        canvas.dataset.stateHosts = [
          operational.a.visible && operational.group.visible ? 'a' : '',
          operational.b.visible && operational.group.visible ? 'b' : '',
        ]
          .filter(Boolean)
          .join(',');
        const hide =
          s.explode > 0 || s.isolate || s.visible.length !== 12 || latest.current.annotationsHidden;
        leaders.style.display = hide || debug ? 'none' : '';
        leaders.setAttribute('viewBox', `0 0 ${el.clientWidth} ${el.clientHeight}`);
        for (const [i, id] of (['host-a', 'host-b'] as const).entries()) {
          const item = i === 0 ? pair.a : pair.b;
          const labelAnchor = item.robot.position.clone().add(new T.Vector3(0, 6.55, 0));
          place(hostLabels.current.get(id), labelAnchor, item.robot.visible && !hide);
          const orb = i === 0 ? operational.a : operational.b;
          const button = stateButtons.current.get(id);
          const active = item.robot.visible && !hide && (i === 1 || orb.visible);
          const anchor = projected(anchors[i], camera, el.clientWidth, el.clientHeight);
          const floorPoint = projected(
            item.robot.position.clone(),
            camera,
            el.clientWidth,
            el.clientHeight,
          );
          const side = anchor.x < el.clientWidth / 2 ? -1 : 1;
          const narrow = el.clientWidth < 620;
          const position =
            i === 0 && d
              ? projected(orb.position, camera, el.clientWidth, el.clientHeight)
              : {
                  x: narrow ? el.clientWidth * (i === 0 ? 0.25 : 0.75) : anchor.x + side * 148,
                  y: narrow ? floorPoint.y + 35 : anchor.y - 12,
                };
          const x = T.MathUtils.clamp(position.x, 80, el.clientWidth - 80);
          const y = T.MathUtils.clamp(position.y, 35, el.clientHeight - 27);
          if (button) {
            button.hidden = !active || !anchor.visible;
            button.style.left = `${x}px`;
            button.style.top = `${y}px`;
          }
          leaderLines[i].style.display = active && anchor.visible && !(i === 0 && d) ? '' : 'none';
          leaderLines[i].setAttribute(
            'd',
            `M${anchor.x},${anchor.y} L${narrow ? anchor.x : x},${narrow ? y - 25 : anchor.y} L${x},${y}`,
          );
        }
        place(
          linkLabel.current,
          anchors[0]
            .clone()
            .lerp(anchors[1], 0.5)
            .add(new T.Vector3(0, 0.45, 0)),
          m.remote && !hide,
        );
        let index = 0;
        for (const p of (s.hostView === 'host-b' ? pair.b.registry : pair.a.registry).values()) {
          const label = labels.get(p.id)!;
          label.textContent = el.clientHeight < 450 ? String(++index).padStart(2, '0') : p.label;
          place(
            label,
            p.group.getWorldPosition(new T.Vector3()).add(new T.Vector3(0, -1.25, 0)),
            p.group.visible && s.explode > 0.8,
          );
        }
        const ys: number[] = [];
        if (!visibleBounds.isEmpty())
          for (const x of [visibleBounds.min.x, visibleBounds.max.x])
            for (const y of [visibleBounds.min.y, visibleBounds.max.y])
              for (const z of [visibleBounds.min.z, visibleBounds.max.z])
                ys.push(
                  projected(new T.Vector3(x, y, z), camera, el.clientWidth, el.clientHeight).y,
                );
        if (ys.length)
          canvas.dataset.bodyHeightRatio = String(
            (Math.max(...ys) - Math.min(...ys)) / el.clientHeight,
          );
        el.dataset.staggered = String(compact);
        if (animated) invalidate();
      } catch {
        failed = true;
        setError(
          'The 3D renderer stopped. The transfer controls and catalogue remain available. Reload to retry.',
        );
      }
    }
    function commitCamera() {
      clearTimeout(cameraTimer);
      if (!disposed && !failed && !applying)
        latest.current.dispatch({ type: 'camera', camera: readCamera(camera, controls) });
    }
    const changed = () => {
      invalidate();
      if (!applying) {
        clearTimeout(cameraTimer);
        cameraTimer = setTimeout(commitCamera, 180);
      }
    };
    controls.addEventListener('change', changed);
    controls.addEventListener('end', commitCamera);
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
      }
      clouds.group.visible =
        s.explode === 0 &&
        !s.isolate &&
        s.illustration !== 'execution' &&
        !latest.current.annotationsHidden;
      for (const button of nodeElements.current.values()) button.hidden = !clouds.group.visible;
      const m = sceneMobility(s),
        phaseKey = `${m.revision}:${m.phase}`;
      if (phaseKey !== lastPhase) {
        lastPhase = phaseKey;
        phaseStart = performance.now();
      }
      const context = mechanicalContext(s.profile, s.illustration, s.example, s.step);
      canvas.dataset.context = context.join(',');
      const selectedParts = context.length
        ? [...pair.a.registry.values()].filter((p) => context.includes(p.domain)).map((p) => p.id)
        : s.selected
          ? capabilityById[s.selected]?.viewCoordinates.body.partIds
          : [];
      const single =
        s.explode > 0 || s.isolate || s.hostView === 'host-a' || s.hostView === 'host-b';
      const narrow = camera.aspect < 0.85;
      pair.a.robot.position.set(single ? 0 : narrow ? -1.2 : -1.85, 0, 0);
      pair.b.robot.position.set(single ? 0 : narrow ? 1.2 : 1.85, 0, narrow ? -1.6 : 0);
      pair.a.robot.visible = s.hostView !== 'host-b';
      pair.b.robot.visible = !single || s.hostView === 'host-b';
      for (const [i, item] of [pair.a, pair.b].entries()) {
        const robotVisible = item.robot.visible;
        for (const p of item.registry.values())
          p.group.visible =
            robotVisible &&
            (s.isolate ? !!selectedParts?.includes(p.id) : s.visible.includes(p.domain));
        item.decoration.visible =
          robotVisible && !s.isolate && s.explode === 0 && s.visible.length === 12;
        applyExplosion(item.registry, s.explode, camera.aspect);
        syncRobotPresentation(item, s.explode > 0);
        highlightParts(item.registry, s.selected, null, s.finish, context);
        const snap = sceneHosts(s)[i];
        const seenMaterials = new Set<T.Material>();
        for (const p of item.registry.values())
          for (const mesh of p.meshes) {
            const mat = mesh.material as T.MeshStandardMaterial;
            const unavailable = s.illustration === 'execution' && !s.bodyAvailable;
            mesh.castShadow = !unavailable;
            if (seenMaterials.has(mat)) continue;
            seenMaterials.add(mat);
            mat.transparent = unavailable;
            mat.depthWrite = !unavailable;
            mat.opacity = unavailable ? 0.2 : 1;
            if (snap.status === 'inactive' || (i === 0 && latest.current.drag)) {
              mat.color.multiplyScalar(0.62);
              mat.emissiveIntensity = 0;
            }
            if (i === 1 && latest.current.drag?.eligible) {
              mat.emissive.set('#20a3aa');
              mat.emissiveIntensity = 0.22;
            }
            if (i === 1 && m.remote) {
              mat.emissive.set('#50898d');
              mat.emissiveIntensity = 0.12;
            }
          }
        item.robot.updateMatrixWorld(true);
        anchors[i].copy(item.robot.position).add(new T.Vector3(0, 4.35, 0.72));
        podiums[i].position.x = item.robot.position.x;
        podiums[i].position.z = item.robot.position.z;
        podiums[i].visible = robotVisible;
        contacts[i].position.copy(item.robot.position);
        contacts[i].visible = robotVisible;
      }
      stage.visible = !s.isolate && s.explode < 0.25 && s.visible.length > 0;
      operational.group.visible = !s.isolate && s.explode === 0 && s.visible.length === 12;
      visibleBounds.makeEmpty();
      for (const p of allRegistry.values())
        if (p.group.visible) visibleBounds.union(new T.Box3().setFromObject(p.group));
      controls.enabled = !latest.current.drag;
      controls.maxDistance = comparison ? 150 : s.explode > 0 ? 120 : 40;
      if (revision !== s.cameraRevision || !lastState) {
        clearTimeout(cameraTimer);
        revision = s.cameraRevision;
        if (s.cameraIntent === 'restore') {
          camera.position.fromArray(s.camera.position);
          controls.target.fromArray(s.camera.target);
          controls.update();
        } else {
          fitCamera(camera, controls, allRegistry, s);
          fitted = true;
        }
      }
      lastState = s;
      applying = false;
      if (fitted) commitCamera();
      invalidate();
    }
    update.current = apply;
    const resize = () => {
      const w = el.clientWidth,
        h = el.clientHeight;
      if (!w || !h || (w === lastWidth && h === lastHeight)) return;
      const sized = lastWidth > 0;
      lastWidth = w;
      lastHeight = h;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (sized) latest.current.dispatch({ type: 'refit' });
      apply();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    hoverCloud.current = (key) => {
      for (const mesh of clouds.meshes)
        (mesh.material as T.MeshStandardMaterial).emissiveIntensity =
          mesh.userData.cloudKey === key ? 1.3 : 0.5;
      invalidate();
    };
    const tap = new PointerTap();
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
        ...[...allRegistry.values()].filter((p) => p.group.visible).flatMap((p) => p.meshes),
      ])[0]?.object.userData.cloudKey as string | undefined;
    };
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
        cloudKey = cloudAt(e),
        id = cloudKey ? null : pickPart(e.clientX, e.clientY, rect, camera, allRegistry);
      canvas.style.cursor = id || cloudKey ? 'pointer' : 'grab';
      tooltip.hidden = !id && !cloudKey;
      if (!tooltip.hidden) {
        tooltip.textContent = cloudKey
          ? (nodes.find((n) => n.key === cloudKey)?.preview ?? '')
          : conceptsForPart(id!)
              .map((c) => c.name)
              .join(' / ');
        tooltip.style.left = `${Math.max(8, Math.min(e.clientX - rect.left + 12, rect.width - 235))}px`;
        tooltip.style.top = `${Math.max(8, e.clientY - rect.top - 48)}px`;
      }
    };
    const up = (e: PointerEvent) => {
      if (!tap.up(e.pointerId, e.clientX, e.clientY)) return;
      const cloud = cloudAt(e);
      if (cloud) {
        const node = nodes.find((n) => n.key === cloud);
        if (node) latest.current.onNavigate(nodeAction(node));
        return;
      }
      const id = pickPart(
        e.clientX,
        e.clientY,
        canvas.getBoundingClientRect(),
        camera,
        allRegistry,
      );
      if (id) {
        tooltip.hidden = true;
        latest.current.onChoose(conceptsForPart(id).map((c) => c.id));
      }
    };
    const cancel = (e: PointerEvent) => tap.cancel(e.pointerId),
      leave = () => {
        tooltip.hidden = true;
      };
    const lost = (e: Event) => {
      e.preventDefault();
      failed = true;
      cancelAnimationFrame(frame);
      clearTimeout(cameraTimer);
      setError(
        'The device paused this 3D session. The catalogue and transfer controls still work. Reload to restart the scene.',
      );
    };
    const listeners = {
      pointerdown: down,
      pointermove: move,
      pointerup: up,
      pointercancel: cancel,
      pointerleave: leave,
    };
    for (const [name, listener] of Object.entries(listeners))
      canvas.addEventListener(name, listener as EventListener);
    canvas.addEventListener('webglcontextlost', lost);
    resize();
    return () => {
      disposed = true;
      update.current = () => {};
      hoverCloud.current = () => {};
      clearTimeout(cameraTimer);
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.removeEventListener('change', changed);
      controls.removeEventListener('end', commitCamera);
      controls.dispose();
      for (const [name, listener] of Object.entries(listeners))
        canvas.removeEventListener(name, listener as EventListener);
      canvas.removeEventListener('webglcontextlost', lost);
      debug?.dispose();
      const geometries = new Set<T.BufferGeometry>(),
        materials = new Set<T.Material>();
      scene.traverse((o) => {
        if (o instanceof T.Mesh || o instanceof T.Line || o instanceof T.Points) {
          geometries.add(o.geometry);
          for (const mat of Array.isArray(o.material) ? o.material : [o.material])
            materials.add(mat);
        }
      });
      for (const g of geometries) g.dispose();
      for (const m of materials) m.dispose();
      key.shadow.dispose();
      env.dispose();
      contactTexture.dispose();
      renderer.dispose();
      canvas.remove();
      tooltip.remove();
      leaders.remove();
      for (const l of labels.values()) l.remove();
    };
  }, []);
  useEffect(() => update.current(), [state, drag, annotationsHidden]);
  return (
    <div
      className={`robot-scene dual-host-scene ${error ? 'scene-unavailable' : ''}`}
      data-testid="robot-scene"
    >
      <HostCameraControls
        value={state.hostView}
        dispatch={onNavigate}
        annotationsHidden={annotationsHidden}
        onToggleAnnotations={() => setAnnotationsHidden((v) => !v)}
      />
      <div className="canvas-host" ref={host}>
        {error ? (
          <div className="scene-error" role="status">
            <strong>Explore through the controls and catalogue</strong>
            <p>{error}</p>
          </div>
        ) : (
          <>
            {snapshots.map((h, i) => (
              <button
                key={h.id}
                className="floating-host-label"
                data-host={h.id}
                ref={(el) => {
                  if (el) hostLabels.current.set(h.id, el);
                  else hostLabels.current.delete(h.id);
                }}
                aria-label={`Inspect ${i === 0 ? 'Host A graphite' : 'Host B pearl'}`}
                onClick={() => onNavigate({ type: 'host-view', value: h.id })}
              >
                <strong>
                  {i === 0 ? 'HOST A' : 'HOST B'}{' '}
                  <span>{i === 0 ? 'GRAPHITE / TITANIUM' : 'PEARL / GRAPHITE'}</span>
                </strong>
                <small>
                  {h.status.toUpperCase()} · {h.detail}
                </small>
              </button>
            ))}
            <button
              ref={(el) => {
                if (el) stateButtons.current.set('host-a', el);
                else stateButtons.current.delete('host-a');
              }}
              className={`operational-handle ${drag ? 'dragging' : ''}`}
              aria-label="Extract operational state from Host A"
              aria-describedby="state-drag-help"
              onPointerDown={pointerDown}
              onPointerMove={pointerMove}
              onPointerUp={() => endDrag()}
              onPointerCancel={() => endDrag(true)}
              onLostPointerCapture={() => {
                if (dragRef.current) endDrag(true);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Escape' && dragRef.current) {
                  e.stopPropagation();
                  endDrag(true);
                }
              }}
              onClick={() => {
                if (!suppressClick.current) setInfo(true);
                suppressClick.current = false;
              }}
            >
              <span className="state-handle-ring" />
              <span className="state-handle-label">
                Operational State
                <small>
                  {canDrag ? 'Hold to extract · drag to Host B' : 'Inspect state abstraction'}
                </small>
              </span>
            </button>
            <button
              ref={(el) => {
                if (el) stateButtons.current.set('host-b', el);
                else stateButtons.current.delete('host-b');
              }}
              className={`operational-target ${drag?.eligible ? 'eligible' : ''}`}
              aria-label="Host B compatible execution environment"
              onClick={() => setInfo(true)}
            >
              <span />
              <small>
                {drag?.eligible
                  ? 'Compatible host'
                  : snapshots[1].state
                    ? 'State restored'
                    : demo.remote
                      ? 'Actuator / no local agent'
                      : 'Compatible host'}
              </small>
            </button>
            <span className="communication-label" ref={linkLabel}>
              commands + observations
            </span>
            {drag && (
              <div className="drag-guidance" role="status">
                {drag.eligible
                  ? 'Compatible host · release to restore state'
                  : 'Drop into a compatible execution environment'}
              </div>
            )}
          </>
        )}
      </div>
      <p id="state-drag-help" className="sr-only">
        Hold and drag Operational State into Host B. Press Escape to cancel. The Migrate, Copy and
        Fork buttons below are equivalent keyboard alternatives.
      </p>
      <span className="sr-only" role="status">
        {gestureStatus}
      </span>
      <CloudNavigation
        state={state}
        dispatch={onNavigate}
        elements={nodeElements}
        hover={(key) => hoverCloud.current(key)}
      />
      {info && (
        <Modal label="Operational State" onClose={() => setInfo(false)}>
          <h2>Operational State</h2>
          <p>
            This is a visual abstraction of information required for functional continuation. It is
            not a claim about consciousness or personal identity.
          </p>
          <ul>
            {relevantState.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            The demo changes local visual records only. It does not transfer files, models,
            credentials, permissions or running software between machines.
          </p>
        </Modal>
      )}
    </div>
  );
}
