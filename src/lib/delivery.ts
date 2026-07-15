import type { DeliveryProject } from '../types/delivery'
import { SYSTEMS, VERIFICATION_ITEMS } from './constants'

export function createDelivery(): DeliveryProject {
  const now = new Date().toISOString()
  return {
    id: crypto.randomUUID(),
    status: 'draft',
    createdAt: now,
    updatedAt: now,
    project: {
      name: '', clientName: '', clientEmail: '', clientPhone: '', address: '',
      deliveryDate: now.slice(0, 10), representative: '', scope: '', coverImage: './assets/default-cover.png'
    },
    systems: Object.fromEntries(SYSTEMS.map((item) => [item, ''])),
    verification: Object.fromEntries(VERIFICATION_ITEMS.map((item) => [item, false])),
    state: { minor: '', minorNone: false, phase2: '', phase2None: false, notes: '' },
    termsAccepted: false,
    servicePlan: '',
    signatures: { representative: '', client: '', clientId: '' }
  }
}
