import { useEffect, useState } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

import Boton from '../components/Boton'
import BuscadorPacientes from '../components/BuscadorPacientes'
import FormularioPaciente from '../components/FormularioPaciente'
import TablaPacientes from '../components/TablaPacientes'
import { getPacientes } from '../services/api'
import '../styles/paginas.css'

function normalizar(texto) {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
}

function PacientesPage() {
  const [pacientes, setPacientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [recarga, setRecarga] = useState(0)
  const [busqueda, setBusqueda] = useState('')

  useEffect(() => {
    const controller = new AbortController()
    let activo = true

    getPacientes(controller.signal)
      .then((datos) => {
        if (activo) {
          setPacientes(datos)
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
  }, [recarga])

  const reintentar = () => {
    setCargando(true)
    setError('')
    setRecarga((valor) => valor + 1)
  }

  const agregarPaciente = (paciente) => {
    setPacientes((anteriores) => [paciente, ...anteriores])
  }

  const quitarPaciente = (id) => {
    setPacientes((anteriores) => anteriores.filter((paciente) => paciente.id !== id))
  }

  const termino = normalizar(busqueda.trim())
  const pacientesFiltrados = pacientes.filter((paciente) => {
    if (!termino) {
      return true
    }

    return (
      normalizar(paciente.nombres).includes(termino) ||
      paciente.dni.includes(busqueda.trim())
    )
  })

  return (
    <section className="pagina" aria-labelledby="titulo-pacientes">
      <header className="pagina__cabecera">
        <div>
          <span className="pagina__etiqueta">Gestión de pacientes</span>
          <h1 id="titulo-pacientes">Pacientes</h1>
          <p>Registra, busca y elimina pacientes de la clínica.</p>
        </div>
        <span className="pagina__contador">
          {pacientes.length} {pacientes.length === 1 ? 'registrado' : 'registrados'}
        </span>
      </header>

      <div className="pagina__columnas">
        <FormularioPaciente onPacienteCreado={agregarPaciente} />

        <section className="panel" aria-labelledby="titulo-lista-pacientes">
          <div className="panel__cabecera">
            <h2 id="titulo-lista-pacientes">Listado de pacientes</h2>
            <BuscadorPacientes
              valor={busqueda}
              onCambio={setBusqueda}
              onLimpiar={() => setBusqueda('')}
            />
          </div>

          {cargando && (
            <div className="estado-pagina" role="status" aria-live="polite">
              <span className="cargador-pagina" aria-hidden="true" />
              <strong>Cargando pacientes…</strong>
            </div>
          )}

          {!cargando && error && (
            <div className="estado-pagina estado-pagina--error" role="alert">
              <span className="estado-pagina__icono" aria-hidden="true">
                <AlertCircle size={20} />
              </span>
              <div className="estado-pagina__texto">
                <strong>No pudimos cargar los pacientes</strong>
                <p>{error}</p>
              </div>
              <Boton variante="secundario" onClick={reintentar}>
                <RefreshCw size={16} aria-hidden="true" />
                Reintentar
              </Boton>
            </div>
          )}

          {!cargando && !error && (
            <TablaPacientes
              pacientes={pacientesFiltrados}
              onPacienteEliminado={quitarPaciente}
            />
          )}
        </section>
      </div>
    </section>
  )
}

export default PacientesPage
