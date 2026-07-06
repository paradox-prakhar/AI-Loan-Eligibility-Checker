import { env } from '../config/env';

export async function syncReportToSheets(payload: Record<string, unknown>) {
  if (!env.GOOGLE_SHEETS_APP_SCRIPT_URL) {
    return { synced: false, reason: 'Google Sheets integration disabled' };
  }

  const response = await fetch(env.GOOGLE_SHEETS_APP_SCRIPT_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      secret: env.GOOGLE_SHEETS_WEBHOOK_SECRET,
      ...payload,
    }),
  });

  return { synced: response.ok };
}