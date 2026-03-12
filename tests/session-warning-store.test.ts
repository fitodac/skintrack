import { describe, expect, it } from 'vitest';
import { useSessionWarningStore } from '@/stores/use-session-warning-store';

describe('useSessionWarningStore', () => {
  it('opens and closes the warning dialog', () => {
    useSessionWarningStore.getState().show(120);
    expect(useSessionWarningStore.getState().open).toBe(true);
    expect(useSessionWarningStore.getState().secondsRemaining).toBe(120);

    useSessionWarningStore.getState().hide();
    expect(useSessionWarningStore.getState().open).toBe(false);
    expect(useSessionWarningStore.getState().secondsRemaining).toBeNull();
  });
});
