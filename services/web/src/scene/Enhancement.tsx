import { Component, Suspense, lazy, useEffect, useState, type ReactNode } from 'react';
import { Button, Switch, Tooltip } from '@fluentui/react-components';
import { PauseRegular, PlayRegular, ArrowClockwiseRegular } from '@fluentui/react-icons';
import { detectTier, type Tier } from '../lib/capabilities';

const Scene = lazy(() => import('./Scene'));
class GraphicsBoundary extends Component<{ children: ReactNode; onFailure: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onFailure(); }
  render() { return this.state.failed ? null : this.props.children; }
}

export function Enhancement() {
  const [tier, setTier] = useState<Tier>('low');
  const [enabled, setEnabled] = useState(false);
  const [paused, setPaused] = useState(false);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: EventTarget }).connection;
    const update = () => { const next = detectTier(); setTier(next); let preference = true; try { preference = sessionStorage.getItem('desk-enabled') !== 'false'; } catch { preference = true; } setEnabled(next !== 'low' && preference); };
    update(); media.addEventListener('change', update); connection?.addEventListener?.('change', update);
    return () => { media.removeEventListener('change', update); connection?.removeEventListener?.('change', update); };
  }, []);
  useEffect(() => { document.documentElement.classList.toggle('graphics-on', enabled && ready && !failed); return () => document.documentElement.classList.remove('graphics-on'); }, [enabled, ready, failed]);
  const [callbacks] = useState(() => ({ onReady: () => setReady(true), onFailure: () => { setFailed(true); setReady(false); } }));
  return <>
    {enabled && !failed && <GraphicsBoundary onFailure={callbacks.onFailure}><Suspense fallback={null}><Scene tier={tier} paused={paused} {...callbacks} /></Suspense></GraphicsBoundary>}
    <div className="scene-controls js-action">
      <Switch label="3D" checked={enabled && !failed} disabled={tier === 'low' || failed} onChange={(_, data) => { setEnabled(data.checked); try { sessionStorage.setItem('desk-enabled', String(data.checked)); } catch { return; } }} />
      {enabled && !failed && <Tooltip content={paused ? 'Resume scene' : 'Pause scene'} relationship="label"><Button appearance="subtle" icon={paused ? <PlayRegular /> : <PauseRegular />} aria-label={paused ? 'Resume scene' : 'Pause scene'} onClick={() => setPaused(value => !value)} /></Tooltip>}
      {failed && <Tooltip content="Retry 3D" relationship="label"><Button appearance="subtle" icon={<ArrowClockwiseRegular />} aria-label="Retry 3D" onClick={() => location.reload()} /></Tooltip>}
    </div>
  </>;
}