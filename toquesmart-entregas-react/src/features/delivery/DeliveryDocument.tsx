import type { DeliveryProject } from '../../types/delivery'
import { SUPPORT_EMAIL, SUPPORT_WHATSAPP, SYSTEMS, VERIFICATION_ITEMS } from '../../lib/constants'

interface Props { delivery: DeliveryProject }
const mark = (value: boolean) => value ? '✓' : '□'

function Header({ page }: { page: number }) {
  return <div className="document-header"><img src="./assets/logo-dark.png" /><span>ACTA DE ENTREGA <b>{page}</b></span></div>
}
function Footer() {
  return <div className="document-footer"><span>● &nbsp; Tecnología integrada a tu vida.</span><span>toquesmart.com</span></div>
}

export function DeliveryDocument({ delivery }: Props) {
  const p = delivery.project
  return (
    <div className="document-stack">
      <section className="document-page document-cover" data-pdf-page>
        <div className="cover-hero">
          <div className="cover-copy"><img src="./assets/logo-white.png"/><h1>ACTA DE<br/><strong>ENTREGA</strong><br/>Y ACEPTACIÓN<br/>DE PROYECTO</h1><span>TECNOLOGÍA<br/>INTEGRADA A TU VIDA.</span></div>
          <div className="cover-photo"><img src={p.coverImage || './assets/default-cover.png'} /></div>
        </div>
        <div className="cover-info">
          <dl><dt>Proyecto</dt><dd>{p.name}</dd><dt>Cliente</dt><dd>{p.clientName}</dd><dt>Correo</dt><dd>{p.clientEmail}</dd><dt>Dirección</dt><dd>{p.address}</dd><dt>Fecha</dt><dd>{p.deliveryDate}</dd><dt>Representante</dt><dd>{p.representative}</dd></dl>
          <div className="cover-scope"><h2>Alcance del proyecto</h2><p>{p.scope}</p></div>
        </div>
        <div className="cover-footer"><span>toquesmart.com</span><span>Somos arquitectos de una vida integrada.</span><b>1</b></div>
      </section>

      <section className="document-page" data-pdf-page><Header page={2}/><h2>Sistemas instalados</h2><div className="document-accent"/><table className="document-table"><thead><tr><th>Sistema</th><th>Toque Smart</th><th>Cliente</th><th>Tercero</th></tr></thead><tbody>{SYSTEMS.map((system) => <tr key={system}><td>{system}</td><td>{mark(delivery.systems[system] === 'toque')}</td><td>{mark(delivery.systems[system] === 'client')}</td><td>{mark(delivery.systems[system] === 'third')}</td></tr>)}</tbody></table><h2 className="document-section-title">Verificación y pruebas realizadas</h2><div className="document-accent"/><div className="document-check-grid">{VERIFICATION_ITEMS.map((item) => <p key={item}>{mark(delivery.verification[item])} {item}</p>)}</div><Footer/></section>

      <section className="document-page" data-pdf-page><Header page={3}/><h2>Estado de entrega</h2><div className="document-accent"/><p>Después de realizar la revisión conjunta, los sistemas instalados funcionan correctamente y cumplen con el alcance contratado.</p><div className="document-block"><h3>Pendientes menores</h3><p>{delivery.state.minorNone ? 'No existen pendientes menores.' : delivery.state.minor}</p></div><div className="document-block"><h3>Fase II o trabajos futuros</h3><p>{delivery.state.phase2None ? 'No existen trabajos futuros documentados.' : delivery.state.phase2}</p></div><div className="document-block"><h3>Observaciones generales</h3><p>{delivery.state.notes}</p></div><Footer/></section>

      <section className="document-page" data-pdf-page><Header page={4}/><h2>Garantías y condiciones</h2><div className="document-accent"/><div className="terms-list"><article><b>Garantía de equipos</b><p>Los equipos suministrados cuentan con garantía de un (1) año directamente con el fabricante, sujeta a sus políticas, procedimientos y aprobación.</p></article><article><b>Garantía de instalación y programación</b><p>Toque Smart ofrece una garantía de noventa (90) días sobre la instalación, configuración y programación realizadas dentro del alcance contratado.</p></article><article><b>Exclusiones</b><p>No incluye daños físicos, terceros no autorizados, fluctuaciones eléctricas, fuego, humedad, filtraciones, fenómenos naturales, fallas de internet, licencias, suscripciones ni servicios de terceros.</p></article><article><b>Modificaciones posteriores</b><p>Cualquier modificación o ajuste posterior podrá estar sujeto a evaluación y cargos conforme a las tarifas vigentes.</p></article></div><h2 className="document-section-title">Soporte y servicio</h2><div className="document-accent"/><div className="support-strip"><div><b>WhatsApp</b><span>{SUPPORT_WHATSAPP}</span></div><div><b>Correo</b><span>{SUPPORT_EMAIL}</span></div><div><b>Horario</b><span>Lunes a viernes · 9:00am–6:00pm</span></div></div><Footer/></section>

      <section className="document-page" data-pdf-page><Header page={5}/><h2>Aceptación del proyecto</h2><div className="document-accent"/><p>El cliente confirma haber participado en la revisión final, haber recibido el proyecto y aceptar las condiciones aquí indicadas.</p><p><b>Plan de servicio:</b> {delivery.servicePlan === 'care' ? 'Toque Smart Care' : 'Sin plan activo'}</p><div className="signature-document-grid"><div><h3>Toque Smart</h3>{delivery.signatures.representative && <img src={delivery.signatures.representative}/>}<p>{p.representative}</p></div><div><h3>Cliente</h3>{delivery.signatures.client && <img src={delivery.signatures.client}/>}<p>{p.clientName}<br/>{delivery.signatures.clientId}</p></div></div><Footer/></section>
    </div>
  )
}
