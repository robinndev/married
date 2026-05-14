'use client'

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  where,
  limit,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Message, Confirmation } from '@/types'

// ── Messages ──────────────────────────────────────────────
export async function addMessage(data: Omit<Message, 'id' | 'createdAt'>) {
  return addDoc(collection(db, 'messages'), {
    ...data,
    createdAt: Timestamp.now(),
  })
}

export function subscribeToMessages(cb: (msgs: Message[]) => void) {
  const q = query(collection(db, 'messages'), orderBy('createdAt', 'desc'))
  return onSnapshot(q, (snap) => {
    const msgs = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Message, 'id'>),
    }))
    cb(msgs)
  })
}

// ── Confirmations ─────────────────────────────────────────
export async function addConfirmation(data: Omit<Confirmation, 'id' | 'confirmedAt'>) {
  return addDoc(collection(db, 'confirmations'), {
    ...data,
    confirmedAt: Timestamp.now(),
  })
}

export async function checkAlreadyConfirmed(guestId: string) {
  const q = query(
    collection(db, 'confirmations'),
    where('guestId', '==', guestId),
    limit(1)
  )
  const snap = await getDocs(q)
  return !snap.empty
}

export async function getConfirmations(): Promise<Confirmation[]> {
  const snap = await getDocs(
    query(collection(db, 'confirmations'), orderBy('confirmedAt', 'desc'))
  )
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Confirmation, 'id'>) }))
}
