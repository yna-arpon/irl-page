const BEEHIIV_API_KEY = import.meta.env.VITE_BEEHIIV_API_KEY
const BEEHIIV_PUBLICATION_ID = import.meta.env.VITE_BEEHIIV_PUBLICATION_ID

export async function postToBeehiiv(email: string): Promise<boolean> {
  if (!BEEHIIV_API_KEY || !BEEHIIV_PUBLICATION_ID) {
    console.log('[IRL] Beehiiv not configured:', email)
    return true
  }
  try {
    const res = await fetch(
      `https://api.beehiiv.com/v2/publications/${BEEHIIV_PUBLICATION_ID}/subscriptions`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BEEHIIV_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, reactivate_existing: false, send_welcome_email: true }),
      }
    )
    return res.ok
  } catch (e) {
    console.error('[IRL] Beehiiv error:', e)
    return false
  }
}