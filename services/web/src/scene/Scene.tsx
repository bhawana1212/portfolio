import { Suspense, useEffect, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { CatmullRomCurve3, PerspectiveCamera, Vector3 } from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { portfolio } from '../data/portfolio';
import { fitDistance, framingFor, orderedAnchors, progressToT, stationsFor, type Anchor } from '../lib/layout';
import { performanceFailed, type Tier } from '../lib/capabilities';
import { Desk } from './Desk';
import { Stations } from './Stations';

const stations = stationsFor(portfolio.roles, portfolio.projects);
export interface SceneProps { tier: Tier; paused: boolean; onReady: () => void; onFailure: () => void }

function ContextGuard({ onFailure }: Pick<SceneProps, 'onFailure'>) {
  const gl = useThree(state => state.gl);
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener('webglcontextlost', lost);
    return () => gl.domElement.removeEventListener('webglcontextlost', lost);
  }, [gl, onFailure]);
  return null;
}

function CameraRig({ onReady, onFailure }: Pick<SceneProps, 'onReady' | 'onFailure'>) {
  const { camera, size, gl } = useThree();
  const measured = useRef({ anchors: [] as Anchor[], scroll: 0, left: 0, top: 0 });
  const motion = useRef({ target: new Vector3(), position: new Vector3(), look: new Vector3(), initialized: false, ticks: 0, elapsed: 0, samples: [] as number[] });
  const curves = useRef<{ position: CatmullRomCurve3; target: CatmullRomCurve3 } | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const refresh = () => {
      measured.current.anchors = orderedAnchors([
        ...stations.map(station => ({ id: station.id, top: station.kind === 'desk' ? 0 : Math.max(0, (document.getElementById(station.id)?.getBoundingClientRect().top ?? 0) + window.scrollY - 60) })),
        { id: 'contact', top: Math.max(1, (document.getElementById('contact')?.offsetTop ?? document.body.scrollHeight) - window.innerHeight / 3) },
      ]);
      measured.current.scroll = window.scrollY;
    };
    refresh();
    const observer = new ResizeObserver(refresh);
    for (const selector of ['main', '#masthead', '.hero-copy']) { const element = document.querySelector(selector); if (element) observer.observe(element); }
    const trigger = ScrollTrigger.create({ start: 0, end: 'max', onUpdate: () => { measured.current.scroll = window.scrollY; }, onRefresh: refresh });
    onReady();
    return () => { observer.disconnect(); trigger.kill(); };
  }, [gl, onFailure, onReady]);

  useFrame((_, delta) => {
    const state = motion.current;
    const data = measured.current;
    const hero = data.scroll < (data.anchors[1]?.top ?? Infinity) * .5;
    const desktop = size.width > 860;
    const left = desktop && !hero ? document.querySelector('#experience .section-inner')?.getBoundingClientRect().right ?? size.width * .57 : 0;
    const top = desktop && hero ? Math.max(0, (document.querySelector('.hero-copy')?.getBoundingClientRect().bottom ?? 0) + 24) : 0;
    if (!curves.current || Math.abs(data.left - left) > 1 || Math.abs(data.top - top) > 1) {
      data.left = left; data.top = top;
      const frame = framingFor(size.width, size.height, left, top);
      const points = data.anchors.map(anchor => {
        const station = stations.find(entry => entry.id === anchor.id) ?? stations[0];
        const target = new Vector3(...station.position).add(new Vector3(0, station.kind === 'desk' ? 1 : .35, 0));
        const distance = fitDistance(station.kind === 'desk' ? 6.4 : 4.8, station.kind === 'desk' ? 3.8 : 4.4, frame.aspect) * size.height / Math.max(size.height * .4, size.height - top);
        return { target, position: target.clone().add(new Vector3(station.kind === 'desk' ? .22 : .1, .34, 1).normalize().multiplyScalar(distance)) };
      });
      if (points.length > 1) curves.current = { position: new CatmullRomCurve3(points.map(point => point.position)), target: new CatmullRomCurve3(points.map(point => point.target)) };
      if (camera instanceof PerspectiveCamera) { camera.setViewOffset(size.width, size.height, -frame.x, frame.y, size.width, size.height); camera.updateProjectionMatrix(); }
    }
    if (!curves.current) return;
    const progress = progressToT(data.scroll, data.anchors);
    curves.current.position.getPoint(progress, state.position);
    curves.current.target.getPoint(progress, state.target);
    const blend = state.initialized ? 1 - Math.exp(-Math.min(delta, .1) * 7) : 1;
    camera.position.lerp(state.position, blend); state.look.lerp(state.target, blend); camera.lookAt(state.look); state.initialized = true;
    gl.domElement.dataset.camera = camera.position.toArray().map(value => value.toFixed(3)).join(',');
    const nearest = Math.round(progress * (data.anchors.length - 1));
    gl.domElement.dataset.station = data.anchors[nearest]?.id ?? 'desk';
    state.ticks++; state.elapsed += Math.min(delta, .25);
    if (state.elapsed >= 2) {
      state.samples.push(state.ticks / state.elapsed); state.ticks = 0; state.elapsed = 0;
      if (performanceFailed(state.samples)) onFailure();
    }
  });
  useEffect(() => { curves.current = null; }, [size.width, size.height]);
  return null;
}

export default function Scene({ tier, paused, onReady, onFailure }: SceneProps) {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const update = () => {
      const reading = document.getElementById('reading-band')?.getBoundingClientRect();
      const hero = document.getElementById('desk')?.getBoundingClientRect();
      const offscreen = window.innerWidth <= 860 && (hero?.bottom ?? 0) < 0;
      setVisible(!document.hidden && !offscreen && !(reading && reading.top <= 0 && reading.bottom >= window.innerHeight));
    };
    document.addEventListener('visibilitychange', update); window.addEventListener('scroll', update, { passive: true }); window.addEventListener('resize', update); update();
    return () => { document.removeEventListener('visibilitychange', update); window.removeEventListener('scroll', update); window.removeEventListener('resize', update); };
  }, []);
  return <div className="scene-layer" aria-hidden="true" data-running={visible && !paused}>
    <Canvas frameloop={visible && !paused ? 'always' : 'never'} dpr={[1, tier === 'high' ? 1.5 : 1]} camera={{ fov: 40, near: .1, far: 140, position: [2, 5, 15] }} shadows={tier === 'high'} gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}>
      <ContextGuard onFailure={onFailure} />
      <ambientLight intensity={1.3} />
      <hemisphereLight args={['#f1f3e8', '#53645b', 2.5]} />
      <directionalLight position={[2, 8, 6]} intensity={4} color="#fff1d1" castShadow={tier === 'high'} shadow-mapSize={[1024, 1024]} shadow-camera-left={-8} shadow-camera-right={8} shadow-camera-top={8} shadow-camera-bottom={-8} />
      <directionalLight position={[-6, 4, -4]} intensity={3} color="#83cfbf" />
      <Suspense fallback={null}><Desk /><Stations stations={stations} /><CameraRig onReady={onReady} onFailure={onFailure} /></Suspense>
    </Canvas>
  </div>;
}