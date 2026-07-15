export type SystemOwner = 'toque' | 'client' | 'third' | 'none' | ''
export type DeliveryStatus = 'draft' | 'finalized'

export interface DeliveryProject {
  id: string
  status: DeliveryStatus
  createdAt: string
  updatedAt: string
  project: {
    name: string
    clientName: string
    clientEmail: string
    clientPhone: string
    address: string
    deliveryDate: string
    representative: string
    scope: string
    coverImage: string
  }
  systems: Record<string, SystemOwner>
  verification: Record<string, boolean>
  state: {
    minor: string
    minorNone: boolean
    phase2: string
    phase2None: boolean
    notes: string
  }
  termsAccepted: boolean
  servicePlan: 'care' | 'none' | ''
  signatures: {
    representative: string
    client: string
    clientId: string
  }
}
