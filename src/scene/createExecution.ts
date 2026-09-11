import * as T from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { executionSnapshot } from '../data/illustrations';
import type { ExplorerState } from '../state/explorerReducer';
/** Local diagram of execution locations. Geometry encodes no throughput or timing. */
export function createExecution() {
  const group = new T.Group();
  group.name = 'Illustrative execution arrangements';
  group.visible = false;
  const indicators: T.Mesh<T.SphereGeometry, T.MeshStandardMaterial>[] = [];
  const anchors = [new T.Vector3(-2.6, 4.0, 0.05), new T.Vector3(2.6, 4.0, 0.05)];
  for (const [i, p] of anchors.entries()) {
    const host = new T.Group();
    host.position.copy(p);
    group.add(host);
    const enclosure = new T.Mesh(
      new RoundedBoxGeometry(0.9, 1.4, 0.6, 3, 0.08),
      new T.MeshStandardMaterial({ color: '#415878', metalness: 0.55, roughness: 0.3 }),
    );
    host.add(enclosure);
    for (let j = 0; j < 3; j++) {
      const tray = new T.Mesh(
        new RoundedBoxGeometry(0.7, 0.26, 0.07, 2, 0.025),
        new T.MeshStandardMaterial({ color: '#142b43', metalness: 0.4, roughness: 0.4 }),
      );
      tray.position.set(0, 0.42 - j * 0.37, 0.33);
      host.add(tray);
    }
    const light = new T.Mesh(
      new T.SphereGeometry(0.075, 12, 8),
      new T.MeshStandardMaterial({ color: '#77e3d6', emissive: '#46a6a1', emissiveIntensity: 1 }),
    );
    light.position.set(0.24, 0.43, 0.4);
    host.add(light);
    indicators[i] = light;
  }
  const path = (points: T.Vector3[], color: string) => {
    const mesh = new T.Mesh(
      new T.TubeGeometry(new T.CatmullRomCurve3(points), 32, 0.025, 5, false),
      new T.MeshBasicMaterial({ color, transparent: true, opacity: 0.8 }),
    );
    group.add(mesh);
    return mesh;
  };
  const remote = path(
    [
      new T.Vector3(-2.1, 3.9, 0.1),
      new T.Vector3(-1.5, 4.6, 0.15),
      new T.Vector3(-0.42, 5.45, 0.15),
    ],
    '#8aede7',
  );
  const observations = path(
    [
      new T.Vector3(-0.42, 5.2, 0.05),
      new T.Vector3(-1.4, 3.45, 0.2),
      new T.Vector3(-2.1, 3.6, 0.1),
    ],
    '#94acff',
  );
  const transfer = path(
    [new T.Vector3(-2.1, 4.45, 0.0), new T.Vector3(0, 6.6, -0.1), new T.Vector3(2.1, 4.45, 0)],
    '#dba4ee',
  );
  const markerGeometry = new T.ConeGeometry(0.095, 0.24, 12);
  const marker = new T.Mesh(markerGeometry, new T.MeshBasicMaterial({ color: '#f4d5ff' }));
  group.add(marker);
  const labels = [
    ...anchors.map((p) => p.clone().add(new T.Vector3(0, -1, 0))),
    new T.Vector3(0, 6.75, 0),
    new T.Vector3(0, -0.1, 0.3),
  ];
  function update(s: ExplorerState) {
    group.visible = s.illustration === 'execution' && !s.isolate && s.explode === 0;
    const state = executionSnapshot(s.execution, s.step, s.bodyAvailable, s.recoveryAvailable);
    for (const [i, active] of [state.source, state.destination].entries()) {
      indicators[i].material.color.set(active ? '#85f0d4' : '#758398');
      indicators[i].material.emissiveIntensity = active ? 1 : 0.05;
    }
    remote.visible = observations.visible =
      s.execution === 'remote' && s.bodyAvailable && s.recoveryAvailable;
    transfer.visible = s.execution !== 'remote' && s.step > 0 && s.recoveryAvailable;
    marker.visible = transfer.visible;
    marker.position.set(s.step === 1 ? 0 : 2.03, s.step === 1 ? 6.55 : 4.64, 0);
    marker.rotation.z = s.step === 1 ? -Math.PI / 2 : -Math.PI * 0.8;
    return [
      state.sourceLabel,
      state.destinationLabel,
      s.execution === 'remote'
        ? 'Commands → body · observations → host'
        : s.execution === 'migration'
          ? 'Checkpoint + final updates'
          : 'Copied state → separate instance',
      s.bodyAvailable ? 'Robot interface' : 'Body unavailable',
    ];
  }
  return { group, labels, update };
}
