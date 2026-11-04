import { Search } from 'lucide-react'

import Boton from './Boton'
import './BuscadorPacientes.css'

function BuscadorPacientes({ valor, onCambio, onLimpiar }) {
  return (
    <div className="buscador-pacientes">
      <label className="sr-only" htmlFor="buscar-paciente">
        Buscar paciente por nombre o DNI
      </label>
      <div className="buscador-pacientes__campo">
        <Search size={17} aria-hidden="true" />
        <input
          id="buscar-paciente"
          type="search"
          value={valor}
          onChange={(event) => onCambio(event.target.value)}
          placeholder="Buscar por nombre o DNI"
        />
      </div>
      <Boton variante="secundario" onClick={onLimpiar} disabled={!valor}>
        Limpiar
      </Boton>
    </div>
  )
}

export default BuscadorPacientes
