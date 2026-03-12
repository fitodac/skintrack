import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(value: string | null | undefined) {
  if (!value) return 'Sin dato';

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
  }).format(new Date(value));
}

export function formatDateTime(value: string | null | undefined) {
  if (!value) return 'Sin dato';

  return new Intl.DateTimeFormat('es-AR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export function buildSearchParams(
  current: URLSearchParams,
  key: string,
  value: string | undefined,
) {
  const params = new URLSearchParams(current);

  if (!value) {
    params.delete(key);
  } else {
    params.set(key, value);
  }

  if (key !== 'page') {
    params.set('page', '1');
  }

  return params.toString();
}
