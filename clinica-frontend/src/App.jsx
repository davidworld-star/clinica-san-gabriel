import { useEffect, useState } from 'react'
import {
  Activity,
  AlertCircle,
  Baby,
  CalendarCheck,
  HeartPulse,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from 'lucide-react'

import Boton from './components/Boton'
import Encabezado from './components/Encabezado'
import PiePagina from './components/PiePagina'
import TarjetaEspecialidad from './components/TarjetaEspecialidad'
import MedicosPage from './pages/MedicosPage'
import PacientesPage from './pages/PacientesPage'
import { getEspecialidades } from './services/api'
import './App.css'

const iconosPorEspecialidad = {
  Pediatría: Baby,
  Cardiología: HeartPulse,
  Dermatología: Sparkles,
  'Medicina General': Stethoscope,
}

function App() {
  const [especialidades, setEspecialidades] = useState([])
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState('')
  const [intento, setIntento] = useState(0)
  const [paginaActiva, setPaginaActiva] = useState('inicio')

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
      .finally(() => {
        if (activo) {
          setCargando(false)
        }
      })

    return () => {
      activo = false
      controller.abort()
    }
  }, [intento])

  const reintentar = () => {
    setCargando(true)
    setError('')
    setIntento((valor) => valor + 1)
  }

  const totalEspecialidades = especialidades.length

  return (
    <div className="aplicacion">
      <Encabezado paginaActiva={paginaActiva} onNavegar={setPaginaActiva} />

      <main className="contenido">
        {paginaActiva === 'inicio' && (
          <>
            <section className="portada" aria-labelledby="titulo-principal">
              <div className="portada__texto">
                <span className="portada__etiqueta">
                  <ShieldCheck size={16} aria-hidden="true" />
                  Atención médica cercana
                </span>
                <h1 id="titulo-principal">
                  Tu salud,
                  <span className="portada__resaltado"> en buenas manos.</span>
                </h1>
                <p className="portada__descripcion">
                  Bienvenido a Clínica San Gabriel. Encuentra la especialidad que
                  necesitas y agenda tu atención con un equipo que te escucha.
                </p>

                <div className="portada__puntos">
                  <span>
                    <Activity size={18} aria-hidden="true" />
                    Atención por especialidad
                  </span>
                  <span>
                    <CalendarCheck size={18} aria-hidden="true" />
                    Citas programadas
                  </span>
                </div>
              </div>

              <aside className="portada__panel" aria-label="Información de atención">
                <div className="portada__panel-icono" aria-hidden="true">
                  <CalendarCheck size={26} />
                </div>
                <h2>Una atención sin prisas</h2>
                <p>
                  Reserva tu cita con anticipación y elige el especialista que
                  acompañará tu cuidado.
                </p>
                <div className="portada__panel-dato">
                  <span>Especialidades disponibles</span>
                  <strong>{cargando ? '—' : totalEspecialidades}</strong>
                </div>
                <div className="portada__panel-dato">
                  <span>Horario de atención</span>
                  <strong>Lun – Sáb</strong>
                </div>
              </aside>
            </section>

            <section className="especialidades" aria-labelledby="titulo-especialidades">
              <div className="especialidades__encabezado">
                <div>
                  <span className="especialidades__etiqueta">Directorio médico</span>
                  <h2 id="titulo-especialidades">Nuestras especialidades</h2>
                  <p>Explora las áreas de atención disponibles en la clínica.</p>
                </div>

                {!cargando && !error && totalEspecialidades > 0 && (
                  <span className="especialidades__contador">
                    {totalEspecialidades}{' '}
                    {totalEspecialidades === 1 ? 'especialidad' : 'especialidades'}
                  </span>
                )}
              </div>

              {cargando && (
                <div className="estado estado--cargando" role="status" aria-live="polite">
                  <span className="cargador" aria-hidden="true" />
                  <div>
                    <strong>Cargando especialidades…</strong>
                    <p>Estamos consultando la información de la clínica.</p>
                  </div>
                </div>
              )}

              {!cargando && error && (
                <div className="estado estado--error" role="alert">
                  <span className="estado__icono" aria-hidden="true">
                    <AlertCircle size={24} />
                  </span>
                  <div className="estado__texto">
                    <strong>No pudimos cargar las especialidades</strong>
                    <p>{error}</p>
                  </div>
                  <Boton variante="primario" onClick={reintentar}>
                    <RefreshCw size={17} aria-hidden="true" />
                    Reintentar
                  </Boton>
                </div>
              )}

              {!cargando && !error && totalEspecialidades === 0 && (
                <div className="estado estado--vacio" role="status">
                  <span className="estado__icono" aria-hidden="true">
                    <Stethoscope size={24} />
                  </span>
                  <div className="estado__texto">
                    <strong>Todavía no hay especialidades registradas</strong>
                    <p>Cuando la clínica registre sus especialidades, aparecerán aquí.</p>
                  </div>
                </div>
              )}

              {!cargando && !error && totalEspecialidades > 0 && (
                <div className="especialidades__grid">
                  {especialidades.map((especialidad) => {
                    const Icono =
                      iconosPorEspecialidad[especialidad.nombre] || Stethoscope

                    return (
                      <TarjetaEspecialidad
                        key={especialidad.id}
                        nombre={especialidad.nombre}
                        descripcion={especialidad.descripcion}
                        Icono={Icono}
                      />
                    )
                  })}
                </div>
              )}
            </section>
          </>
        )}

        {paginaActiva === 'pacientes' && <PacientesPage />}
        {paginaActiva === 'medicos' && <MedicosPage />}
      </main>

      <PiePagina />
    </div>
  )
}

export default App
