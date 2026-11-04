import { ArrowUpRight, Stethoscope } from 'lucide-react'

import './TarjetaEspecialidad.css'

function TarjetaEspecialidad({ nombre, descripcion, Icono = Stethoscope }) {
  return (
    <article className="tarjeta-especialidad">
      <div className="tarjeta-especialidad__cabecera">
        <span className="tarjeta-especialidad__icono" aria-hidden="true">
          <Icono size={24} strokeWidth={1.8} />
        </span>
        <ArrowUpRight
          className="tarjeta-especialidad__flecha"
          size={20}
          aria-hidden="true"
        />
      </div>

      <div className="tarjeta-especialidad__texto">
        <h3>{nombre}</h3>
        <p>{descripcion || 'Atención médica especializada para toda la familia.'}</p>
      </div>

      <span className="tarjeta-especialidad__detalle">Atención programada</span>
    </article>
  )
}

export default TarjetaEspecialidad
