import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore'
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

async function seed() {
  console.log('\n🌸 Seed de convidados — Natacha & Mauricio\n')
  console.log(`  Projeto: ${firebaseConfig.projectId}\n`)

  let created = 0
  let skipped = 0

  for (const guest of guestsData) {
    const ref = doc(db, 'guests', guest.id)
    const existing = await getDoc(ref)

    if (existing.exists()) {
      process.stdout.write(`  ⏭  ${guest.name}\n`)
      skipped++
      continue
    }

    await setDoc(ref, {
      name: guest.name,
      invitedAt: INVITED_AT,
      confirmed: false,
    })

    process.stdout.write(`  ✓  ${guest.name}\n`)
    created++
  }

  console.log(`\n✅ Concluído: ${created} criados, ${skipped} ignorados\n`)
  process.exit(0)
}

seed().catch((err) => {
  console.error('\n❌ Erro:', err.message)
  if (err.message?.includes('permission')) {
    console.error('\n  → Atualize as regras do Firestore para permitir escrita na coleção "guests".')
    console.error('  → Veja as instruções no README.\n')
  }
  process.exit(1)
})
