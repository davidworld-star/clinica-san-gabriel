import './FiltroEspecialidad.css'

function FiltroEspecialidad({ especialidades, valor, onCambio }) {
  return (
    <div className="filtro-especialidad">
      <label htmlFor="filtro-especialidad">Especialidad</label>
      <select
        id="filtro-especialidad"
        value={valor}
        onChange={(event) => onCambio(event.target.value)}
      >
        <option value="">Todas las especialidades</option>
        {especialidades.map((especialidad) => (
          <option key={especialidad.id} value={String(especialidad.id)}>
            {especialidad.nombre}
          </option>
        ))}
      </select>
    </div>
  )
}

export default FiltroEspecialidad
