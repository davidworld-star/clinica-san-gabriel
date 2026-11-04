import { useContext, useEffect, useState } from 'react'
import { AlertCircle, RefreshCw } from 'lucide-react'

import Boton from '../components/Boton'
import DetalleCita from '../components/DetalleCita'
import FormularioCita from '../components/FormularioCita'
import ListaCitas from '../components/ListaCitas'
import ResumenCitas from '../components/ResumenCitas'
import { ClinicaContext } from '../context/ClinicaContext.jsx'
import {
  getCitas,
  getEstados,
  getMedicos,
  getPacientes,
} from '../services/api'
import '../styles/paginas.css'
import './PaginaCitas.css'

function PaginaCitas() {
  const { fechaTrabajo } = useContext(ClinicaContext)
  const [citas, setCitas] = useState([])
  const [medicos, setMedicos] = useState([])
  const [pacientes, setPacientes] = useState([])
  const [estados, setEstados] = useState([])
  const [citaSeleccionadaId, setCitaSeleccionadaId] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [recarga, setRecarga] = useState(0)

  useEffect(() => {
    const controller = new AbortController()
    let activo = true

    Promise.all([
      getCitas(undefined, controller.signal),
      getMedicos(undefined, controller.signal),
      getPacientes(controller.signal),
      getEstados(controller.signal),
    ])
      .then(([citasData, medicosData, pacientesData, estadosData]) => {
        if (activo) {
          setCitas(citasData)
          setMedicos(medicosData)
          setPacientes(pacientesData)
          setEstados(estadosData)
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

  const agregarCita = (cita) => {
    setCitas((anteriores) => [cita, ...anteriores])
    setCitaSeleccionadaId(cita.id)
  }

  const reemplazarCita = (citaActualizada) => {
    setCitas((anteriores) =>
      anteriores.map((cita) =>
        cita.id === citaActualizada.id ? citaActualizada : cita,
      ),
    )
  }

  const citaSeleccionada = citas.find((cita) => cita.id === citaSeleccionadaId)

  return (
    <section className="pagina" aria-labelledby="titulo-citas">
      <header className="pagina__cabecera">
        <div>
          <span className="pagina__etiqueta">Recepción</span>
          <h1 id="titulo-citas">Reserva de citas</h1>
          <p>Registra citas, revisa su detalle y actualiza su estado.</p>
        </div>
        <span className="pagina__contador">{citas.length} citas</span>
      </header>

      {cargando && (
        <div className="estado-pagina" role="status" aria-live="polite">
          <span className="cargador-pagina" aria-hidden="true" />
          <strong>Cargando citas…</strong>
        </div>
      )}

      {!cargando && error && (
        <div className="estado-pagina estado-pagina--error" role="alert">
          <span className="estado-pagina__icono" aria-hidden="true">
            <AlertCircle size={20} />
          </span>
          <div className="estado-pagina__texto">
            <strong>No pudimos cargar la información de citas</strong>
            <p>{error}</p>
          </div>
          <Boton variante="secundario" onClick={reintentar}>
            <RefreshCw size={16} aria-hidden="true" />
            Reintentar
          </Boton>
        </div>
      )}

      {!cargando && !error && (
        <>
          <ResumenCitas citas={citas} estados={estados} />

          <div className="citas__columnas">
            <FormularioCita
              key={fechaTrabajo}
              pacientes={pacientes}
              medicos={medicos}
              onCitaCreada={agregarCita}
            />

            <div className="citas__derecha">
              <section className="panel" aria-labelledby="titulo-lista-citas">
                <div className="panel__cabecera">
                  <h2 id="titulo-lista-citas">Citas registradas</h2>
                  <span className="citas__orden">Ordenadas por fecha y hora</span>
                </div>
                <ListaCitas
                  citas={citas}
                  citaSeleccionadaId={citaSeleccionadaId}
                  onSeleccionar={setCitaSeleccionadaId}
                />
              </section>

              <DetalleCita
                cita={citaSeleccionada}
                estados={estados}
                onCambiarEstado={reemplazarCita}
              />
            </div>
          </div>
        </>
      )}
    </section>
  )
}

export default PaginaCitas
