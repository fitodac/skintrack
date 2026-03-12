'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Chrome } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithGoogle, signInWithPassword } from '@/lib/actions/auth-actions';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState(searchParams.get('error') ?? '');
  const next = searchParams.get('next') ?? '/patients';

  return (
    <Card className="w-full max-w-md border-stone-200 bg-white/95">
      <CardHeader>
        <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">
          SkinTrack
        </p>
        <CardTitle className="font-serif text-3xl">Ingreso profesional</CardTitle>
        <CardDescription>
          Accedé con tu email y contraseña o continuá con Google si ya fuiste invitada.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          className="space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);

            startTransition(async () => {
              const result = await signInWithPassword({
                email: formData.get('email'),
                password: formData.get('password'),
                next,
              });

              if (result.error) {
                setError(result.error);
                return;
              }

              router.push(result.data?.redirectTo ?? '/patients');
              router.refresh();
            });
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="profesional@skintrack.app" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" placeholder="********" />
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        <form action={async () => signInWithGoogle(next)}>
          <Button type="submit" variant="outline" className="w-full">
            <Chrome className="h-4 w-4" />
            Continuar con Google
          </Button>
        </form>

        <p className="text-xs text-stone-500">
          El acceso es privado. Si todavía no tenés invitación, pedila a la persona
          superadmin de la clínica.
        </p>

        <Link href="/" className="text-sm font-medium text-stone-600 underline underline-offset-4">
          Volver al inicio
        </Link>
      </CardContent>
    </Card>
  );
}
