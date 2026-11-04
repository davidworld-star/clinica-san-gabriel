import { useContext } from 'react'
import { CalendarDays, UserRound } from 'lucide-react'

import logoClinica from '../assets/logo-clinica.svg'
import { ClinicaContext } from '../context/ClinicaContext.jsx'
import './Encabezado.css'

const enlaces = [
  { id: 'inicio', texto: 'Inicio' },
  { id: 'pacientes', texto: 'Pacientes' },
  { id: 'medicos', texto: 'Médicos' },
  { id: 'citas', texto: 'Citas' },
]

function Encabezado({ paginaActiva, onNavegar }) {
  const {
    recepcionistas,
    recepcionistaActiva,
    fechaTrabajo,
    cambiarRecepcionista,
    cambiarFechaTrabajo,
  } = useContext(ClinicaContext)

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
                onClick={() => onNavegar(enlace.id)}
              >
                {enlace.texto}
              </button>
            )
          })}
        </nav>

        <div className="encabezado__contexto">
          <label className="encabezado__control">
            <UserRound size={17} aria-hidden="true" />
            <span className="sr-only">Recepcionista activa</span>
            <select
              value={recepcionistaActiva.id}
              onChange={(event) => cambiarRecepcionista(event.target.value)}
            >
              {recepcionistas.map((persona) => (
                <option key={persona.id} value={persona.id}>
                  {persona.nombre}
                </option>
              ))}
            </select>
          </label>

          <label className="encabezado__control">
            <CalendarDays size={17} aria-hidden="true" />
            <span className="sr-only">Fecha de trabajo</span>
            <input
              type="date"
              value={fechaTrabajo}
              onChange={(event) => cambiarFechaTrabajo(event.target.value)}
            />
          </label>
        </div>
      </div>
    </header>
  )
}

export default Encabezado
