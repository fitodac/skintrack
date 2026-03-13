import { expect, test } from '@playwright/test';

const adminEmail = process.env.E2E_ADMIN_EMAIL;
const adminPassword = process.env.E2E_ADMIN_PASSWORD;
const superadminEmail = process.env.E2E_SUPERADMIN_EMAIL;
const superadminPassword = process.env.E2E_SUPERADMIN_PASSWORD;

test.describe('SkinTrack email/password flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('admin can login, create a patient, create a session draft, and complete it', async ({
    page,
  }) => {
    test.skip(!adminEmail || !adminPassword, 'E2E admin credentials are not configured.');

    const patientName = `Paciente E2E ${Date.now()}`;
    const patientEmail = `paciente+${Date.now()}@example.com`;

    await page.getByLabel('Email').fill(adminEmail!);
    await page.getByLabel('Contraseña').fill(adminPassword!);
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL(/\/patients$/, { timeout: 15_000 });
    await page.getByLabel('Nombre completo').fill(patientName);
    await page.getByLabel('Email').first().fill(patientEmail);
    await page.getByRole('button', { name: 'Crear paciente' }).click();

    await expect(page).toHaveURL(/\/patients\/.+/);
    await expect(page.getByRole('heading', { name: patientName })).toBeVisible();

    await page.getByRole('tab', { name: 'Sesiones clínicas' }).click();
    await page.getByRole('link', { name: 'Registrar sesión' }).click();
    await expect(page).toHaveURL(/\/sessions\/new$/);
    await page.getByLabel('Motivo de consulta').fill('Control E2E de acné inflamatorio');
    await expect(page.getByText('Borrador guardado.')).toBeVisible({ timeout: 10_000 });

    await page.getByRole('button', { name: 'Marcar como completada' }).click();
    await expect(page.getByText('Sesión marcada como completada.')).toBeVisible();
    await expect(page.getByText('completed')).toBeVisible();
  });

  test('superadmin can access users administration', async ({ page }) => {
    test.skip(
      !superadminEmail || !superadminPassword,
      'E2E superadmin credentials are not configured.',
    );

    await page.getByLabel('Email').fill(superadminEmail!);
    await page.getByLabel('Contraseña').fill(superadminPassword!);
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL(/\/patients$/, { timeout: 15_000 });
    await page.getByRole('link', { name: 'Usuarios' }).click();
    await expect(page).toHaveURL(/\/admin\/users$/);
    await expect(page.getByRole('heading', { name: 'Usuarios' })).toBeVisible();
  });

  test('admin is redirected away from /admin/users', async ({ page }) => {
    test.skip(!adminEmail || !adminPassword, 'E2E admin credentials are not configured.');

    await page.getByLabel('Email').fill(adminEmail!);
    await page.getByLabel('Contraseña').fill(adminPassword!);
    await page.getByRole('button', { name: 'Ingresar' }).click();

    await expect(page).toHaveURL(/\/patients$/, { timeout: 15_000 });
    await page.goto('/admin/users');
    await expect(page).toHaveURL(/\/patients$/);
  });
});
