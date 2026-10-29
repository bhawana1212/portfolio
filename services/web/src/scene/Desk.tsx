import { Center, RoundedBox, Text3D } from '@react-three/drei';
import type { Vec3 } from '../lib/layout';
import { portfolio } from '../data/portfolio';

export const typeface = `${import.meta.env.BASE_URL}fonts/desk-display.typeface.json`;
const colors = { metal: '#444c49', dark: '#202624', gold: '#e8c66a', teal: '#69d7c4', ceramic: '#d9dfd6' };

export function Block({ position, size, color = colors.metal, metalness = .4 }: { position: Vec3; size: Vec3; color?: string; metalness?: number }) {
  return <mesh position={position} castShadow receiveShadow><boxGeometry args={size} /><meshStandardMaterial color={color} metalness={metalness} roughness={.45} /></mesh>;
}

export function Desk() {
  return <group>
    <mesh position={[0, -.5, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow><planeGeometry args={[80, 80]} /><shadowMaterial transparent opacity={.3} /></mesh>
    <RoundedBox args={[5.1, .18, 2.45]} radius={.08} smoothness={3} position={[0, .8, 0]} castShadow receiveShadow><meshStandardMaterial color="#46504d" metalness={.25} roughness={.5} /></RoundedBox>
    {[-2.15, 2.15].flatMap(horizontal => [-.85, .85].map(depth => <Block key={`${horizontal}-${depth}`} position={[horizontal, .13, depth]} size={[.12, 1.25, .12]} color={colors.dark} />))}
    <Block position={[0, 1.08, -.58]} size={[.14, .55, .12]} />
    <Block position={[0, .94, -.55]} size={[.9, .08, .55]} />
    <RoundedBox args={[2.45, 1.45, .16]} radius={.06} smoothness={3} position={[0, 1.85, -.65]} castShadow><meshStandardMaterial color="#1b2220" metalness={.65} roughness={.25} /></RoundedBox>
    <Block position={[0, 1.87, -.556]} size={[2.26, 1.23, .02]} color="#0a2420" metalness={0} />
    <Center position={[0, 2.2, -.53]}><Text3D font={typeface} size={.2} height={.008} curveSegments={6}>{portfolio.name}<meshBasicMaterial color={colors.gold} /></Text3D></Center>
    {[1.5, 1.7, 1.9].map((vertical, index) => <group key={vertical}>
      <mesh position={[-.93, vertical, -.535]}><boxGeometry args={[.09, .065, .01]} /><meshBasicMaterial color={colors.gold} /></mesh>
      <mesh position={[-.15 + index * .04, vertical, -.535]}><boxGeometry args={[1.22 - index * .18, .04, .01]} /><meshBasicMaterial color={colors.teal} /></mesh>
    </group>)}
    <Block position={[0, .955, .64]} size={[2.18, .08, .68]} color="#727d77" />
    {Array.from({ length: 4 }, (_, row) => Array.from({ length: 12 }, (_, column) => <Block key={`${row}-${column}`} position={[-.97 + column * .175, 1.02, .42 + row * .145]} size={[.135, .055, .105]} color={row === 0 && column === 0 ? colors.gold : colors.dark} />))}
    <mesh position={[1.55, 1, .72]} scale={[.18, .09, .26]} castShadow><sphereGeometry args={[1, 20, 12]} /><meshStandardMaterial color={colors.ceramic} roughness={.4} /></mesh>
    <group position={[-1.9, .94, -.62]}>
      <mesh><cylinderGeometry args={[.29, .35, .08, 32]} /><meshStandardMaterial color={colors.gold} metalness={.7} roughness={.3} /></mesh>
      <Block position={[0, .6, 0]} size={[.065, 1.2, .065]} color={colors.gold} />
      <group position={[.2, 1.2, 0]} rotation={[0, 0, -.55]}><mesh><cylinderGeometry args={[.1, .4, .35, 32]} /><meshStandardMaterial color={colors.gold} metalness={.6} roughness={.3} /></mesh><mesh position={[0, -.18, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.36, 24]} /><meshBasicMaterial color="#ffeac2" /></mesh></group>
      <pointLight position={[.3, .8, .1]} color="#ffe1a1" intensity={5} distance={4} decay={2} />
    </group>
    <group position={[1.95, 1.03, -.55]}>
      <mesh castShadow><cylinderGeometry args={[.26, .18, .38, 24]} /><meshStandardMaterial color={colors.ceramic} /></mesh>
      {Array.from({ length: 7 }, (_, index) => <mesh key={index} position={[Math.sin(index * 2.4) * .17, .43 + index % 3 * .12, Math.cos(index * 2.4) * .17]} rotation={[.4 * Math.cos(index), index, -.45 * Math.sin(index)]} scale={[.12, .44, .065]} castShadow><sphereGeometry args={[1, 12, 8]} /><meshStandardMaterial color={index % 2 ? '#79a785' : '#416f55'} roughness={.8} /></mesh>)}
    </group>
    <group position={[-1.35, 1.13, .65]}>
      <mesh castShadow><cylinderGeometry args={[.19, .16, .38, 32]} /><meshStandardMaterial color={colors.ceramic} roughness={.3} /></mesh>
      <mesh position={[0, .194, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[.16, 24]} /><meshStandardMaterial color="#29201a" /></mesh>
      <mesh position={[-.2, .01, 0]}><torusGeometry args={[.12, .04, 8, 20]} /><meshStandardMaterial color={colors.ceramic} /></mesh>
    </group>
  </group>;
}