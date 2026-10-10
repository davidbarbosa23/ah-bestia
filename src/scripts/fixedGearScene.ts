import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js';
import { driveRotation, kneePosition, skidPatchAngles } from '../utils/fixedGearMotion';

export interface RideState { ratio: number; patches: number; rpm: number; }
export interface BikeScene {
  update(state: RideState): void;
  setPlaying(playing: boolean): void;
  reset(side?: boolean): void;
  dispose(): void;
}

/** No model, texture, environment-map or font requests: all geometry is local. */
export function createBikeScene(host: HTMLElement, onUnavailable: () => void): BikeScene {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setClearColor(0, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  const canvas = renderer.domElement;
  canvas.tabIndex = 0;
  canvas.setAttribute('role', 'img');
  canvas.setAttribute('aria-label', host.dataset.label ?? '');
  canvas.setAttribute('aria-describedby', 'fg-keyboard-help');
  host.append(canvas);

  // Canvas resolves the site's oklch tokens to sRGB for Three.js materials.
  const swatch = document.createElement('canvas').getContext('2d')!;
  const tokenColor = (token: string) => {
    swatch.clearRect(0, 0, 1, 1);
    swatch.fillStyle = getComputedStyle(host).getPropertyValue(token).trim();
    swatch.fillRect(0, 0, 1, 1);
    const [r, g, b] = swatch.getImageData(0, 0, 1, 1).data;
    return new THREE.Color().setRGB(r / 255, g / 255, b / 255, THREE.SRGBColorSpace);
  };
  const material = (token: string, metalness = 0) => new THREE.MeshStandardMaterial({ color: tokenColor(token), flatShading: true, roughness: 0.76, metalness });
  const frame = material('--color-bike-frame', 0.35);
  const jersey = material('--color-bike-jersey');
  const skin = material('--color-bike-skin');
  const rubber = material('--color-bike-tire');
  const metal = material('--color-bike-metal', 0.6);
  const shorts = material('--color-bike-shorts');
  const patchMaterial = new THREE.MeshBasicMaterial({ color: tokenColor('--color-bike-patch') });
  const scene = new THREE.Scene();
  scene.add(new THREE.HemisphereLight(0xffffff, 0x718096, 2.3));
  const key = new THREE.DirectionalLight(0xffffff, 3.3);
  key.position.set(-3, 6, 5);
  scene.add(key);
  const rimLight = new THREE.DirectionalLight(0xb6d9ff, 2);
  rimLight.position.set(4, 3, -4);
  scene.add(rimLight);
  const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 40);
  const controls = new OrbitControls(camera, canvas);
  controls.enablePan = false;
  controls.enableZoom = false; // Leave page scrolling available above the model.
  controls.enableDamping = false; // Render on demand when paused.
  controls.minPolarAngle = Math.PI * 0.2;
  controls.maxPolarAngle = Math.PI * 0.53;
  controls.rotateSpeed = 0.7;
  controls.target.set(0, 1.15, 0);
  canvas.style.touchAction = 'pan-y';
  const still = new THREE.Group();
  scene.add(still);
  const v = (x: number, y: number, z = 0) => new THREE.Vector3(x, y, z);
  const up = v(0, 1);
  const direction = new THREE.Vector3();
  const positionSegment = (mesh: THREE.Mesh, a: THREE.Vector3, b: THREE.Vector3) => {
    direction.subVectors(b, a);
    mesh.position.copy(a).add(b).multiplyScalar(0.5);
    mesh.scale.y = direction.length();
    mesh.quaternion.setFromUnitVectors(up, direction.normalize());
  };
  const segment = (a: THREE.Vector3, b: THREE.Vector3, radius: number, mat: THREE.Material, parent = still, topRadius = radius) => {
    const mesh = new THREE.Mesh(new THREE.CylinderGeometry(topRadius, radius, 1, 6), mat);
    positionSegment(mesh, a, b);
    parent.add(mesh);
    return mesh;
  };
  const facet = (position: THREE.Vector3, scale: THREE.Vector3, mat: THREE.Material, detail = 0, parent = still) => {
    const mesh = new THREE.Mesh(new THREE.IcosahedronGeometry(1, detail), mat);
    mesh.position.copy(position);
    mesh.scale.copy(scale);
    parent.add(mesh);
    return mesh;
  };
  // Multiple cross-sections give clothing and anatomy a rounded, tapered silhouette.
  // Ten radial segments preserve broad low-poly facets without box-like joints.
  const organicSegment = (a: THREE.Vector3, b: THREE.Vector3, radii: number[], mat: THREE.Material, parent = still) => {
    const profile = radii.map((radius, i) => new THREE.Vector2(radius, i / (radii.length - 1) - 0.5));
    const mesh = new THREE.Mesh(new THREE.LatheGeometry(profile, 10), mat);
    positionSegment(mesh, a, b);
    parent.add(mesh);
    return mesh;
  };
  const rear = v(-0.94, 0.59);
  const front = v(1.02, 0.59);
  const bb = v(-0.12, 0.55);
  const seat = v(-0.38, 1.32);
  const headTop = v(0.68, 1.35);
  const headBottom = v(0.77, 1.1);
  [[seat, bb], [seat, headTop], [headBottom, bb], [headTop, headBottom]].forEach(([a, b]) => segment(a, b, 0.037, frame));
  for (const z of [-0.08, 0.08]) {
    segment(v(rear.x, rear.y, z), seat, 0.022, frame);
    segment(v(rear.x, rear.y, z), bb, 0.023, frame);
    segment(v(front.x, front.y, z), v(headBottom.x, headBottom.y, z), 0.025, metal);
  }
  segment(seat, v(-0.42, 1.48), 0.022, metal);
  facet(v(-0.43, 1.46), v(0.23, 0.045, 0.11), rubber);
  segment(headTop, v(0.64, 1.48), 0.027, metal);
  segment(v(0.64, 1.48), v(0.83, 1.5), 0.028, metal);
  segment(v(0.83, 1.5, -0.3), v(0.83, 1.5, 0.3), 0.025, rubber);
  // Compact drop bars, with the rider holding the hoods.
  for (const z of [-0.3, 0.3]) {
    const curve = new THREE.CatmullRomCurve3([v(0.83, 1.5, z), v(0.98, 1.47, z), v(1.02, 1.34, z), v(0.9, 1.28, z), v(0.79, 1.29, z)]);
    still.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 12, 0.023, 5, false), rubber));
  }

  const wheels: THREE.Group[] = [];
  const radius = 0.55;
  for (const center of [rear, front]) {
    const wheel = new THREE.Group();
    wheel.position.copy(center);
    wheel.add(new THREE.Mesh(new THREE.TorusGeometry(radius, 0.039, 6, 64), rubber));
    wheel.add(new THREE.Mesh(new THREE.TorusGeometry(0.509, 0.027, 4, 64), metal));
    // A single valve gives a non-repeating reference for actual wheel rotation.
    segment(v(0, 0.45), v(0, 0.49), 0.012, rubber, wheel);
    const spokes: number[] = [];
    for (let i = 0; i < 24; i++) {
      const a = i * Math.PI / 12;
      spokes.push(0, 0, i % 2 ? -0.035 : 0.035, Math.cos(a) * 0.5, Math.sin(a) * 0.5, 0);
    }
    const spokeGeometry = new THREE.BufferGeometry();
    spokeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(spokes, 3));
    wheel.add(new THREE.LineSegments(spokeGeometry, new THREE.LineBasicMaterial({ color: tokenColor('--color-bike-metal'), transparent: true, opacity: 0.7 })));
    segment(v(0, 0, -0.08), v(0, 0, 0.08), 0.048, metal, wheel);
    scene.add(wheel);
    wheels.push(wheel);
  }
  const patches = new THREE.Group();
  wheels[0].add(patches);
  let patchCount = 0;
  const updatePatches = (count: number) => {
    if (count === patchCount) return;
    const previous = patches.children[0] as THREE.InstancedMesh | undefined;
    previous?.geometry.dispose();
    previous?.dispose();
    patches.clear();
    const arc = Math.min(0.12, Math.PI * 2 / count * 0.42);
    // Each marker wraps the tire tread so it remains visible from either side.
    const geometry = new THREE.TorusGeometry(radius, 0.043, 6, 4, arc);
    const markers = new THREE.InstancedMesh(geometry, patchMaterial, count);
    const matrix = new THREE.Matrix4();
    skidPatchAngles(count).forEach((angle, index) => {
      markers.setMatrixAt(index, matrix.makeRotationZ(angle - arc / 2));
    });
    patches.add(markers);
    patchCount = count;
    canvas.dataset.patches = String(count);
  };
  const crank = new THREE.Group();
  crank.position.copy(bb);
  const chainring = new THREE.Mesh(new THREE.TorusGeometry(0.175, 0.016, 4, 48), metal);
  chainring.position.z = 0.095;
  crank.add(chainring);
  for (let i = 0; i < 5; i++) {
    const angle = i * Math.PI * 2 / 5;
    segment(v(0, 0, 0.095), v(Math.cos(angle) * 0.17, Math.sin(angle) * 0.17, 0.095), 0.015, metal, crank);
  }
  for (const side of [-1, 1]) segment(v(0, 0, side * 0.12), v(side * 0.255, 0, side * 0.12), 0.018, metal, crank);
  scene.add(crank);
  const cog = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.013, 4, 24), metal);
  cog.position.copy(rear).add(v(0, 0, 0.095));
  still.add(cog);
  const chainCurve = new THREE.CatmullRomCurve3([
    v(rear.x, rear.y + 0.065, 0.1), v(bb.x, bb.y + 0.175, 0.1), v(bb.x + 0.175, bb.y, 0.1),
    v(bb.x, bb.y - 0.175, 0.1), v(rear.x, rear.y - 0.065, 0.1), v(rear.x - 0.065, rear.y, 0.1),
  ], true, 'centripetal');
  still.add(new THREE.Mesh(new THREE.TubeGeometry(chainCurve, 56, 0.009, 4, true), metal));

  // Connected anatomy with a fitted jersey, cycling shorts, calves and a vented helmet.
  const hips = v(-0.39, 1.52);
  const shoulders = v(0.22, 2.02);
  const torso = organicSegment(v(-0.4, 1.5), v(0.28, 2.08), [0.12, 0.2, 0.22, 0.245, 0.255, 0.21, 0.1], jersey);
  torso.scale.x = 0.78;
  torso.scale.z = 1.08;
  facet(v(-0.39, 1.53), v(0.22, 0.18, 0.235), shorts, 2);
  organicSegment(shoulders, v(0.34, 2.13), [0.073, 0.08, 0.071], skin);
  const head = facet(v(0.4, 2.22), v(0.13, 0.175, 0.125), skin, 2);
  head.rotation.z = 0.12;
  // Jaw, nose, ears and wraparound glasses give the face a readable profile.
  facet(v(0.45, 2.13), v(0.09, 0.07, 0.095), skin, 1);
  facet(v(0.525, 2.23), v(0.043, 0.05, 0.037), skin, 0);
  for (const side of [-1, 1]) {
    facet(v(0.365, 2.23, side * 0.12), v(0.035, 0.048, 0.021), skin, 1);
    segment(v(0.34, 2.31, side * 0.13), v(0.4, 2.08, side * 0.09), 0.008, rubber);
  }
  const helmet = facet(v(0.38, 2.35), v(0.185, 0.12, 0.155), jersey, 2);
  helmet.rotation.z = -0.15;
  facet(v(0.51, 2.27), v(0.044, 0.04, 0.126), rubber, 1);
  for (const z of [-0.07, 0, 0.07]) {
    const vent = facet(v(0.37, 2.453 - Math.abs(z) * 0.24, z), v(0.1, 0.01, 0.012), shorts, 1);
    vent.rotation.z = -0.12;
  }
  for (const side of [-1, 1]) {
    const shoulder = v(0.18, 1.99, side * 0.205);
    const sleeveEnd = v(0.35, 1.81, side * 0.245);
    const elbow = v(0.48, 1.65, side * 0.28);
    const hand = v(0.88, 1.49, side * 0.3);
    facet(shoulder, v(0.125, 0.115, 0.105), jersey, 1);
    organicSegment(shoulder, sleeveEnd, [0.09, 0.109, 0.101, 0.083], jersey);
    organicSegment(sleeveEnd, elbow, [0.081, 0.082, 0.067, 0.059], skin);
    facet(elbow, v(0.065, 0.063, 0.062), skin, 1);
    organicSegment(elbow, hand, [0.06, 0.074, 0.065, 0.048, 0.034], skin);
    facet(hand, v(0.073, 0.047, 0.049), rubber, 1);
    facet(v(0.915, 1.475, side * 0.3), v(0.04, 0.038, 0.04), skin, 1);
  }
  const legs = [-1, 1].map((side) => {
    const group = new THREE.Group();
    scene.add(group);
    return {
      side, hip: v(hips.x, hips.y, side * 0.14), knee: v(0, 0), foot: v(0, 0), cuff: v(0, 0), hem: v(0, 0),
      thigh: organicSegment(v(0, 0), v(0, 1), [0.12, 0.15, 0.145, 0.123, 0.107], shorts, group),
      lowerThigh: organicSegment(v(0, 0), v(0, 1), [0.103, 0.11, 0.09, 0.073], skin, group),
      kneeMesh: facet(v(0, 0), v(0.078, 0.087, 0.075), skin, 1, group),
      shin: organicSegment(v(0, 0), v(0, 1), [0.072, 0.092, 0.096, 0.075, 0.045], skin, group),
      sock: organicSegment(v(0, 0), v(0, 1), [0.048, 0.046, 0.042], metal, group),
      shoe: facet(v(0, 0), v(0.15, 0.056, 0.069), rubber, 1, group),
      pedal: segment(v(0, 0, -0.06), v(0, 0, 0.06), 0.029, rubber, group),
    };
  });

  // Merge fixed parts by material to keep draw calls low; articulated parts stay separate.
  still.updateMatrixWorld(true);
  const batches = new Map<THREE.Material, THREE.BufferGeometry[]>();
  still.traverse((object) => {
    if (!(object instanceof THREE.Mesh)) return;
    const source = object.geometry;
    const geometry = source.index ? source.toNonIndexed() : source.clone();
    geometry.applyMatrix4(object.matrixWorld);
    const mat = object.material as THREE.Material;
    batches.set(mat, [...(batches.get(mat) ?? []), geometry]);
    source.dispose();
  });
  still.clear();
  batches.forEach((geometries, mat) => {
    const combined = mergeGeometries(geometries);
    if (combined) still.add(new THREE.Mesh(combined, mat));
    geometries.forEach((geometry) => geometry.dispose());
  });
  const groundMaterial = new THREE.MeshBasicMaterial({ color: tokenColor('--color-muted'), transparent: true, opacity: 0.1, depthWrite: false });
  const ground = new THREE.Mesh(new THREE.CircleGeometry(1, 64), groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.scale.set(1.55, 0.5, 1);
  ground.position.y = -0.005;
  scene.add(ground);
  const ringMaterial = new THREE.MeshBasicMaterial({ color: tokenColor('--color-rule-2'), transparent: true, opacity: 0.35, side: THREE.DoubleSide });
  const groundRing = new THREE.Mesh(new THREE.RingGeometry(1.82, 1.826, 96), ringMaterial);
  groundRing.rotation.x = -Math.PI / 2;
  groundRing.position.y = -0.01;
  scene.add(groundRing);

  let state: RideState = { ratio: 48 / 17, patches: 17, rpm: 90 };
  let playing = false;
  let visible = true;
  let disposed = false;
  let phase = 0.5;
  let wheelPhase = 0;
  let frameId = 0;
  let lastFrame = 0;
  const pose = () => {
    crank.rotation.z = -phase;
    wheels.forEach((wheel) => { wheel.rotation.z = -wheelPhase; });
    for (const leg of legs) {
      const a = phase + (leg.side < 0 ? Math.PI : 0);
      leg.foot.set(bb.x + Math.cos(a) * 0.255, bb.y - Math.sin(a) * 0.255 + 0.07, leg.side * 0.17);
      const knee = kneePosition(leg.hip.x, leg.hip.y, leg.foot.x, leg.foot.y);
      leg.knee.set(knee.x, knee.y, leg.side * 0.19);
      leg.kneeMesh.position.copy(leg.knee);
      leg.hem.copy(leg.hip).lerp(leg.knee, 0.68);
      positionSegment(leg.thigh, leg.hip, leg.hem);
      positionSegment(leg.lowerThigh, leg.hem, leg.knee);
      leg.cuff.copy(leg.foot).lerp(leg.knee, 0.22);
      positionSegment(leg.shin, leg.knee, leg.cuff);
      positionSegment(leg.sock, leg.cuff, leg.foot);
      leg.shoe.position.set(leg.foot.x + 0.04, leg.foot.y - 0.025, leg.foot.z);
      leg.pedal.position.set(leg.foot.x, leg.foot.y - 0.07, leg.foot.z);
    }
  };
  const render = () => { if (!disposed && visible && !document.hidden) renderer.render(scene, camera); };
  const animate = (time: number) => {
    frameId = 0;
    if (disposed || !playing || !visible || document.hidden) return;
    if (time - lastFrame >= 1000 / 60 - 1) {
      const dt = lastFrame ? (time - lastFrame) / 1000 : 0;
      const rotation = driveRotation(state.rpm, state.ratio, dt);
      phase = (phase + rotation.crank) % (Math.PI * 2);
      wheelPhase = (wheelPhase + rotation.wheel) % (Math.PI * 2);
      lastFrame = time;
      pose();
      render();
    }
    frameId = requestAnimationFrame(animate);
  };
  const syncAnimation = () => {
    cancelAnimationFrame(frameId);
    frameId = 0;
    lastFrame = 0;
    if (playing && visible && !document.hidden && !disposed) frameId = requestAnimationFrame(animate);
    render();
  };
  let sideView = false;
  const setCamera = () => {
    const aspect = host.clientWidth / Math.max(host.clientHeight, 1);
    // Leave room for wrapped translated view controls beneath the model on phones.
    controls.target.y = aspect < 1 ? 0.95 : 1.15;
    camera.aspect = aspect;
    // Keep both wheels and helmet in frame, including narrow mobile canvases.
    const distance = Math.max(5.8, 5.3 / aspect);
    camera.position.copy(controls.target).add(sideView ? v(0, 0.25, distance) : v(0.34, 0.19, 1).normalize().multiplyScalar(distance));
    camera.updateProjectionMatrix();
    controls.update();
  };
  const resize = new ResizeObserver(() => {
    renderer.setSize(host.clientWidth, host.clientHeight);
    setCamera();
    render();
  });
  resize.observe(host);
  const intersection = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncAnimation(); }, { threshold: 0.01 });
  intersection.observe(host);
  const theme = new MutationObserver(() => {
    groundMaterial.color.copy(tokenColor('--color-muted'));
    ringMaterial.color.copy(tokenColor('--color-rule-2'));
    render();
  });
  theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  const signal = new AbortController();
  document.addEventListener('visibilitychange', syncAnimation, { signal: signal.signal });
  canvas.addEventListener('webglcontextlost', (event) => { event.preventDefault(); dispose(); onUnavailable(); }, { signal: signal.signal });
  controls.addEventListener('change', render);
  canvas.addEventListener('keydown', (event) => {
    if (event.key === 'Home') { event.preventDefault(); sideView = false; setCamera(); return; }
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault();
    const offset = camera.position.clone().sub(controls.target);
    const spherical = new THREE.Spherical().setFromVector3(offset);
    spherical.theta += event.key === 'ArrowLeft' ? 0.12 : event.key === 'ArrowRight' ? -0.12 : 0;
    spherical.phi = THREE.MathUtils.clamp(spherical.phi + (event.key === 'ArrowUp' ? -0.08 : event.key === 'ArrowDown' ? 0.08 : 0), controls.minPolarAngle, controls.maxPolarAngle);
    camera.position.copy(controls.target).add(offset.setFromSpherical(spherical));
    controls.update();
  }, { signal: signal.signal });
  function dispose() {
    if (disposed) return;
    disposed = true;
    cancelAnimationFrame(frameId);
    signal.abort();
    resize.disconnect();
    intersection.disconnect();
    theme.disconnect();
    controls.dispose();
    const geometries = new Set<THREE.BufferGeometry>();
    const materials = new Set<THREE.Material>([patchMaterial]);
    scene.traverse((object) => {
      if (object instanceof THREE.Mesh || object instanceof THREE.LineSegments) {
        if (object instanceof THREE.InstancedMesh) object.dispose();
        geometries.add(object.geometry);
        (Array.isArray(object.material) ? object.material : [object.material]).forEach((mat) => materials.add(mat));
      }
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((mat) => mat.dispose());
    renderer.dispose();
    renderer.forceContextLoss();
    canvas.remove();
  }
  updatePatches(state.patches);
  pose();
  setCamera();
  return {
    update(next) { state = next; updatePatches(state.patches); render(); },
    setPlaying(next) { playing = next; syncAnimation(); },
    reset(side = false) { sideView = side; setCamera(); render(); },
    dispose,
  };
}
