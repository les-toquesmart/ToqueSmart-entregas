import { openDB } from 'idb'
import type { DeliveryProject } from '../types/delivery'

const dbPromise = openDB('toquesmart-entregas', 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('deliveries')) {
      db.createObjectStore('deliveries', { keyPath: 'id' })
    }
  }
})

export async function saveDelivery(delivery: DeliveryProject) {
  const db = await dbPromise
  await db.put('deliveries', { ...delivery, updatedAt: new Date().toISOString() })
}

export async function getDeliveries(): Promise<DeliveryProject[]> {
  const db = await dbPromise
  const all = await db.getAll('deliveries') as DeliveryProject[]
  return all.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
}

export async function deleteDelivery(id: string) {
  const db = await dbPromise
  await db.delete('deliveries', id)
}
