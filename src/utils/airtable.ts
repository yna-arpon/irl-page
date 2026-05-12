const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY
const AIRTABLE_BASE_ID =String(import.meta.env.VITE_AIRTABLE_BASE_ID ?? '')
export const AIRTABLE_PARENTS_BASE_ID = String(import.meta.env.VITE_AIRTABLE_PARENTS_BASE_ID ?? '')
const AIRTABLE_TABLE   = import.meta.env.VITE_AIRTABLE_TABLE || 'Leads';

export async function postToAirtable(fields: Record<string, unknown>, base_id: string = AIRTABLE_BASE_ID): Promise<boolean> {
  if (!AIRTABLE_API_KEY) {
    console.log('[IRL] Airtable not configured — would have submitted:', fields)
    return true
  }
  try {
    const res = await fetch(`https://api.airtable.com/v0/${base_id}/${AIRTABLE_TABLE}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ fields }),
    })
    return res.ok
  } catch (e) {
    console.error('[IRL] Airtable error:', e)
    return false
  }
}