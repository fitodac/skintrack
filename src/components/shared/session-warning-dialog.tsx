'use client';

import { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useSessionWarningStore } from '@/stores/use-session-warning-store';

export function SessionWarningDialog() {
  const { open, secondsRemaining, hide } = useSessionWarningStore();

  useEffect(() => {
    if (!open) {
      return;
    }

    if (secondsRemaining !== null && secondsRemaining <= 0) {
      hide();
    }
  }, [hide, open, secondsRemaining]);

  return (
    <Dialog open={open} onOpenChange={(nextOpen) => !nextOpen && hide()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tu sesión está por vencer</DialogTitle>
          <DialogDescription>
            Quedan aproximadamente{' '}
            <strong>{Math.max(1, Math.ceil((secondsRemaining ?? 0) / 60))} minutos</strong>.
            Guardá cualquier cambio pendiente antes de que la sesión expire.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
