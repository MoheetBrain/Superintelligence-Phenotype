import { RotateCcw, Scan, Plus, Minus } from 'lucide-react';
import type { Action, ExplorerState } from '../state/explorerReducer';
import type { Vec3 } from '../data/schema';
import { Button } from './ui/Button';
export function SceneToolbar({
  state,
  dispatch,
}: {
  state: ExplorerState;
  dispatch: (a: Action) => void;
}) {
  const zoom = (scale: number) => {
    const p = state.camera.position.map(
      (v, i) => state.camera.target[i] + (v - state.camera.target[i]) * scale,
    ) as unknown as Vec3;
    dispatch({
      type: 'restore',
      state: { ...state, camera: { ...state.camera, position: p }, cameraIntent: 'restore' },
    });
  };
  return (
    <div className="scene-controls">
      <div className="camera-controls" role="group" aria-label="Camera controls">
        <Button
          size="icon"
          aria-label="Front view"
          title="Front view"
          onClick={() => dispatch({ type: 'preset', preset: 'front' })}
        >
          <Scan size={18} />
        </Button>
        <Button onClick={() => dispatch({ type: 'preset', preset: 'side' })}>Side</Button>
        <Button onClick={() => dispatch({ type: 'preset', preset: 'back' })}>Back</Button>
        <Button size="icon" aria-label="Zoom in" onClick={() => zoom(0.85)}>
          <Plus size={18} />
        </Button>
        <Button size="icon" aria-label="Zoom out" onClick={() => zoom(1.18)}>
          <Minus size={18} />
        </Button>
        <Button
          size="icon"
          aria-label="Reset explorer"
          title="Reset explorer"
          onClick={() => dispatch({ type: 'reset' })}
        >
          <RotateCcw size={17} />
        </Button>
      </div>
      <div className="explode-control">
        <label htmlFor="explode">
          Conceptual separation{' '}
          <span>
            {state.explode === 0 ? 'Assembled' : state.explode === 1 ? 'Separated' : 'Separating'}
          </span>
        </label>
        <input
          id="explode"
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={state.explode}
          onChange={(e) => dispatch({ type: 'explode', value: Number(e.target.value) })}
        />
      </div>
    </div>
  );
}
