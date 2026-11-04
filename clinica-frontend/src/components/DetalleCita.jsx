import { useState } from 'react'
import { CalendarCheck } from 'lucide-react'

import Boton from './Boton'
import { actualizarCita } from '../services/api'
import './DetalleCita.css'

function DetalleCita({ cita, estados, onCambiarEstado }) {
  const [guardando, setGuardando] = useState('')
  const [error, setError] = useState('')

  if (!cita) {
    return (
      <section className="detalle-cita detalle-cita--vacio" aria-label="Detalle de cita">
        <span className="detalle-cita__icono" aria-hidden="true">
          <CalendarCheck size={24} />
        </span>
        <strong>Selecciona una cita</strong>
        <p>Haz clic en «Ver detalle» para consultar su información.</p>
      </section>
    )
  }

  const idEstado = (nombre) =>
    estados.find((estado) => estado.nombre === nombre)?.id

  const cambiarEstado = async (nombre) => {
    const estadoId = idEstado(nombre)

    if (!estadoId) {
      setError('No se encontró el estado solicitado.')
      return
    }

    setGuardando(nombre)
    setError('')

    try {
      const citaActualizada = await actualizarCita(cita.id, { estado: estadoId })
      onCambiarEstado(citaActualizada)
    } catch (errorActualizar) {
      setError(errorActualizar.message)
    } finally {
      setGuardando('')
    }
  }

  const esFinal = cita.estado_es_final

  return (
    <section className="detalle-cita" aria-labelledby="titulo-detalle-cita">
      <header className="detalle-cita__cabecera">
        <div>
          <span className="detalle-cita__etiqueta">Cita seleccionada</span>
          <h2 id="titulo-detalle-cita">Detalle de la cita</h2>
        </div>
        <span className={`badge-estado badge-estado--${cita.estado_nombre}`}>
          {cita.estado_nombre}
        </span>
      </header>

      <dl className="detalle-cita__datos">
        <div>
          <dt>Paciente</dt>
          <dd>{cita.paciente_nombre}</dd>
        </div>
        <div>
          <dt>Médico</dt>
          <dd>{cita.medico_nombre}</dd>
        </div>
        <div>
          <dt>Especialidad</dt>
          <dd>{cita.especialidad}</dd>
        </div>
        <div>
          <dt>Fecha y hora</dt>
          <dd>
            {cita.fecha} · {cita.hora.slice(0, 5)}
          </dd>
        </div>
        <div className="detalle-cita__motivo">
          <dt>Motivo</dt>
          <dd>{cita.motivo}</dd>
        </div>
      </dl>

      {esFinal && (
        <p className="detalle-cita__aviso">
          Esta cita está en un estado final y ya no se puede modificar.
        </p>
      )}

      <div className="detalle-cita__acciones">
        <Boton
          variante="primario"
          onClick={() => cambiarEstado('confirmada')}
          disabled={
            esFinal ||
            Boolean(guardando) ||
            cita.estado_nombre === 'confirmada' ||
            !idEstado('confirmada')
          }
        >
          {guardando === 'confirmada' ? 'Guardando…' : 'Confirmar'}
        </Boton>
        <Boton
          variante="secundario"
          onClick={() => cambiarEstado('atendida')}
          disabled={esFinal || Boolean(guardando) || !idEstado('atendida')}
        >
          {guardando === 'atendida' ? 'Guardando…' : 'Marcar como atendida'}
        </Boton>
        <Boton
          variante="peligro"
          onClick={() => cambiarEstado('cancelada')}
          disabled={esFinal || Boolean(guardando) || !idEstado('cancelada')}
        >
          {guardando === 'cancelada' ? 'Guardando…' : 'Cancelar'}
        </Boton>
      </div>

      {error && (
        <p className="detalle-cita__error" role="alert">
          {error}
        </p>
      )}
    </section>
  )
}

export default DetalleCita
