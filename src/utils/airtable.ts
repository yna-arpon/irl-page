const AIRTABLE_API_KEY = import.meta.env.VITE_AIRTABLE_API_KEY
const AIRTABLE_BASE_ID = import.meta.env.VITE_AIRTABLE_BASE_ID
const AIRTABLE_TABLE   = 'Leads'

export async function postToAirtable(fields: Record<string, unknown>): Promise<boolean> {
  if (!AIRTABLE_API_KEY || AIRTABLE_API_KEY === 'YOUR_AIRTABLE_API_KEY') {
    console.log('[IRL] Airtable not configured — would have submitted:', fields)
    return true
  }
  try {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE}`, {
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