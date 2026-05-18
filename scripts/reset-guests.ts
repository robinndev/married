/**
 * reset-guests.ts
 *
 * ATENÇÃO: script destrutivo — use APENAS uma vez, antes de qualquer
 * confirmação real de convidados. Após o evento começar a receber
 * confirmações, esta operação estará bloqueada automaticamente.
 */
import * as dotenv from 'dotenv'
import { resolve } from 'path'
import * as readline from 'readline'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, getDocs, query, where, deleteDoc, doc, setDoc } from 'firebase/firestore'
import guestsData from '../mocks/guests.json'

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

const app = getApps().length ? getApp() : initializeApp(firebaseConfig)
const db = getFirestore(app)

const INVITED_AT = '2026-01-01'

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((res) => {
    rl.question(question, (answer) => { rl.close(); res(answer.trim().toLowerCase()) })
  })
}

async function reset() {
  console.log('\n🔒 Reset de convidados — Natacha & Mauricio')
  console.log('════════════════════════════════════════════\n')
  console.log(`  Projeto : ${firebaseConfig.projectId}`)
  console.log(`  Arquivo : mocks/guests.json (${guestsData.length} convidados)\n`)
  console.log('  ⚠️  Esta operação apaga TODOS os convidados do Firestore')
  console.log('  ⚠️  e reinsere a lista atual do mocks/guests.json.\n')

  // ── TRAVA DE SEGURANÇA ───────────────────────────────────
  console.log('  🔍 Verificando confirmações existentes...')
  const confirmedQ = query(collection(db, 'guests'), where('confirmed', '==', true))
  const confirmedSnap = await getDocs(confirmedQ)

  if (!confirmedSnap.empty) {
    console.error(`\n  🔒 OPERAÇÃO BLOQUEADA`)
    console.error(`  ${confirmedSnap.size} convidado(s) já confirmaram presença.`)
    console.error('  Para proteger os dados do evento, este script não pode')
    console.error('  ser executado enquanto houver confirmações ativas.\n')
    process.exit(1)
  }
  console.log('  ✓ Nenhuma confirmação ativa encontrada.\n')

  // ── TRIPLA CONFIRMAÇÃO ───────────────────────────────────
  const r1 = await ask('  [1/3] Você tem certeza que quer apagar e reinserir todos os convidados? (s/n): ')
  if (r1 !== 's') { console.log('\n  Operação cancelada.\n'); process.exit(0) }

  const r2 = await ask('  [2/3] Esta ação é IRREVERSÍVEL. Confirma? (s/n): ')
  if (r2 !== 's') { console.log('\n  Operação cancelada.\n'); process.exit(0) }

  const r3 = await ask('  [3/3] ÚLTIMA CONFIRMAÇÃO — apagar tudo e reinserir agora? (s/n): ')
  if (r3 !== 's') { console.log('\n  Operação cancelada.\n'); process.exit(0) }

  // ── EXECUÇÃO ──────────────────────────────────────────────
  console.log('\n  Apagando convidados existentes...')
  const allSnap = await getDocs(collection(db, 'guests'))
  await Promise.all(allSnap.docs.map((d) => deleteDoc(doc(db, 'guests', d.id))))
  console.log(`  🗑  ${allSnap.size} documento(s) removido(s)\n`)

  console.log('  Inserindo nova lista...\n')
  let created = 0
  for (const guest of guestsData) {
    await setDoc(doc(db, 'guests', guest.id), {
      name: guest.name,
      nucleus: guest.nucleus ?? '',
      invitedAt: INVITED_AT,
      confirmed: false,
    })
    process.stdout.write(`  ✓  ${guest.name}\n`)
    created++
  }

  console.log(`\n✅ Concluído: ${created} convidados inseridos`)
  console.log('═══════════════════════════════════════════════\n')
  process.exit(0)
}

reset().catch((err) => {
  console.error('\n❌ Erro:', err.message)
  process.exit(1)
})
