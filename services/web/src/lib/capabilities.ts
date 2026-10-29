export type Tier = 'low' | 'medium' | 'high';
export interface Capabilities { reducedMotion: boolean; saveData: boolean; webgl: boolean; cores: number; touch: boolean; memory?: number }

export function tierFor(capabilities: Capabilities): Tier {
  if (capabilities.reducedMotion || capabilities.saveData || !capabilities.webgl || (capabilities.touch && capabilities.cores <= 4) || (capabilities.memory !== undefined && capabilities.memory <= 2)) return 'low';
  return capabilities.touch || capabilities.cores < 8 ? 'medium' : 'high';
}

export function detectTier(): Tier {
  const navigatorWithHints = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number };
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const saveData = navigatorWithHints.connection?.saveData === true;
  if (reducedMotion || saveData) return 'low';
  let webgl = false;
  try {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('webgl2');
    webgl = context !== null;
    context?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch { webgl = false; }
  return tierFor({ reducedMotion, saveData, webgl, cores: navigator.hardwareConcurrency || 4, touch: navigator.maxTouchPoints > 0, memory: navigatorWithHints.deviceMemory });
}

export function performanceFailed(samples: number[]): boolean {
  return samples.length >= 4 && samples.slice(-4).every(fps => fps < 22);
}