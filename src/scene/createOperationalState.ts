import * as T from 'three';
import { hostSnapshots, isTransferring, type MobilityState } from '../state/mobility';
export function createOperationalState() {
  const group = new T.Group();
  group.name = 'Local operational-state abstraction';
  const makeOrb = () => {
    const g = new T.Group();
    const core = new T.Mesh(
      new T.IcosahedronGeometry(0.105, 1),
      new T.MeshStandardMaterial({
        color: '#c2ffff',
        emissive: '#2fbecc',
        emissiveIntensity: 1.3,
        metalness: 0.25,
        roughness: 0.2,
      }),
    );
    g.add(core);
    const lattice = new T.LineSegments(
      new T.EdgesGeometry(new T.IcosahedronGeometry(0.205, 1)),
      new T.LineBasicMaterial({ color: '#128d9e', transparent: true, opacity: 0.8 }),
    );
    g.add(lattice);
    g.add(
      new T.Mesh(
        new T.SphereGeometry(0.23, 24, 16),
        new T.MeshPhysicalMaterial({
          color: '#5de5eb',
          transparent: true,
          opacity: 0.17,
          depthWrite: false,
          roughness: 0.08,
          metalness: 0.1,
          side: T.DoubleSide,
        }),
      ),
    );
    const ring = new T.Mesh(
      new T.TorusGeometry(0.275, 0.009, 6, 48),
      new T.MeshBasicMaterial({ color: '#278a96' }),
    );
    ring.rotation.x = 0.65;
    g.add(ring);
    return g;
  };
  const a = makeOrb(),
    b = makeOrb();
  group.add(a, b);
  const target = new T.Mesh(
    new T.TorusGeometry(0.39, 0.014, 8, 48),
    new T.MeshBasicMaterial({ color: '#298c95', transparent: true, opacity: 0.5 }),
  );
  group.add(target);
  const path = new T.Line(
    new T.BufferGeometry().setAttribute(
      'position',
      new T.BufferAttribute(new Float32Array(37 * 3), 3),
    ),
    new T.LineDashedMaterial({
      color: '#348d96',
      dashSize: 0.11,
      gapSize: 0.07,
      transparent: true,
      opacity: 0.7,
    }),
  );
  group.add(path);
  let from = new T.Vector3(),
    to = new T.Vector3();
  return {
    group,
    a,
    b,
    target,
    path,
    update(s: MobilityState, pa: T.Vector3, pb: T.Vector3, drag: T.Vector3 | null, progress = 1) {
      from = pa;
      to = pb;
      const [ha, hb] = hostSnapshots(s);
      const scale = drag || isTransferring(s) ? 1 : 0.28;
      a.scale.setScalar(scale);
      b.scale.setScalar(scale);
      target.scale.setScalar(drag ? 1 : 0.3);
      a.visible = !!ha.state || !!drag || isTransferring(s);
      b.visible = !!hb.state;
      a.position.copy(drag ?? pa);
      b.position.copy(pb);
      if (isTransferring(s)) {
        if (s.mode === 'migrate')
          a.position.lerpVectors(pa, pb, s.phase === 'receiving' ? progress : 1);
        else {
          b.visible = true;
          b.position.lerpVectors(pa, pb, s.phase === 'receiving' ? progress : 1);
        }
      }
      if (s.phase === 'diverged') {
        a.rotation.set(0.3, 0.4, 0.2);
        b.rotation.set(-0.3, 1.5, -0.25);
        (b.children[0] as T.Mesh<T.BufferGeometry, T.MeshStandardMaterial>).material.emissive.set(
          '#a66e22',
        );
        (b.children[1] as T.LineSegments<T.BufferGeometry, T.LineBasicMaterial>).material.color.set(
          '#a66e22',
        );
      } else {
        a.rotation.set(0, 0, 0);
        b.rotation.set(0, 0, 0);
        (b.children[0] as T.Mesh<T.BufferGeometry, T.MeshStandardMaterial>).material.emissive.set(
          '#2fbecc',
        );
        (b.children[1] as T.LineSegments<T.BufferGeometry, T.LineBasicMaterial>).material.color.set(
          '#128d9e',
        );
      }
      target.position.copy(pb);
      target.visible = !hb.state && !isTransferring(s) && !s.remote;
      path.visible = !!drag || s.remote || isTransferring(s);
      const end = drag ?? pb,
        mid = pa.clone().lerp(end, 0.5);
      mid.y += s.remote ? 0.25 : 0.5;
      const vertices = path.geometry.getAttribute('position') as T.BufferAttribute;
      const points = new T.QuadraticBezierCurve3(pa, mid, end).getPoints(36);
      points.forEach((p, i) => vertices.setXYZ(i, p.x, p.y, p.z));
      vertices.needsUpdate = true;
      path.geometry.computeBoundingSphere();
      path.computeLineDistances();
      if (s.remote) {
        a.position.copy(pa);
        a.visible = true;
        b.visible = false;
      }
    },
    face(camera: T.Camera) {
      target.quaternion.copy(camera.quaternion);
    },
    anchors: () => ({ from, to }),
  };
}
