import { test, expect } from '@playwright/test';
interface Probe {
  pendingFrames: number;
  activeObservers: number;
  detachedCanvasListeners: number;
}
test('idle rendering stops and unmounted scenes release observers and canvas listeners', async ({
  page,
}) => {
  await page.addInitScript(() => {
    const frames = new Set<number>();
    const request = window.requestAnimationFrame.bind(window),
      cancel = window.cancelAnimationFrame.bind(window);
    window.requestAnimationFrame = (callback) => {
      const id = request((time) => {
        frames.delete(id);
        callback(time);
      });
      frames.add(id);
      return id;
    };
    window.cancelAnimationFrame = (id) => {
      frames.delete(id);
      cancel(id);
    };
    let observers = 0;
    const OriginalObserver = window.ResizeObserver;
    window.ResizeObserver = class extends OriginalObserver {
      active = false;
      observe(target: Element, options?: ResizeObserverOptions) {
        if (!this.active) {
          this.active = true;
          observers++;
        }
        super.observe(target, options);
      }
      disconnect() {
        if (this.active) {
          this.active = false;
          observers--;
        }
        super.disconnect();
      }
    };
    const listeners: {
      target: HTMLCanvasElement;
      type: string;
      listener: EventListenerOrEventListenerObject | null;
      capture: boolean;
    }[] = [];
    const add = EventTarget.prototype.addEventListener,
      remove = EventTarget.prototype.removeEventListener;
    EventTarget.prototype.addEventListener = function (
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | AddEventListenerOptions,
    ) {
      const capture = typeof options === 'boolean' ? options : (options?.capture ?? false);
      if (
        this instanceof HTMLCanvasElement &&
        !listeners.some(
          (l) =>
            l.target === this &&
            l.type === type &&
            l.listener === listener &&
            l.capture === capture,
        )
      )
        listeners.push({ target: this, type, listener, capture });
      add.call(this, type, listener, options);
    };
    EventTarget.prototype.removeEventListener = function (
      type: string,
      listener: EventListenerOrEventListenerObject | null,
      options?: boolean | EventListenerOptions,
    ) {
      const capture = typeof options === 'boolean' ? options : (options?.capture ?? false);
      for (let i = listeners.length - 1; i >= 0; i--) {
        const l = listeners[i];
        if (
          l.target === this &&
          l.type === type &&
          l.listener === listener &&
          l.capture === capture
        )
          listeners.splice(i, 1);
      }
      remove.call(this, type, listener, options);
    };
    (window as Window & { atlasLifecycleProbe?: () => Probe }).atlasLifecycleProbe = () => ({
      pendingFrames: frames.size,
      activeObservers: observers,
      detachedCanvasListeners: listeners.filter((l) => !l.target.isConnected).length,
    });
  });
  const probe = () =>
    page.evaluate(() =>
      (window as unknown as Window & { atlasLifecycleProbe: () => Probe }).atlasLifecycleProbe(),
    );
  await page.goto('/');
  for (let i = 0; i < 3; i++) {
    await expect(page.locator('canvas')).toHaveCount(1);
    await expect
      .poll(probe)
      .toEqual({ pendingFrames: 0, activeObservers: 1, detachedCanvasListeners: 0 });
    await page.getByRole('button', { name: /Network/ }).click();
    await expect(page.locator('canvas')).toHaveCount(0);
    await expect
      .poll(probe)
      .toEqual({ pendingFrames: 0, activeObservers: 0, detachedCanvasListeners: 0 });
    await page.getByRole('button', { name: 'Return to Body' }).click();
  }
});
