import { CalendarDays } from 'lucide-react'

import logoClinica from '../assets/logo-clinica.svg'
import './Encabezado.css'

const enlaces = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'pacientes', texto: 'Pacientes' },
  { id: 'medicos', texto: 'Médicos' },
  { id: 'citas', texto: 'Citas', deshabilitado: true },
]

function Encabezado({ paginaActiva, onNavegar }) {
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
        <button
          className="encabezado__marca"
          type="button"
          onClick={() => onNavegar('inicio')}
          aria-label="Clínica San Gabriel, ir al inicio"
        >
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
        </button>

        <nav className="encabezado__navegacion" aria-label="Navegación principal">
          {enlaces.map((enlace) => {
            const activo = paginaActiva === enlace.id

            return (
              <button
                key={enlace.id}
                type="button"
                className={`encabezado__enlace${activo ? ' encabezado__enlace--activo' : ''}`}
                aria-current={activo ? 'page' : undefined}
                disabled={enlace.deshabilitado}
                title={
                  enlace.deshabilitado
                    ? 'La reserva de citas se habilita en el Paso 4'
                    : undefined
                }
                onClick={() => onNavegar(enlace.id)}
              >
                {enlace.texto}
              </button>
            )
          })}
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
