// Vercel function example. Set RESEND_API_KEY and FROM_EMAIL in your deployment environment.
// The frontend can POST { clientEmail, projectName, pdfBase64 } to this endpoint.
import type { VercelRequest, VercelResponse } from '@vercel/node'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { clientEmail, projectName, pdfBase64 } = req.body ?? {}
  if (!clientEmail || !pdfBase64) return res.status(400).json({ error: 'Missing data' })

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.FROM_EMAIL,
      to: [clientEmail],
      cc: ['soporte@toquesmart.com'],
      subject: `Acta de entrega - ${projectName || 'Proyecto'}`,
      html: '<p>Adjuntamos el acta de entrega de su proyecto.</p>',
      attachments: [{ filename: 'acta-entrega.pdf', content: pdfBase64 }]
    })
  })
  const data = await response.json()
  return res.status(response.ok ? 200 : 500).json(data)
}
