export type Vec3 = [number, number, number];
export interface Station { id: string; kind: 'desk' | 'role' | 'project'; position: Vec3 }
export interface Anchor { id: string; top: number }

export function stationsFor(roles: { id: string }[], projects: { id: string }[]): Station[] {
  return [
    { id: 'desk', kind: 'desk', position: [0, 0, 0] },
    ...roles.map((role, index): Station => ({ id: role.id, kind: 'role', position: [-9, 1.5, -index * 5] })),
    ...projects.map((project, index): Station => ({ id: project.id, kind: 'project', position: [10 + Math.sin(index * 1.3) * 1.1, 1.5, -index * 5] })),
  ];
}

export function orderedAnchors(anchors: Anchor[]): Anchor[] {
  return anchors.filter(anchor => Number.isFinite(anchor.top)).sort((left, right) => left.top - right.top).reduce<Anchor[]>((result, anchor) => {
    if (!result.length || anchor.top > result[result.length - 1].top) result.push(anchor);
    return result;
  }, []);
}

export function progressToT(scroll: number, anchors: Anchor[]): number {
  if (anchors.length < 2 || !Number.isFinite(scroll)) return 0;
  if (scroll <= anchors[0].top) return 0;
  if (scroll >= anchors[anchors.length - 1].top) return 1;
  const index = anchors.findIndex((anchor, position) => position < anchors.length - 1 && scroll >= anchor.top && scroll < anchors[position + 1].top);
  if (index < 0) return 0;
  return (index + (scroll - anchors[index].top) / (anchors[index + 1].top - anchors[index].top)) / (anchors.length - 1);
}

export function fitDistance(width: number, height: number, aspect: number, fov = 40): number {
  const tangent = Math.tan(fov * Math.PI / 360);
  return Math.max(Math.max(0.1, height) / 2 / tangent, Math.max(0.1, width) / 2 / tangent / Math.max(0.1, aspect)) * 1.18;
}

export function framingFor(width: number, height: number, reservedLeft: number, reservedTop: number) {
  const left = Math.min(Math.max(0, reservedLeft), width * 0.7);
  const top = Math.min(Math.max(0, reservedTop), height * 0.6);
  return { x: left / 2, y: -top / 2, aspect: Math.max(0.1, (width - left) / Math.max(1, height - top)) };
}