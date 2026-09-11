import { it, expect, vi } from 'vitest';
import { registerAtlasTools, type ModelContext } from '../../src/state/agentTools';
it('optional tools validate inputs, share selection actions and clean up', () => {
  const registered: Parameters<ModelContext['registerTool']>[0][] = [];
  const signals: AbortSignal[] = [];
  const dispatch = vi.fn();
  const stop = registerAtlasTools(
    {
      registerTool: (tool, options) => {
        registered.push(tool);
        signals.push(options.signal);
      },
    },
    dispatch,
  );
  expect(registered.map((t) => t.name)).toEqual(['find_capabilities', 'inspect_capability']);
  expect(registered[0].execute({ query: 'resource layers' })).toEqual([
    { id: 'ecology', name: 'Ecology and Resources', futureHypothesis: 'Extrapolated' },
  ]);
  expect(registered[1].execute({ id: 'metacognition' })).toEqual({
    selected: 'metacognition',
    name: 'Metacognition',
  });
  expect(dispatch).toHaveBeenCalledWith({ type: 'select', id: 'metacognition' });
  expect(() => registered[1].execute({ id: 'constructor' })).toThrow('Unknown capability');
  expect(() => registered[1].execute({ id: 3 })).toThrow('Invalid id');
  stop();
  expect(signals.every((s) => s.aborted)).toBe(true);
});
