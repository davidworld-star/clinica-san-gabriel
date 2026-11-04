import { useContext, useState } from 'react'
import { UserRound } from 'lucide-react'

import Boton from './Boton'
import { ClinicaContext } from '../context/ClinicaContext.jsx'
import { crearCita } from '../services/api'
import './FormularioCita.css'

function FormularioCita({ pacientes, medicos, onCitaCreada }) {
  const { recepcionistaActiva, fechaTrabajo } = useContext(ClinicaContext)
  const [formulario, setFormulario] = useState({
    paciente: '',
    medico: '',
    fecha: fechaTrabajo,
    hora: '',
    motivo: '',
  })
  const [error, setError] = useState('')
  const [exito, setExito] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormulario((anterior) => ({ ...anterior, [name]: value }))
    setError('')
    setExito('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setExito('')

    if (
      !formulario.paciente ||
      !formulario.medico ||
      !formulario.fecha ||
      !formulario.hora ||
      !formulario.motivo.trim()
    ) {
      setError('Completa paciente, médico, fecha, hora y motivo.')
      return
    }

    setEnviando(true)

    try {
      const citaCreada = await crearCita({
        paciente: Number(formulario.paciente),
        medico: Number(formulario.medico),
        fecha: formulario.fecha,
        hora: formulario.hora,
        motivo: formulario.motivo.trim(),
      })

      onCitaCreada(citaCreada)
      setFormulario({
        paciente: '',
        medico: '',
        fecha: fechaTrabajo,
        hora: '',
        motivo: '',
      })
      setExito('Cita registrada correctamente.')
    } catch (errorCrear) {
      setError(errorCrear.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario-cita" onSubmit={handleSubmit} noValidate>
      <div className="formulario-cita__cabecera">
        <h2>Nueva cita</h2>
        <p>
          <UserRound size={14} aria-hidden="true" />
          Registra: {recepcionistaActiva.nombre}
        </p>
      </div>

      {error && (
        <p className="formulario-cita__alerta" role="alert">
          {error}
        </p>
      )}

      {exito && (
        <p className="formulario-cita__exito" role="status">
          {exito}
        </p>
      )}

      <div className="campo">
        <label htmlFor="cita-paciente">Paciente</label>
        <select
          id="cita-paciente"
          name="paciente"
          value={formulario.paciente}
          onChange={handleChange}
        >
          <option value="">Selecciona un paciente</option>
          {pacientes.map((paciente) => (
            <option key={paciente.id} value={String(paciente.id)}>
              {paciente.nombres} — {paciente.dni}
            </option>
          ))}
        </select>
      </div>

      <div className="campo">
        <label htmlFor="cita-medico">Médico</label>
        <select
          id="cita-medico"
          name="medico"
          value={formulario.medico}
          onChange={handleChange}
        >
          <option value="">Selecciona un médico</option>
          {medicos.map((medico) => (
            <option key={medico.id} value={String(medico.id)}>
              {medico.nombres} — {medico.especialidad_nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="formulario-cita__fila">
        <div className="campo">
          <label htmlFor="cita-fecha">Fecha</label>
          <input
            id="cita-fecha"
            name="fecha"
            type="date"
            value={formulario.fecha}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="cita-hora">Hora</label>
          <input
            id="cita-hora"
            name="hora"
            type="time"
            value={formulario.hora}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="campo">
        <label htmlFor="cita-motivo">Motivo</label>
        <textarea
          id="cita-motivo"
          name="motivo"
          rows="3"
          value={formulario.motivo}
          onChange={handleChange}
          placeholder="Describe el motivo de la consulta"
        />
      </div>

      <Boton type="submit" disabled={enviando}>
        {enviando ? 'Registrando…' : 'Registrar cita'}
      </Boton>
    </form>
  )
}

export default FormularioCita
