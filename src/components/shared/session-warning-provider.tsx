'use client';

import { useEffect } from 'react';
import { createBrowserSupabaseClient } from '@/lib/supabase/client';
import { SESSION_WARNING_LEAD_SECONDS } from '@/lib/constants';
import { useSessionWarningStore } from '@/stores/use-session-warning-store';
import { SessionWarningDialog } from '@/components/shared/session-warning-dialog';

export function SessionWarningProvider() {
  const { show, hide } = useSessionWarningStore();

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const sync = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.expires_at) {
        hide();
        return;
      }

      const secondsRemaining = session.expires_at - Math.floor(Date.now() / 1000);

      if (secondsRemaining <= SESSION_WARNING_LEAD_SECONDS && secondsRemaining > 0) {
        show(secondsRemaining);
      } else {
        hide();
      }
    };

    void sync();
    const timerId = window.setInterval(() => {
      void sync();
    }, 60_000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void sync();
    });

    return () => {
      window.clearInterval(timerId);
      subscription.unsubscribe();
    };
  }, [hide, show]);

  return <SessionWarningDialog />;
}
