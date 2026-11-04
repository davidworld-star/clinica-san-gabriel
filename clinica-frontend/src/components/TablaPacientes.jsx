import { useRef, useState } from 'react'
import { Trash2, Users } from 'lucide-react'

import Boton from './Boton'
import { eliminarPaciente } from '../services/api'
import './TablaPacientes.css'

function formatearFecha(fecha) {
  if (!fecha) {
    return '—'
  }

  return new Intl.DateTimeFormat('es-PE', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${fecha}T00:00:00`))
}

function TablaPacientes({ pacientes, onPacienteEliminado }) {
  const dialogoRef = useRef(null)
  const [pacienteSeleccionado, setPacienteSeleccionado] = useState(null)
  const [error, setError] = useState('')
  const [eliminando, setEliminando] = useState(false)

  const abrirConfirmacion = (paciente) => {
    setPacienteSeleccionado(paciente)
    setError('')
    dialogoRef.current?.showModal()
  }

  const cerrarConfirmacion = () => {
    dialogoRef.current?.close()
    setPacienteSeleccionado(null)
    setError('')
  }

  const confirmarEliminacion = async () => {
    if (!pacienteSeleccionado) {
      return
    }

    setEliminando(true)
    setError('')

    try {
      await eliminarPaciente(pacienteSeleccionado.id)
      onPacienteEliminado(pacienteSeleccionado.id)
      cerrarConfirmacion()
    } catch (errorEliminar) {
      setError(errorEliminar.message)
    } finally {
      setEliminando(false)
    }
  }

  return (
    <div className="tabla-pacientes">
      {pacientes.length === 0 ? (
        <div className="tabla-pacientes__vacio">
          <Users size={28} aria-hidden="true" />
          <strong>No se encontraron pacientes</strong>
          <p>Prueba con otro nombre o DNI, o registra un paciente nuevo.</p>
        </div>
      ) : (
        <div className="tabla-pacientes__scroll">
          <table>
            <thead>
              <tr>
                <th scope="col">DNI</th>
                <th scope="col">Paciente</th>
                <th scope="col">Nacimiento</th>
                <th scope="col">Contacto</th>
                <th scope="col" className="tabla-pacientes__acciones-col">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {pacientes.map((paciente) => (
                <tr key={paciente.id}>
                  <td className="tabla-pacientes__dni">{paciente.dni}</td>
                  <td>
                    <strong>{paciente.nombres}</strong>
                  </td>
                  <td>{formatearFecha(paciente.fecha_nacimiento)}</td>
                  <td>
                    <span className="tabla-pacientes__contacto">
                      {paciente.telefono || 'Sin teléfono'}
                    </span>
                    <span className="tabla-pacientes__contacto">
                      {paciente.correo || 'Sin correo'}
                    </span>
                  </td>
                  <td className="tabla-pacientes__acciones-col">
                    <Boton
                      variante="secundario"
                      className="tabla-pacientes__boton-eliminar"
                      onClick={() => abrirConfirmacion(paciente)}
                    >
                      <Trash2 size={15} aria-hidden="true" />
                      Eliminar
                    </Boton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <dialog
        ref={dialogoRef}
        className="dialogo-eliminar"
        aria-labelledby="titulo-eliminar-paciente"
        onCancel={cerrarConfirmacion}
      >
        <h2 id="titulo-eliminar-paciente">Eliminar paciente</h2>
        <p>
          ¿Seguro que deseas eliminar a{' '}
          <strong>{pacienteSeleccionado?.nombres}</strong>? Esta acción no se
          puede deshacer.
        </p>

        {error && (
          <p className="dialogo-eliminar__error" role="alert">
            {error}
          </p>
        )}

        <div className="dialogo-eliminar__acciones">
          <Boton variante="secundario" onClick={cerrarConfirmacion}>
            Cancelar
          </Boton>
          <Boton
            variante="peligro"
            onClick={confirmarEliminacion}
            disabled={eliminando}
          >
            {eliminando ? 'Eliminando…' : 'Sí, eliminar'}
          </Boton>
        </div>
      </dialog>
    </div>
  )
}

export default TablaPacientes
