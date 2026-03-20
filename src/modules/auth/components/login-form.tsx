'use client';

import * as React from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Chrome, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signInWithGoogle, signInWithPassword } from '@/lib/actions/auth-actions';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState(searchParams.get('error') ?? '');
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
  const next = searchParams.get('next') ?? '/patients';

  return (
    <Card className="w-full max-w-md border-white/60 bg-white/70 backdrop-blur-xl">
      <CardHeader>
        <p className="font-serif text-xs font-medium uppercase tracking-[0.3em] text-primary/80">
          SkinTrack.
        </p>
        <CardTitle className="font-serif text-3xl font-medium tracking-tight">Ingreso profesional</CardTitle>
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
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={isPasswordVisible ? 'text' : 'password'}
                placeholder="********"
                className="pr-12"
              />
              <button
                type="button"
                aria-label={isPasswordVisible ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={isPasswordVisible}
                onClick={() => setIsPasswordVisible((value) => !value)}
                className="absolute right-1 top-1/2 inline-flex h-9 w-10 -translate-y-1/2 items-center justify-center rounded-full text-primary/70 transition hover:bg-stone-100/60 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2"
              >
                {isPasswordVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {error ? <p className="text-sm text-rose-600">{error}</p> : null}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? 'Ingresando...' : 'Ingresar'}
          </Button>
        </form>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          disabled={isPending}
          onClick={() => {
            startTransition(async () => {
              await signInWithGoogle(next);
            });
          }}
        >
          <Chrome className="h-4 w-4" />
          Continuar con Google
        </Button>

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
