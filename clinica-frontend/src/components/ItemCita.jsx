import { CalendarDays, Clock } from 'lucide-react'

import Boton from './Boton'
import './ItemCita.css'

function formatearFecha(fecha) {
  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
  }).format(new Date(`${fecha}T00:00:00`))
}

function ItemCita({ cita, seleccionada, onSeleccionar }) {
  return (
    <article className={`item-cita${seleccionada ? ' item-cita--seleccionada' : ''}`}>
      <div className="item-cita__fecha">
        <CalendarDays size={16} aria-hidden="true" />
        <strong>{formatearFecha(cita.fecha)}</strong>
        <span>
          <Clock size={14} aria-hidden="true" />
          {cita.hora.slice(0, 5)}
        </span>
      </div>

      <div className="item-cita__datos">
        <h3>{cita.paciente_nombre}</h3>
        <p>
          {cita.medico_nombre} · {cita.especialidad}
        </p>
        <span className={`badge-estado badge-estado--${cita.estado_nombre}`}>
          {cita.estado_nombre}
        </span>
      </div>

      <Boton
        variante={seleccionada ? 'primario' : 'secundario'}
        onClick={() => onSeleccionar(cita.id)}
      >
        Ver detalle
      </Boton>
    </article>
  )
}

export default ItemCita
