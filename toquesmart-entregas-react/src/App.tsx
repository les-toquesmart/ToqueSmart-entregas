import { useEffect, useMemo, useRef, useState } from 'react'
import { Check, ChevronRight, FilePlus2, Save, Trash2, X } from 'lucide-react'
import { createDelivery } from './lib/delivery'
import { deleteDelivery, getDeliveries, saveDelivery } from './lib/db'
import { generatePdf } from './lib/pdf'
import { STEPS, SYSTEMS, VERIFICATION_ITEMS } from './lib/constants'
import type { DeliveryProject, SystemOwner } from './types/delivery'
import { SignaturePad } from './components/SignaturePad'
import { DeliveryDocument } from './features/delivery/DeliveryDocument'

export default function App() {
  const [delivery, setDelivery] = useState<DeliveryProject>(createDelivery)
  const [deliveries, setDeliveries] = useState<DeliveryProject[]>([])
  const [step, setStep] = useState(0)
  const [preview, setPreview] = useState(false)
  const documentRef = useRef<HTMLDivElement>(null)

  const refresh = async () => setDeliveries(await getDeliveries())
  useEffect(() => { refresh() }, [])

  const patch = (fn: (draft: DeliveryProject) => void) => {
    setDelivery((current) => { const next = structuredClone(current); fn(next); next.updatedAt = new Date().toISOString(); return next })
  }
  const save = async () => { await saveDelivery(delivery); await refresh() }
  const remove = async (id: string) => {
    if (!confirm('¿Borrar este borrador? Esta acción no se puede deshacer.')) return
    await deleteDelivery(id)
    if (delivery.id === id) setDelivery(createDelivery())
    await refresh()
  }

  const complete = useMemo(() => [
    Boolean(delivery.project.name && delivery.project.clientName),
    Object.values(delivery.systems).some(Boolean),
    Object.values(delivery.verification).some(Boolean),
    Boolean(delivery.state.minor || delivery.state.minorNone || delivery.state.phase2 || delivery.state.phase2None),
    delivery.termsAccepted,
    Boolean(delivery.signatures.client && delivery.signatures.representative)
  ], [delivery])

  const finalize = async () => {
    const missing = []
    if (!delivery.project.name) missing.push('proyecto')
    if (!delivery.project.clientName) missing.push('cliente')
    if (!delivery.project.clientEmail) missing.push('correo')
    if (!delivery.termsAccepted) missing.push('aceptación de términos')
    if (!delivery.signatures.client) missing.push('firma del cliente')
    if (!delivery.signatures.representative) missing.push('firma de Toque Smart')
    if (missing.length) return alert(`Falta completar: ${missing.join(', ')}`)
    patch((d) => { d.status = 'finalized' })
    await saveDelivery({ ...delivery, status: 'finalized' })
    await refresh()
    setPreview(true)
  }

  const exportPdf = async () => {
    if (!documentRef.current) return
    await generatePdf(documentRef.current, `Acta_${delivery.project.name || 'Proyecto'}.pdf`)
  }

  return <>
    <header className="app-header"><div className="brand"><img src="./assets/logo-white.png"/><div><strong>Entregas</strong><small>Calidad, experiencia y postventa</small></div></div><div className="header-actions"><button onClick={() => setDelivery(createDelivery())}><FilePlus2/>Nuevo</button><button onClick={save}><Save/>Guardar</button><button className="primary" onClick={() => setPreview(true)}>Vista previa</button></div></header>
    <main className="app-shell"><aside className="sidebar"><p className="eyebrow">Recorrido de entrega</p><nav>{STEPS.map(([title, subtitle], index) => <button className={step === index ? 'active' : ''} onClick={() => setStep(index)} key={title}><span>{index + 1}</span><div><b>{title}</b><small>{subtitle}</small></div>{complete[index] && <Check/>}</button>)}</nav><div className="drafts-title"><p className="eyebrow">Borradores</p><span>{deliveries.length}</span></div><div className="draft-list">{deliveries.map((item) => <div className="draft" key={item.id}><button onClick={() => setDelivery(item)}><b>{item.project.name || 'Sin nombre'}</b><small>{item.project.clientName || 'Sin cliente'} · {item.status === 'finalized' ? 'Finalizado' : 'Borrador'}</small></button><button className="delete" onClick={() => remove(item.id)}><Trash2/></button></div>)}</div></aside>
    <section className="workspace">{renderStep(step, delivery, patch, finalize)}</section></main>
    {preview && <div className="preview-overlay"><div className="preview-toolbar"><strong>Vista previa final</strong><div><button onClick={exportPdf}>Descargar PDF</button><button onClick={() => window.print()}>Imprimir</button><button onClick={() => setPreview(false)}><X/></button></div></div><div className="preview-scroll" ref={documentRef}><DeliveryDocument delivery={delivery}/></div></div>}
  </>
}

