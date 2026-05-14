import { NextRequest, NextResponse } from 'next/server'

/**
 * WEBHOOK DO MERCADO PAGO — estrutura preparada para implementação futura.
 *
 * Para ativar:
 * 1. Descomente `notification_url` em lib/mercadopago.ts
 * 2. Configure MERCADO_PAGO_ACCESS_TOKEN e NEXT_PUBLIC_SITE_URL na Vercel
 * 3. No painel MP (Developers → Webhooks), registre: https://seu-dominio.com/api/webhook
 * 4. Selecione os eventos: payment.created, payment.updated
 * 5. Implemente a lógica abaixo (ex.: marcar presente como "comprado" no Firestore)
 *
 * Referência: https://www.mercadopago.com.br/developers/pt/docs/your-integrations/notifications/webhooks
 */
export async function POST(request: NextRequest) {
  // Mercado Pago envia uma query ?type=payment&data.id=xxx
  // O corpo pode conter { action: 'payment.created', data: { id: '...' } }

  // TODO: validar assinatura do webhook (x-signature header) antes de processar
  // TODO: buscar detalhes do pagamento via API MP usando data.id
  // TODO: se status === 'approved', marcar o presente como comprado no Firestore
  //   await markGiftAsPurchased(giftId)

  const body = await request.json().catch(() => ({}))
  console.log('[webhook] received:', JSON.stringify(body))

  // Retornar 200 para o MP não reenviar a notificação
  return NextResponse.json({ received: true })
}
