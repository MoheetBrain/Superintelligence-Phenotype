import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CapabilityCatalogue } from '../../src/components/CapabilityCatalogue';
import { CapabilityInspector } from '../../src/components/CapabilityInspector';
import { initialState } from '../../src/state/explorerReducer';
import { capabilityById } from '../../src/data/capabilities';
describe('HTML alternative', () => {
  it('exposes every card with a semantic keyboard-operable button', async () => {
    const dispatch = vi.fn();
    render(<CapabilityCatalogue state={initialState()} dispatch={dispatch} mode="concepts" />);
    expect(screen.getAllByRole('button', { name: /Explore / })).toHaveLength(12);
    const user = userEvent.setup();
    const b = screen.getByRole('button', { name: 'Explore Metacognition' });
    b.focus();
    await user.keyboard('{Enter}');
    expect(dispatch).toHaveBeenCalledWith({ type: 'select', id: 'metacognition' });
  });
  it('shows zero results and a clear control', () => {
    render(
      <CapabilityCatalogue
        state={{ ...initialState(), query: 'unfindable' }}
        dispatch={vi.fn()}
        mode="concepts"
      />,
    );
    expect(screen.getByText('No matching concepts.')).toBeVisible();
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeVisible();
  });
  it('publishes distinct hypothesis, observed scope and missing results', async () => {
    const user = userEvent.setup();
    render(
      <CapabilityInspector
        capability={capabilityById.metacognition!}
        isolate={false}
        dispatch={vi.fn()}
      />,
    );
    expect(screen.getByText('Future hypothesis: Extrapolated')).toBeVisible();
    expect(screen.getByText(/Hypothetical example/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Evidence' }));
    expect(screen.getByText('Observed', { exact: true })).toBeVisible();
    expect(screen.getByText(/Models and self-evaluation tasks studied/)).toBeVisible();
    await user.click(screen.getByRole('button', { name: 'Measure' }));
    expect(screen.getByText('Not measured for this project.')).toBeVisible();
  });
  it('uses the same select action for a related concept', async () => {
    const dispatch = vi.fn();
    render(
      <CapabilityInspector
        capability={capabilityById.metacognition!}
        isolate={false}
        dispatch={dispatch}
      />,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Memory' }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'select', id: 'memory' });
  });
  it('shows layer toggles and hide all', async () => {
    const dispatch = vi.fn();
    render(<CapabilityCatalogue state={initialState()} dispatch={dispatch} mode="layers" />);
    expect(screen.getAllByRole('switch')).toHaveLength(12);
    await userEvent.click(screen.getByRole('button', { name: 'Hide all' }));
    expect(dispatch).toHaveBeenCalledWith({ type: 'layers', visible: [] });
  });
});