function renderStep(step: number, delivery: DeliveryProject, patch: (fn: (draft: DeliveryProject) => void) => void, finalize: () => void) {
  const field = (label: string, value: string, onChange: (value: string) => void, type = 'text') => <label className="field"><span>{label}</span><input type={type} value={value} onChange={(event) => onChange(event.target.value)}/></label>
  if (step === 0) return <><h1>Información del proyecto</h1><p className="subtitle">Completa los datos que aparecerán en el acta.</p><div className="form-grid">{field('Nombre del proyecto', delivery.project.name, (v) => patch(d => { d.project.name = v }))}{field('Cliente', delivery.project.clientName, (v) => patch(d => { d.project.clientName = v }))}{field('Correo del cliente', delivery.project.clientEmail, (v) => patch(d => { d.project.clientEmail = v }), 'email')}{field('Teléfono', delivery.project.clientPhone, (v) => patch(d => { d.project.clientPhone = v }), 'tel')}{field('Dirección', delivery.project.address, (v) => patch(d => { d.project.address = v }))}{field('Fecha de entrega', delivery.project.deliveryDate, (v) => patch(d => { d.project.deliveryDate = v }), 'date')}{field('Representante Toque Smart', delivery.project.representative, (v) => patch(d => { d.project.representative = v }))}</div><label className="field full"><span>Alcance del proyecto</span><textarea value={delivery.project.scope} onChange={(e) => patch(d => { d.project.scope = e.target.value })}/></label><div className="photo-picker"><img src={delivery.project.coverImage || './assets/default-cover.png'} onError={(e) => { e.currentTarget.src = './assets/default-cover.png' }}/><input type="file" accept="image/*" onChange={(e) => { const file=e.target.files?.[0]; if(!file)return; const reader=new FileReader(); reader.onload=()=>patch(d=>{d.project.coverImage=String(reader.result)}); reader.readAsDataURL(file)}}/><button onClick={() => patch(d => { d.project.coverImage = './assets/default-cover.png' })}>Usar imagen predeterminada</button></div></>
  if (step === 1) return <><h1>Sistemas instalados</h1><p className="subtitle">Selecciona una condición para cada sistema.</p><div className="systems-table"><table><thead><tr><th>Sistema</th><th>Toque Smart</th><th>Cliente</th><th>Tercero</th><th>No presente</th></tr></thead><tbody>{SYSTEMS.map((system) => <tr key={system}><td>{system}</td>{(['toque','client','third','none'] as SystemOwner[]).map((value) => <td key={value}><input type="radio" name={system} checked={delivery.systems[system] === value} onChange={() => patch(d => { d.systems[system] = value })}/></td>)}</tr>)}</tbody></table></div></>
  if (step === 2) return <><h1>Verificación y recorrido</h1><p className="subtitle">Marca cada punto junto al cliente.</p><div className="check-grid">{VERIFICATION_ITEMS.map((item) => <label key={item}><input type="checkbox" checked={delivery.verification[item]} onChange={(e) => patch(d => { d.verification[item] = e.target.checked })}/><span>{item}</span></label>)}</div></>
  if (step === 3) return <><h1>Estado de entrega</h1><p className="subtitle">Registra pendientes y futuras etapas.</p><section className="stacked-section"><h2>Pendientes menores</h2><textarea value={delivery.state.minor} onChange={(e) => patch(d => { d.state.minor = e.target.value })}/><label><input type="checkbox" checked={delivery.state.minorNone} onChange={(e) => patch(d => { d.state.minorNone = e.target.checked })}/> No existen pendientes menores.</label></section><section className="stacked-section"><h2>Fase II o trabajos futuros</h2><textarea value={delivery.state.phase2} onChange={(e) => patch(d => { d.state.phase2 = e.target.value })}/><label><input type="checkbox" checked={delivery.state.phase2None} onChange={(e) => patch(d => { d.state.phase2None = e.target.checked })}/> No existen trabajos futuros documentados.</label></section><section className="stacked-section"><h2>Observaciones generales</h2><textarea value={delivery.state.notes} onChange={(e) => patch(d => { d.state.notes = e.target.value })}/></section></>
  if (step === 4) return <><h1>Términos y servicio</h1><p className="subtitle">Revísalos con el cliente antes de firmar.</p><div className="terms-summary"><p><b>Garantía de equipos:</b> un año directamente con el fabricante.</p><p><b>Garantía de instalación y programación:</b> noventa días.</p><p><b>Exclusiones:</b> daños físicos, terceros no autorizados, fluctuaciones eléctricas, humedad, fenómenos naturales, fallas de internet, licencias y servicios de terceros.</p><p><b>Modificaciones posteriores:</b> pueden generar cargos conforme a las tarifas vigentes.</p></div><label className="accept"><input type="checkbox" checked={delivery.termsAccepted} onChange={(e) => patch(d => { d.termsAccepted = e.target.checked })}/> El cliente confirma haber revisado y comprendido los términos.</label><div className="plan-grid"><label><input type="radio" name="plan" checked={delivery.servicePlan === 'care'} onChange={() => patch(d => { d.servicePlan = 'care' })}/><b>Toque Smart Care</b><span>Plan activo de mantenimiento y servicio.</span></label><label><input type="radio" name="plan" checked={delivery.servicePlan === 'none'} onChange={() => patch(d => { d.servicePlan = 'none' })}/><b>Sin plan activo</b><span>Servicios sujetos a tarifas vigentes.</span></label></div></>
  return <><h1>Firmas y finalización</h1><p className="subtitle">Recoge ambas firmas con Apple Pencil o el dedo.</p><div className="form-grid">{field('Correo del cliente', delivery.project.clientEmail, (v) => patch(d => { d.project.clientEmail = v }), 'email')}{field('Cédula del cliente', delivery.signatures.clientId, (v) => patch(d => { d.signatures.clientId = v }))}</div><div className="signature-grid"><SignaturePad label="Firma Toque Smart" value={delivery.signatures.representative} onChange={(v) => patch(d => { d.signatures.representative = v })}/><SignaturePad label="Firma del cliente" value={delivery.signatures.client} onChange={(v) => patch(d => { d.signatures.client = v })}/></div><button className="finalize" onClick={finalize}>Aceptar y finalizar <ChevronRight/></button></>
}
