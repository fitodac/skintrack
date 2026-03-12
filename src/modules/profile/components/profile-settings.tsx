'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { updateOwnPassword, updateOwnProfile } from '@/lib/actions/profile-actions';
import type { Viewer } from '@/lib/auth';

interface ProfileSettingsProps {
  viewer: Viewer;
}

export function ProfileSettings({ viewer }: ProfileSettingsProps) {
  const [profileMessage, setProfileMessage] = useState<string | null>(null);
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [isProfilePending, startProfileTransition] = useTransition();
  const [isPasswordPending, startPasswordTransition] = useTransition();

  return (
    <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
      <Card>
        <CardHeader>
          <CardTitle>Perfil profesional</CardTitle>
          <CardDescription>Actualizá tus datos visibles y operativos.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);

              startProfileTransition(async () => {
                const result = await updateOwnProfile({
                  username: formData.get('username'),
                  name: formData.get('name'),
                  lastname: formData.get('lastname'),
                  professional_title: formData.get('professional_title'),
                });

                setProfileMessage(result.error ?? result.success ?? null);
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" defaultValue={viewer.username} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professional_title">Título profesional</Label>
              <Input
                id="professional_title"
                name="professional_title"
                defaultValue={viewer.professional_title ?? ''}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" name="name" defaultValue={viewer.name} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastname">Apellido</Label>
              <Input id="lastname" name="lastname" defaultValue={viewer.lastname} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" value={viewer.email} disabled />
            </div>

            {profileMessage ? (
              <p className="text-sm text-stone-600 md:col-span-2">{profileMessage}</p>
            ) : null}

            <div className="md:col-span-2">
              <Button type="submit" disabled={isProfilePending}>
                {isProfilePending ? 'Guardando...' : 'Guardar perfil'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Seguridad</CardTitle>
          <CardDescription>Cambiá tu contraseña cuando lo necesites.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);

              startPasswordTransition(async () => {
                const result = await updateOwnPassword({
                  password: formData.get('password'),
                });

                setPasswordMessage(result.error ?? result.success ?? null);
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="password">Nueva contraseña</Label>
              <Input id="password" name="password" type="password" />
            </div>
            {passwordMessage ? <p className="text-sm text-stone-600">{passwordMessage}</p> : null}
            <Button type="submit" variant="secondary" disabled={isPasswordPending}>
              {isPasswordPending ? 'Actualizando...' : 'Actualizar contraseña'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
