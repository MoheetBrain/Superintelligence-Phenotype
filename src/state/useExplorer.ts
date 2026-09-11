import { useCallback, useEffect, useRef, useState } from 'react';
import { explorerReducer, type Action } from './explorerReducer';
import { parseState, serializeState } from './shareState';
export function useExplorer() {
  const [state, setState] = useState(() => parseState(window.location.hash));
  const current = useRef(state);
  const dispatch = useCallback((action: Action) => {
    const previous = current.current;
    const next = explorerReducer(previous, action);
    if (next === previous) return;
    current.current = next;
    setState(next);
    if (action.type !== 'restore') {
      const hash = serializeState(next);
      const method = ['camera', 'zoom', 'query', 'evidence', 'explode', 'refit'].includes(
        action.type,
      )
        ? 'replaceState'
        : 'pushState';
      if (window.location.hash !== hash) window.history[method](null, '', hash);
    }
  }, []);
  useEffect(() => {
    const restore = () => dispatch({ type: 'restore', state: parseState(location.hash) });
    window.addEventListener('popstate', restore);
    window.addEventListener('hashchange', restore);
    return () => {
      window.removeEventListener('popstate', restore);
      window.removeEventListener('hashchange', restore);
    };
  }, [dispatch]);
  return { state, dispatch };
}
