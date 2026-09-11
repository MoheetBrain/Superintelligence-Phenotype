import { flushSync } from 'react-dom';
import { capabilityById } from '../data/capabilities';
import { searchCapabilities } from './selectors';
import type { Action } from './explorerReducer';
interface AtlasTool {
  name: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute: (input: unknown) => unknown;
}
export interface ModelContext {
  registerTool: (tool: AtlasTool, options: { signal: AbortSignal }) => void | Promise<void>;
}
function textInput(input: unknown, key: string) {
  if (!input || typeof input !== 'object' || !(key in input)) throw new Error(`Expected ${key}`);
  const value = (input as Record<string, unknown>)[key];
  if (typeof value !== 'string' || value.length > 300) throw new Error(`Invalid ${key}`);
  return value;
}
export function registerAtlasTools(
  context: ModelContext | undefined,
  dispatch: (a: Action) => void,
) {
  if (!context?.registerTool) return () => {};
  const lifecycle = new AbortController();
  const tools: AtlasTool[] = [
    {
      name: 'find_capabilities',
      description:
        'Search the ASI Atlas HTML catalogue by concept, alias or subtrait. Does not change the view.',
      inputSchema: {
        type: 'object',
        properties: { query: { type: 'string', maxLength: 300 } },
        required: ['query'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute: (input) =>
        searchCapabilities(textInput(input, 'query')).map((c) => ({
          id: c.id,
          name: c.name,
          futureHypothesis: c.evidenceLevel,
        })),
    },
    {
      name: 'inspect_capability',
      description:
        'Select an existing concept in ASI Atlas, enable its layer and open its real inspector.',
      inputSchema: {
        type: 'object',
        properties: { id: { type: 'string' } },
        required: ['id'],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute: (input) => {
        const id = textInput(input, 'id');
        const c = capabilityById[id];
        if (!c) throw new Error('Unknown capability');
        flushSync(() => dispatch({ type: 'select', id }));
        return { selected: c.id, name: c.name };
      },
    },
  ];
  for (const tool of tools) {
    try {
      void Promise.resolve(context.registerTool(tool, { signal: lifecycle.signal })).catch(
        () => {},
      );
    } catch {
      /* Optional browser capability; the visible interface remains authoritative. */
    }
  }
  return () => lifecycle.abort();
}
