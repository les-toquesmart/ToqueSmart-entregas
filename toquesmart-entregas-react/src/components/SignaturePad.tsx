import { useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (value: string) => void
  label: string
}

export function SignaturePad({ value, onChange, label }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !value) return
    const context = canvas.getContext('2d')
    const image = new Image()
    image.onload = () => context?.drawImage(image, 0, 0, canvas.width, canvas.height)
    image.src = value
  }, [value])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const context = canvas.getContext('2d')
    if (!context) return
    context.lineWidth = 4
    context.lineCap = 'round'
    context.strokeStyle = '#102638'
    let active = false
    let previous = { x: 0, y: 0 }

    const point = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      return {
        x: (event.clientX - rect.left) * (canvas.width / rect.width),
        y: (event.clientY - rect.top) * (canvas.height / rect.height)
      }
    }
    const down = (event: PointerEvent) => {
      active = true
      previous = point(event)
      canvas.setPointerCapture(event.pointerId)
    }
    const move = (event: PointerEvent) => {
      if (!active) return
      const next = point(event)
      context.beginPath()
      context.moveTo(previous.x, previous.y)
      context.lineTo(next.x, next.y)
      context.stroke()
      previous = next
    }
    const up = () => {
      if (!active) return
      active = false
      onChange(canvas.toDataURL('image/png'))
    }
    canvas.addEventListener('pointerdown', down)
    canvas.addEventListener('pointermove', move)
    canvas.addEventListener('pointerup', up)
    canvas.addEventListener('pointerleave', up)
    return () => {
      canvas.removeEventListener('pointerdown', down)
      canvas.removeEventListener('pointermove', move)
      canvas.removeEventListener('pointerup', up)
      canvas.removeEventListener('pointerleave', up)
    }
  }, [onChange])

  const clear = () => {
    const canvas = canvasRef.current
    canvas?.getContext('2d')?.clearRect(0, 0, canvas.width, canvas.height)
    onChange('')
  }

  return (
    <div className="signature-card">
      <div className="signature-card__header"><strong>{label}</strong><button type="button" onClick={clear}>Limpiar</button></div>
      <canvas ref={canvasRef} width={900} height={360} aria-label={label} />
    </div>
  )
}
