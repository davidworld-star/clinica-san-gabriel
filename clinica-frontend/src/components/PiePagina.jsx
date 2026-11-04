import { HeartPulse, MapPin, Phone } from 'lucide-react'

import './PiePagina.css'

function PiePagina() {
  const anio = new Date().getFullYear()

  return (
    <footer className="pie">
      <div className="contenedor pie__contenido">
        <div className="pie__marca">
          <span className="pie__icono" aria-hidden="true">
            <HeartPulse size={20} />
          </span>
          <div>
            <strong>Clínica San Gabriel</strong>
            <p>Desarrollo de Aplicaciones Empresariales · {anio}</p>
          </div>
        </div>

        <div className="pie__datos">
          <span>
            <MapPin size={16} aria-hidden="true" />
            Av. Los Álamos 245, Lima
          </span>
          <span>
            <Phone size={16} aria-hidden="true" />
            +51 1 555 0123
          </span>
        </div>
      </div>
    </footer>
  )
}

export default PiePagina
