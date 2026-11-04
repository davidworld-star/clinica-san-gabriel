const API_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:8000/api/'
).replace(/\/?$/, '/')

function extraerMensaje(payload, response) {
  if (typeof payload === 'string' && payload.trim()) {
    return payload
  }

  if (payload && typeof payload === 'object') {
    if (payload.detail) {
      return payload.detail
    }

    if (Array.isArray(payload.non_field_errors)) {
      return payload.non_field_errors.join(' ')
    }

    const primerError = Object.values(payload).find(
      (valor) => Array.isArray(valor) && valor.length > 0,
    )

    if (primerError) {
      return primerError.join(' ')
    }

    if (Array.isArray(payload) && payload.length > 0) {
      return payload.join(' ')
    }
  }

  return `La solicitud falló con el código ${response.status}.`
}

async function request(ruta, opciones = {}) {
  const { headers, ...resto } = opciones
  const configuracion = {
    ...resto,
    headers: {
      ...(resto.body ? { 'Content-Type': 'application/json' } : {}),
      ...headers,
    },
  }

  let respuesta

  try {
    respuesta = await fetch(`${API_URL}${ruta.replace(/^\//, '')}`, configuracion)
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new Error(
      'No se pudo conectar con el servidor. Verifica que Django esté activo.',
      { cause: error },
    )
  }

  const texto = await respuesta.text()
  let payload = null

  if (texto) {
    try {
      payload = JSON.parse(texto)
    } catch {
      payload = texto
    }
  }

  if (!respuesta.ok) {
    throw new Error(extraerMensaje(payload, respuesta))
  }

  return payload
}

export function getEspecialidades(signal) {
  return request('especialidades/', { signal })
}

export function getMedicos(especialidadId, signal) {
  const consulta = especialidadId ? `?especialidad=${especialidadId}` : ''
  return request(`medicos/${consulta}`, { signal })
}

export function getPacientes(signal) {
  return request('pacientes/', { signal })
}

export function crearPaciente(paciente) {
  return request('pacientes/', {
    method: 'POST',
    body: JSON.stringify(paciente),
  })
}

export function eliminarPaciente(id) {
  return request(`pacientes/${id}/`, {
    method: 'DELETE',
  })
}

export function getCitas(fecha, signal) {
  const consulta = fecha ? `?fecha=${encodeURIComponent(fecha)}` : ''
  return request(`citas/${consulta}`, { signal })
}

export function crearCita(cita) {
  return request('citas/', {
    method: 'POST',
    body: JSON.stringify(cita),
  })
}

export function actualizarCita(id, datos) {
  return request(`citas/${id}/`, {
    method: 'PATCH',
    body: JSON.stringify(datos),
  })
}

export function getEstados(signal) {
  return request('estados/', { signal })
}
