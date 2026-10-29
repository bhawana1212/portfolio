import { useRef, useState } from 'react';
import { Center, Text3D } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group } from 'three';
import type { Station } from '../lib/layout';
import { Block, typeface } from './Desk';

function StationObject({ station, index }: { station: Station; index: number }) {
  const [hovered, setHovered] = useState(false);
  const group = useRef<Group>(null);
  const gl = useThree(state => state.gl);
  useFrame(() => { if (group.current) group.current.visible = gl.domElement.dataset.station === station.id; });
  const accent = hovered ? '#f5dfa0' : station.kind === 'role' ? '#69d7c4' : '#e8c66a';
  return <group ref={group} position={station.position} onPointerOver={event => { event.stopPropagation(); setHovered(true); }} onPointerOut={() => setHovered(false)} onClick={event => { event.stopPropagation(); location.hash = station.id; }}>
    <mesh position={[0, -.9, 0]} castShadow receiveShadow><cylinderGeometry args={[1.8, 1.5, .2, 40]} /><meshStandardMaterial color="#36413b" roughness={.55} metalness={.4} /></mesh>
    <Center position={[0, 1.75, 0]}><Text3D font={typeface} size={.42} height={.08} bevelEnabled bevelSize={.008} bevelThickness={.008}>{`${station.kind === 'role' ? 'ROLE' : 'WORK'} ${String(index + 1).padStart(2, '0')}`}<meshStandardMaterial color={accent} metalness={.55} roughness={.35} /></Text3D></Center>
    {station.kind === 'role' ? <>
      <Block position={[0, .3, 0]} size={[.12, 2.25, .12]} color={accent} />
      {[0, 1, 2].map(level => <group key={level} position={[0, level * .55 - .35, 0]}><mesh><torusGeometry args={[.44 + level * .12, .065, 12, 40]} /><meshStandardMaterial color={accent} metalness={.5} roughness={.3} /></mesh><Block position={[.85, 0, 0]} size={[.6, .12, .12]} color="#8d9f93" /></group>)}
    </> : index === 6 ? <>
      {[.7, 1.15, 1.7, .9].map((height, column) => <Block key={column} position={[-.85 + column * .56, height / 2 - .8, 0]} size={[.34, height, .55]} color={column % 2 ? accent : '#69d7c4'} />)}
    </> : <>
      {Array.from({ length: index === 1 ? 6 : 4 }, (_, node) => <group key={node} position={[(node % 2 ? .65 : -.65), -.25 + Math.floor(node / 2) * .65, 0]}>
        <mesh castShadow><boxGeometry args={[.7, .36, .35]} /><meshStandardMaterial color={node === index % 4 ? accent : '#76897e'} metalness={.5} roughness={.35} /></mesh>
        <Block position={[node % 2 ? -.45 : .45, 0, 0]} size={[.25, .07, .07]} color={accent} />
      </group>)}
      <Block position={[0, .35, 0]} size={[.075, 1.8, .075]} color={accent} />
      {index === 4 || index === 5 ? <mesh rotation={[0, .6, 0]} position={[0, .35, .25]}><torusGeometry args={[1.16, .035, 10, 56]} /><meshStandardMaterial color="#69d7c4" metalness={.3} roughness={.4} /></mesh> : null}
    </>}
  </group>;
}

export function Stations({ stations }: { stations: Station[] }) {
  return <>{(['role', 'project'] as const).flatMap(kind => stations.filter(station => station.kind === kind).map((station, index) => <StationObject key={station.id} station={station} index={index} />))}</>;
}