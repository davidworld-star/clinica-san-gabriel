import { CalendarDays } from 'lucide-react'

import logoClinica from '../assets/logo-clinica.svg'
import './Encabezado.css'

const enlaces = [
  { texto: 'Inicio', activo: true },
  { texto: 'Pacientes', activo: false },
  { texto: 'Médicos', activo: false },
  { texto: 'Citas', activo: false },
]

function Encabezado() {
  const hoy = new Date()
  const fechaLarga = new Intl.DateTimeFormat('es-PE', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(hoy)
  const fechaVisible = fechaLarga.charAt(0).toUpperCase() + fechaLarga.slice(1)

  return (
    <header className="encabezado">
      <div className="contenedor encabezado__barra">
        <a className="encabezado__marca" href="/" aria-label="Clínica San Gabriel, inicio">
          <img
            className="encabezado__logo"
            src={logoClinica}
            alt="Logo de la Clínica San Gabriel"
            width="48"
            height="48"
          />
          <span className="encabezado__identidad">
            <strong>Clínica San Gabriel</strong>
            <span>Cuidado cercano, atención confiable</span>
          </span>
        </a>

        <nav className="encabezado__navegacion" aria-label="Navegación principal">
          {enlaces.map((enlace) => (
            <button
              key={enlace.texto}
              type="button"
              className={`encabezado__enlace${enlace.activo ? ' encabezado__enlace--activo' : ''}`}
              aria-current={enlace.activo ? 'page' : undefined}
              disabled={!enlace.activo}
              title={enlace.activo ? undefined : 'Disponible en los siguientes pasos'}
            >
              {enlace.texto}
            </button>
          ))}
        </nav>

        <div className="encabezado__fecha" aria-label={`Fecha actual: ${fechaVisible}`}>
          <CalendarDays size={18} aria-hidden="true" />
          <time dateTime={hoy.toISOString().slice(0, 10)}>{fechaVisible}</time>
        </div>
      </div>
    </header>
  )
}

export default Encabezado
