import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function generatePdf(element: HTMLElement, filename: string) {
  const pages = Array.from(element.querySelectorAll<HTMLElement>('[data-pdf-page]'))
  if (!pages.length) throw new Error('No se encontraron páginas para exportar.')

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'in', format: 'letter', compress: true })
  for (let index = 0; index < pages.length; index += 1) {
    const canvas = await html2canvas(pages[index], {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false
    })
    const image = canvas.toDataURL('image/jpeg', 0.95)
    if (index > 0) pdf.addPage('letter', 'portrait')
    pdf.addImage(image, 'JPEG', 0, 0, 8.5, 11, undefined, 'FAST')
  }
  pdf.save(filename)
  return pdf.output('blob')
}
