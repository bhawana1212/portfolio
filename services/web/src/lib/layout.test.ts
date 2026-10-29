import { describe, expect, it } from 'vitest';
import { stationsFor, orderedAnchors, progressToT, framingFor, fitDistance } from './layout';
import { tierFor, performanceFailed } from './capabilities';
import { portfolio } from '../data/portfolio';

describe('content-driven layout', () => {
  for (const count of [0, 1, 2, 7, 30]) it(`frames ${count} records without fixed section counts`, () => {
    const records = Array.from({ length: count }, (_, index) => ({ id: `entry-${index}` }));
    const stations = stationsFor([], records);
    expect(stations).toHaveLength(count + 1);
    expect(stations.flatMap(station => station.position).every(Number.isFinite)).toBe(true);
    const anchors = stations.map((station, index) => ({ id: station.id, top: index * 150 }));
    anchors.forEach((anchor, index) => expect(progressToT(anchor.top, anchors)).toBeCloseTo(count ? index / count : 0));
  });
  it('reaches the actual two roles and seven projects', () => {
    const stations = stationsFor(portfolio.roles, portfolio.projects);
    expect(stations.filter(station => station.kind === 'role')).toHaveLength(2);
    expect(stations.filter(station => station.kind === 'project')).toHaveLength(7);
    expect(new Set(stations.map(station => station.id)).size).toBe(10);
  });
  it('orders, deduplicates and clamps measured anchors', () => {
    const anchors = orderedAnchors([{ id: 'last', top: 400 }, { id: 'first', top: 0 }, { id: 'duplicate', top: 0 }, { id: 'invalid', top: NaN }]);
    expect(anchors.map(anchor => anchor.id)).toEqual(['first', 'last']);
    expect(progressToT(-20, anchors)).toBe(0);
    expect(progressToT(1000, anchors)).toBe(1);
    expect(progressToT(200, anchors)).toBe(.5);
    expect(progressToT(200, [])).toBe(0);
  });
  it('reserves measured overlay bounds and fits long/wide geometry', () => {
    const frame = framingFor(1440, 900, 750, 100);
    expect(frame.x).toBe(375);
    expect(frame.aspect).toBeCloseTo(690 / 800);
    expect(fitDistance(12, 5, .5)).toBeGreaterThan(fitDistance(6, 5, .5));
    for (const width of [320, 390, 844, 1440, 1920]) expect(Number.isFinite(fitDistance(7, 5, framingFor(width, 740, 0, 100).aspect))).toBe(true);
  });
});

describe('graphics gates', () => {
  const capable = { reducedMotion: false, saveData: false, webgl: true, cores: 8, touch: false };
  it('never enables heavy graphics for reduced motion, data saving or absent WebGL', () => {
    expect(tierFor(capable)).toBe('high');
    expect(tierFor({ ...capable, reducedMotion: true })).toBe('low');
    expect(tierFor({ ...capable, saveData: true })).toBe('low');
    expect(tierFor({ ...capable, webgl: false })).toBe('low');
    expect(tierFor({ ...capable, touch: true, cores: 4 })).toBe('low');
    expect(tierFor({ ...capable, touch: true })).toBe('medium');
  });
  it('falls back only after sustained poor performance', () => {
    expect(performanceFailed([12, 14, 16])).toBe(false);
    expect(performanceFailed([12, 14, 60, 16])).toBe(false);
    expect(performanceFailed([60, 12, 14, 18, 16])).toBe(true);
  });
});