import { useEffect, useState } from 'react'
import { AlertCircle, RefreshCw, Stethoscope } from 'lucide-react'

import Boton from '../components/Boton'
import FiltroEspecialidad from '../components/FiltroEspecialidad'
import TarjetaMedico from '../components/TarjetaMedico'
import { getEspecialidades, getMedicos } from '../services/api'
import '../styles/paginas.css'
import './MedicosPage.css'

function MedicosPage() {
  const [especialidades, setEspecialidades] = useState([])
  const [especialidadId, setEspecialidadId] = useState('')
  const [medicos, setMedicos] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let activo = true

    getEspecialidades(controller.signal)
      .then((datos) => {
        if (activo) {
          setEspecialidades(datos)
        }
      })
      .catch((errorCarga) => {
        if (activo && errorCarga.name !== 'AbortError') {
          setError(errorCarga.message)
        }
      })

    return () => {
      activo = false
      controller.abort()
    }
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    let activo = true

    getMedicos(especialidadId || undefined, controller.signal)
      .then((datos) => {
        if (activo) {
          setMedicos(datos)
        }
      })
      .catch((errorCarga) => {
        if (activo && errorCarga.name !== 'AbortError') {
          setError(errorCarga.message)
        }
      })
      .finally(() => {
        if (activo) {
          setCargando(false)
        }
      })

    return () => {
      activo = false
      controller.abort()
    }
  }, [especialidadId, recarga])

  const cambiarEspecialidad = (valor) => {
    setEspecialidadId(valor)
    setCargando(true)
    setError('')
  }

  const reintentar = () => {
    setCargando(true)
    setError('')
    setRecarga((valor) => valor + 1)
  }

  return (
    <section className="pagina" aria-labelledby="titulo-medicos">
      <header className="pagina__cabecera">
        <div>
          <span className="pagina__etiqueta">Directorio médico</span>
          <h1 id="titulo-medicos">Médicos</h1>
          <p>Consulta los especialistas disponibles y filtra por especialidad.</p>
        </div>
        {!cargando && !error && (
          <span className="pagina__contador">
            Mostrando {medicos.length} {medicos.length === 1 ? 'médico' : 'médicos'}
          </span>
        )}
      </header>

      <section className="panel medicos__filtro" aria-label="Filtro de médicos">
        <div className="panel__cuerpo">
          <FiltroEspecialidad
            especialidades={especialidades}
            valor={especialidadId}
            onCambio={cambiarEspecialidad}
          />
        </div>
      </section>

      {cargando && (
        <div className="estado-pagina" role="status" aria-live="polite">
          <span className="cargador-pagina" aria-hidden="true" />
          <strong>Cargando médicos…</strong>
        </div>
      )}

      {!cargando && error && (
        <div className="estado-pagina estado-pagina--error" role="alert">
          <span className="estado-pagina__icono" aria-hidden="true">
            <AlertCircle size={20} />
          </span>
          <div className="estado-pagina__texto">
            <strong>No pudimos cargar los médicos</strong>
            <p>{error}</p>
          </div>
          <Boton variante="secundario" onClick={reintentar}>
            <RefreshCw size={16} aria-hidden="true" />
            Reintentar
          </Boton>
        </div>
      )}

      {!cargando && !error && medicos.length === 0 && (
        <div className="estado-pagina">
          <span className="estado-pagina__icono" aria-hidden="true">
            <Stethoscope size={20} />
          </span>
          <div className="estado-pagina__texto">
            <strong>No hay médicos en esta especialidad</strong>
            <p>Selecciona otra especialidad o elige «Todas las especialidades».</p>
          </div>
        </div>
      )}

      {!cargando && !error && medicos.length > 0 && (
        <div className="medicos__grid">
          {medicos.map((medico) => (
            <TarjetaMedico
              key={medico.id}
              nombres={medico.nombres}
              cmp={medico.cmp}
              especialidad={medico.especialidad_nombre}
              foto={medico.foto}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default MedicosPage
