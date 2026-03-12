'use client';

import { useState, useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { inviteUser, updateUserBySuperadmin } from '@/lib/actions/users-actions';
import type { UserAdminListItemDTO } from '@/modules/users/types';

interface UsersAdminPanelProps {
  users: UserAdminListItemDTO[];
}

export function UsersAdminPanel({ users }: UsersAdminPanelProps) {
  const [inviteMessage, setInviteMessage] = useState<string | null>(null);
  const [isInvitePending, startInviteTransition] = useTransition();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Invitar usuario</CardTitle>
          <CardDescription>
            Crea la invitación y define el rol antes del primer acceso.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-5"
            onSubmit={(event) => {
              event.preventDefault();
              const formData = new FormData(event.currentTarget);

              startInviteTransition(async () => {
                const result = await inviteUser({
                  email: formData.get('email'),
                  invited_name: formData.get('invited_name'),
                  invited_lastname: formData.get('invited_lastname'),
                  professional_title: formData.get('professional_title'),
                  role: formData.get('role'),
                });

                setInviteMessage(result.error ?? result.success ?? null);
              });
            }}
          >
            <Input name="invited_name" placeholder="Nombre" />
            <Input name="invited_lastname" placeholder="Apellido" />
            <Input name="email" type="email" placeholder="profesional@skintrack.app" />
            <Input name="professional_title" placeholder="Título profesional" />
            <select
              name="role"
              className="h-11 rounded-2xl border border-stone-300 bg-white px-4 text-sm"
              defaultValue="admin"
            >
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>

            <div className="md:col-span-2 xl:col-span-5">
              <Button type="submit" disabled={isInvitePending}>
                {isInvitePending ? 'Enviando...' : 'Enviar invitación'}
              </Button>
            </div>

            {inviteMessage ? (
              <p className="text-sm text-stone-600 md:col-span-2 xl:col-span-5">{inviteMessage}</p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {users.map((user) => (
          <UserRow key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}

function UserRow({ user }: { user: UserAdminListItemDTO }) {
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [values, setValues] = useState({
    ...user,
    professionalTitle: user.professionalTitle ?? '',
  });

  return (
    <Card>
      <CardContent className="pt-6">
        <form
          className="grid gap-4 md:grid-cols-2 xl:grid-cols-3"
          onSubmit={(event) => {
            event.preventDefault();
            startTransition(async () => {
              const result = await updateUserBySuperadmin({
                id: user.id,
                username: values.username,
                name: values.name,
                lastname: values.lastname,
                professional_title: values.professionalTitle,
                role: values.role,
                is_active: values.isActive,
              });

              setMessage(result.error ?? result.success ?? null);
            });
          }}
        >
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={values.email} disabled />
          </div>
          <div className="space-y-2">
            <Label>Username</Label>
            <Input
              value={values.username}
              onChange={(event) =>
                setValues((current) => ({ ...current, username: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Nombre</Label>
            <Input
              value={values.name}
              onChange={(event) => setValues((current) => ({ ...current, name: event.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label>Apellido</Label>
            <Input
              value={values.lastname}
              onChange={(event) =>
                setValues((current) => ({ ...current, lastname: event.target.value }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Título</Label>
            <Input
              value={values.professionalTitle}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  professionalTitle: event.target.value,
                }))
              }
            />
          </div>
          <div className="space-y-2">
            <Label>Rol</Label>
            <select
              className="h-11 rounded-2xl border border-stone-300 bg-white px-4 text-sm"
              value={values.role}
              onChange={(event) =>
                setValues((current) => ({
                  ...current,
                  role: event.target.value as 'admin' | 'superadmin',
                }))
              }
            >
              <option value="admin">admin</option>
              <option value="superadmin">superadmin</option>
            </select>
          </div>

          <Checkbox
            label="Usuario activo"
            checked={values.isActive}
            onChange={(event) =>
              setValues((current) => ({ ...current, isActive: event.target.checked }))
            }
          />

          <div className="xl:col-span-3 flex flex-wrap items-center gap-3">
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : 'Actualizar usuario'}
            </Button>
            {message ? <p className="text-sm text-stone-600">{message}</p> : null}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
