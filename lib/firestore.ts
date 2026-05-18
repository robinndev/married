'use client'

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteField,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  writeBatch,
} from 'firebase/firestore'
import { db } from './firebase'
import type { Guest, Message } from '@/types'

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

// ── Guests ────────────────────────────────────────────────
export function subscribeToGuests(cb: (guests: Guest[]) => void) {
  const q = query(collection(db, 'guests'), orderBy('name', 'asc'))
  return onSnapshot(q, (snap) => {
    const guests = snap.docs.map((d) => ({
      id: d.id,
      ...(d.data() as Omit<Guest, 'id'>),
    })) as Guest[]
    cb(guests)
  })
}

export async function getGuests(): Promise<Guest[]> {
  const snap = await getDocs(query(collection(db, 'guests'), orderBy('name', 'asc')))
  return snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Guest, 'id'>) })) as Guest[]
}

export async function confirmGuest(
  guestId: string,
  data: { phone: string; message?: string; totalGuests: number }
) {
  const ref = doc(db, 'guests', guestId)
  await updateDoc(ref, {
    confirmed: true,
    phone: data.phone.trim(),
    message: data.message?.trim() ?? '',
    totalGuests: data.totalGuests,
    confirmedAt: Timestamp.now(),
  })
}

export async function confirmGroup(
  primaryId: string,
  companionIds: string[],
  data: { phone: string; message?: string; totalGuests: number }
) {
  const batch = writeBatch(db)
  const now = Timestamp.now()

  const primaryRef = doc(db, 'guests', primaryId)
  batch.update(primaryRef, {
    confirmed: true,
    phone: data.phone.trim(),
    message: data.message?.trim() ?? '',
    totalGuests: data.totalGuests,
    confirmedAt: now,
    ...(companionIds.length > 0 ? { companions: companionIds } : {}),
  })

  for (const cId of companionIds) {
    const cRef = doc(db, 'guests', cId)
    batch.update(cRef, {
      confirmed: true,
      totalGuests: data.totalGuests,
      confirmedAt: now,
      groupLeaderId: primaryId,
    })
  }

  await batch.commit()
}

export async function unconfirmGuest(guestId: string) {
  const ref = doc(db, 'guests', guestId)
  await updateDoc(ref, {
    confirmed: false,
    phone: deleteField(),
    message: deleteField(),
    totalGuests: deleteField(),
    confirmedAt: deleteField(),
    companions: deleteField(),
    groupLeaderId: deleteField(),
  })
}

export async function unconfirmGroup(primaryId: string, companionIds: string[]) {
  const batch = writeBatch(db)

  const primaryRef = doc(db, 'guests', primaryId)
  batch.update(primaryRef, {
    confirmed: false,
    phone: deleteField(),
    message: deleteField(),
    totalGuests: deleteField(),
    confirmedAt: deleteField(),
    companions: deleteField(),
  })

  for (const cId of companionIds) {
    const cRef = doc(db, 'guests', cId)
    batch.update(cRef, {
      confirmed: false,
      totalGuests: deleteField(),
      confirmedAt: deleteField(),
      groupLeaderId: deleteField(),
    })
  }

  await batch.commit()
}

export async function updateGuestInfo(
  guestId: string,
  data: { phone?: string; totalGuests?: number }
) {
  const ref = doc(db, 'guests', guestId)
  await updateDoc(ref, data)
}

// ── Gift analytics ────────────────────────────────────────
export async function logGiftClick(giftId: string, giftName: string, price: number) {
  return addDoc(collection(db, 'giftClicks'), {
    giftId,
    giftName,
    price,
    clickedAt: Timestamp.now(),
  })
}

export async function getGuest(guestId: string): Promise<Guest | null> {
  const { getDoc } = await import('firebase/firestore')
  const snap = await getDoc(doc(db, 'guests', guestId))
  if (!snap.exists()) return null
  return { id: snap.id, ...(snap.data() as Omit<Guest, 'id'>) }
}
