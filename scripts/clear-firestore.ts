import * as dotenv from 'dotenv'
import { resolve } from 'path'
import * as readline from 'readline'

dotenv.config({ path: resolve(process.cwd(), '.env.local') })

import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, collection, getDocs, deleteDoc, doc } from 'firebase/firestore'

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

const COLLECTIONS = ['guests', 'messages', 'confirmations', 'gifts']

async function clearCollection(name: string) {
  const snap = await getDocs(collection(db, name))
  if (snap.empty) {
    console.log(`  ⏭  ${name}: vazio`)
    return 0
  }
  await Promise.all(snap.docs.map((d) => deleteDoc(doc(db, name, d.id))))
  console.log(`  🗑  ${name}: ${snap.size} documento(s) removido(s)`)
  return snap.size
}

function confirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close()
      resolve(answer.trim().toLowerCase() === 's')
    })
  })
}

async function clear() {
  console.log('\n⚠️  Clear Firestore — Natacha & Mauricio\n')
  console.log(`  Projeto : ${firebaseConfig.projectId}`)
  console.log(`  Coleções: ${COLLECTIONS.join(', ')}\n`)

  const ok = await confirm('  Tem certeza? Isso é IRREVERSÍVEL. Digite "s" para confirmar: ')
  if (!ok) {
    console.log('\n  Operação cancelada.\n')
    process.exit(0)
  }

  console.log('\n  Limpando...\n')
  let total = 0
  for (const name of COLLECTIONS) {
    total += await clearCollection(name)
  }

  console.log(`\n✅ Concluído: ${total} documento(s) removido(s)\n`)
  process.exit(0)
}

clear().catch((err) => {
  console.error('\n❌ Erro:', err.message)
  process.exit(1)
})
