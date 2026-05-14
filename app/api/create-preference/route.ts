import { NextRequest, NextResponse } from 'next/server'
import { createPreference } from '@/lib/mercadopago'
import giftsData from '@/mocks/gifts.json'

// ── Payload types ──────────────────────────────────────────────────
interface GiftPayload {
  type: 'gift'
  id: string
}

interface ContributionPayload {
  type: 'contribution'
  amount: number
}

type Payload = GiftPayload | ContributionPayload

// ── Gifts lookup (server-side — price is never trusted from client) ─
type GiftRecord = { id: string; name: string; description: string; price: number }
const gifts = giftsData as GiftRecord[]

// ── Route handler ──────────────────────────────────────────────────
export async function POST(request: NextRequest) {
  let body: Payload

  try {
    body = (await request.json()) as Payload
  } catch {
    return NextResponse.json({ error: 'Payload inválido.' }, { status: 400 })
  }

  try {
    // ─ Gift purchase ──────────────────────────────────────────────
    if (body.type === 'gift') {
      const { id } = body as GiftPayload

      if (!id || typeof id !== 'string' || id.length > 64) {
        return NextResponse.json({ error: 'ID do presente inválido.' }, { status: 400 })
      }

      const gift = gifts.find((g) => g.id === id)
      if (!gift) {
        return NextResponse.json({ error: 'Presente não encontrado.' }, { status: 404 })
      }

      const init_point = await createPreference({
        id: gift.id,
        title: gift.name,
        description: gift.description,
        price: gift.price,
      })

      return NextResponse.json({ init_point })
    }

    // ─ Custom contribution (PIX Surpresa via MP) ──────────────────
    if (body.type === 'contribution') {
      const amount = Number((body as ContributionPayload).amount)

      if (!Number.isFinite(amount) || amount < 1 || amount > 50_000) {
        return NextResponse.json(
          { error: 'Valor inválido. Use entre R$ 1,00 e R$ 50.000,00.' },
          { status: 400 }
        )
      }

      const init_point = await createPreference({
        id: 'contribuicao-lua-de-mel',
        title: 'Contribuição — Lua de Mel de Natacha & Mauricio',
        description: 'Contribuição para a lua-de-mel e o novo lar do casal.',
        price: Math.round(amount * 100) / 100,
      })

      return NextResponse.json({ init_point })
    }

    return NextResponse.json({ error: 'Tipo de operação inválido.' }, { status: 400 })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)

    if (msg.includes('MERCADO_PAGO_ACCESS_TOKEN')) {
      return NextResponse.json(
        { error: 'Pagamentos ainda não configurados. Adicione MERCADO_PAGO_ACCESS_TOKEN ao ambiente.' },
        { status: 503 }
      )
    }

    console.error('[api/create-preference]', err)
    return NextResponse.json(
      { error: 'Erro ao processar pagamento. Tente novamente.' },
      { status: 500 }
    )
  }
}
