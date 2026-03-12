import { LoginForm } from '@/modules/auth/components/login-form';

export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-4 py-12">
      <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="space-y-6">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-stone-500">
            Plataforma clínica
          </p>
          <h1 className="max-w-xl font-serif text-5xl leading-tight text-stone-950">
            Seguimiento clínico claro, seguro y listo para operar.
          </h1>
          <p className="max-w-xl text-lg text-stone-600">
            SkinTrack centraliza fichas de pacientes, sesiones con autosave y permisos
            estrictos para cada profesional.
          </p>
        </section>

        <div className="flex items-center justify-center lg:justify-end">
          <LoginForm />
        </div>
      </div>
    </main>
  );
}
