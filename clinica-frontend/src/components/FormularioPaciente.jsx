import { useState } from 'react'

import Boton from './Boton'
import { crearPaciente } from '../services/api'
import './FormularioPaciente.css'

const FORMULARIO_INICIAL = {
  dni: '',
  nombres: '',
  fecha_nacimiento: '',
  telefono: '',
  correo: '',
}

function fechaLocalISO() {
  const hoy = new Date()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${hoy.getFullYear()}-${mes}-${dia}`
}

function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function validar(formulario) {
  const errores = {}
  const hoy = fechaLocalISO()

  if (!/^\d{8}$/.test(formulario.dni)) {
    errores.dni = 'El DNI debe tener exactamente 8 dígitos.'
  }

  if (!formulario.nombres.trim()) {
    errores.nombres = 'Ingresa los nombres del paciente.'
  }

  if (!formulario.fecha_nacimiento) {
    errores.fecha_nacimiento = 'Selecciona la fecha de nacimiento.'
  } else if (formulario.fecha_nacimiento > hoy) {
    errores.fecha_nacimiento = 'La fecha de nacimiento no puede ser futura.'
  }

  if (!formulario.correo.trim()) {
    errores.correo = 'Ingresa el correo del paciente.'
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.correo)) {
    errores.correo = 'Ingresa un correo válido, por ejemplo nombre@correo.pe.'
  }

  return errores
}

function FormularioPaciente({ onPacienteCreado }) {
  const [formulario, setFormulario] = useState({ ...FORMULARIO_INICIAL })
  const [errores, setErrores] = useState({})
  const [mensajeError, setMensajeError] = useState('')
  const [mensajeExito, setMensajeExito] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormulario((anterior) => ({ ...anterior, [name]: value }))
    setErrores((anteriores) => {
      if (!anteriores[name]) {
        return anteriores
      }

      const siguientes = { ...anteriores }
      delete siguientes[name]
      return siguientes
    })
    setMensajeError('')
    setMensajeExito('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const erroresCliente = validar(formulario)

    if (Object.keys(erroresCliente).length > 0) {
      setErrores(erroresCliente)
      setMensajeExito('')
      return
    }

    setEnviando(true)
    setMensajeError('')
    setMensajeExito('')

    try {
      const pacienteCreado = await crearPaciente({
        ...formulario,
        dni: formulario.dni.trim(),
        nombres: formulario.nombres.trim(),
        telefono: formulario.telefono.trim(),
        correo: formulario.correo.trim(),
      })

      onPacienteCreado(pacienteCreado)
      setFormulario({ ...FORMULARIO_INICIAL })
      setErrores({})
      setMensajeExito('Paciente registrado correctamente.')
    } catch (error) {
      const texto = error.message
      const campo = ['dni', 'nombres', 'fecha_nacimiento', 'telefono', 'correo'].find(
        (nombreCampo) => normalizar(texto).includes(nombreCampo),
      )

      if (campo) {
        setErrores({ [campo]: texto })
      } else {
        setMensajeError(texto)
      }
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="formulario-paciente" onSubmit={handleSubmit} noValidate>
      <div className="formulario-paciente__cabecera">
        <h2>Nuevo paciente</h2>
        <p>Completa los datos para registrar al paciente.</p>
      </div>

      {mensajeError && (
        <p className="formulario-paciente__alerta" role="alert">
          {mensajeError}
        </p>
      )}

      {mensajeExito && (
        <p className="formulario-paciente__exito" role="status">
          {mensajeExito}
        </p>
      )}

      <div className="campo">
        <label htmlFor="dni">
          DNI <span aria-hidden="true">*</span>
        </label>
        <input
          id="dni"
          name="dni"
          type="text"
          inputMode="numeric"
          maxLength="8"
          autoComplete="off"
          value={formulario.dni}
          onChange={handleChange}
          aria-invalid={Boolean(errores.dni)}
          aria-describedby={errores.dni ? 'error-dni' : undefined}
          placeholder="8 dígitos"
        />
        {errores.dni && (
          <span className="campo__error" id="error-dni">
            {errores.dni}
          </span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="nombres">
          Nombres y apellidos <span aria-hidden="true">*</span>
        </label>
        <input
          id="nombres"
          name="nombres"
          type="text"
          autoComplete="name"
          value={formulario.nombres}
          onChange={handleChange}
          aria-invalid={Boolean(errores.nombres)}
          aria-describedby={errores.nombres ? 'error-nombres' : undefined}
          placeholder="Ej. Ana María Castillo Vega"
        />
        {errores.nombres && (
          <span className="campo__error" id="error-nombres">
            {errores.nombres}
          </span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="fecha_nacimiento">
          Fecha de nacimiento <span aria-hidden="true">*</span>
        </label>
        <input
          id="fecha_nacimiento"
          name="fecha_nacimiento"
          type="date"
          max={fechaLocalISO()}
          value={formulario.fecha_nacimiento}
          onChange={handleChange}
          aria-invalid={Boolean(errores.fecha_nacimiento)}
          aria-describedby={
            errores.fecha_nacimiento ? 'error-fecha_nacimiento' : undefined
          }
        />
        {errores.fecha_nacimiento && (
          <span className="campo__error" id="error-fecha_nacimiento">
            {errores.fecha_nacimiento}
          </span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="telefono">Teléfono</label>
        <input
          id="telefono"
          name="telefono"
          type="tel"
          autoComplete="tel"
          value={formulario.telefono}
          onChange={handleChange}
          aria-invalid={Boolean(errores.telefono)}
          aria-describedby={errores.telefono ? 'error-telefono' : undefined}
          placeholder="Ej. 987654321"
        />
        {errores.telefono && (
          <span className="campo__error" id="error-telefono">
            {errores.telefono}
          </span>
        )}
      </div>

      <div className="campo">
        <label htmlFor="correo">
          Correo <span aria-hidden="true">*</span>
        </label>
        <input
          id="correo"
          name="correo"
          type="email"
          autoComplete="email"
          value={formulario.correo}
          onChange={handleChange}
          aria-invalid={Boolean(errores.correo)}
          aria-describedby={errores.correo ? 'error-correo' : undefined}
          placeholder="nombre@correo.pe"
        />
        {errores.correo && (
          <span className="campo__error" id="error-correo">
            {errores.correo}
          </span>
        )}
      </div>

      <div className="formulario-paciente__acciones">
        <Boton type="submit" disabled={enviando}>
          {enviando ? 'Guardando…' : 'Registrar paciente'}
        </Boton>
      </div>
    </form>
  )
}

export default FormularioPaciente
