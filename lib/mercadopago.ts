import { MercadoPagoConfig, Preference } from 'mercadopago'

export interface CreatePreferenceInput {
  id: string
  title: string
  price: number
  description?: string
}

function getClient(): MercadoPagoConfig {
  const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN
  if (!accessToken) {
    throw new Error('MERCADO_PAGO_ACCESS_TOKEN is not configured in environment variables.')
  }
  return new MercadoPagoConfig({ accessToken, options: { timeout: 5000 } })
}

export async function createPreference(input: CreatePreferenceInput): Promise<string> {
  const client = getClient()
  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '')

  const preference = new Preference(client)

  const response = await preference.create({
    body: {
      items: [
        {
          id: input.id,
          title: input.title,
          description: input.description ?? input.title,
          quantity: 1,
          unit_price: input.price,
          currency_id: 'BRL',
          category_id: 'others',
        },
      ],
      back_urls: {
        success: `${siteUrl}/pagamento/sucesso`,
        failure: `${siteUrl}/pagamento/erro`,
        pending: `${siteUrl}/pagamento/pendente`,
      },
      auto_return: siteUrl.startsWith('http://localhost') ? undefined : 'approved',
      payment_methods: {
        installments: 12,
      },
      statement_descriptor: 'N&M 01.08.2026',
      external_reference: input.id,
      metadata: {
        gift_id: input.id,
        wedding: 'natacha-mauricio-2026-08-01',
      },
      // Webhook: descomente e configure NEXT_PUBLIC_SITE_URL na Vercel para receber notificações de pagamento.
      // notification_url: `${siteUrl}/api/webhook`,
    },
  })

  if (!response.init_point) {
    throw new Error('Mercado Pago did not return a checkout URL.')
  }

  return response.init_point
}
