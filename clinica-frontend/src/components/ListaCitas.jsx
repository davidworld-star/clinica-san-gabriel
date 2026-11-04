import ItemCita from './ItemCita'
import './ListaCitas.css'

function ListaCitas({ citas, citaSeleccionadaId, onSeleccionar }) {
  const citasOrdenadas = [...citas].sort((a, b) =>
    `${a.fecha}T${a.hora}`.localeCompare(`${b.fecha}T${b.hora}`),
  )

  if (citasOrdenadas.length === 0) {
    return (
      <div className="lista-citas__vacio">
        <strong>No hay citas registradas</strong>
        <p>Registra la primera cita usando el formulario.</p>
      </div>
    )
  }

  return (
    <div className="lista-citas">
      {citasOrdenadas.map((cita) => (
        <ItemCita
          key={cita.id}
          cita={cita}
          seleccionada={citaSeleccionadaId === cita.id}
          onSeleccionar={onSeleccionar}
        />
      ))}
    </div>
  )
}

export default ListaCitas
