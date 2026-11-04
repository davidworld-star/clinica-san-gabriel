import { createContext, useMemo, useState } from 'react'

const RECEPCIONISTAS = [
  { id: 'rosa', nombre: 'Rosa Herrera', turno: 'Mañana' },
  { id: 'luis', nombre: 'Luis Paredes', turno: 'Tarde' },
  { id: 'carla', nombre: 'Carla Mendoza', turno: 'Noche' },
]

function fechaLocalISO() {
  const hoy = new Date()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  return `${hoy.getFullYear()}-${mes}-${dia}`
}

// El contexto se exporta junto al provider para que Encabezado y
// FormularioCita puedan leerlo directamente con useContext.
// eslint-disable-next-line react-refresh/only-export-components
export const ClinicaContext = createContext(null)

export function ClinicaProvider({ children }) {
  const [recepcionistaActiva, setRecepcionistaActiva] = useState(RECEPCIONISTAS[0])
  const [fechaTrabajo, setFechaTrabajo] = useState(fechaLocalISO)

  const valor = useMemo(
    () => ({
      recepcionistas: RECEPCIONISTAS,
      recepcionistaActiva,
      fechaTrabajo,
      cambiarRecepcionista: (id) => {
        const recepcionista = RECEPCIONISTAS.find((persona) => persona.id === id)
        if (recepcionista) {
          setRecepcionistaActiva(recepcionista)
        }
      },
      cambiarFechaTrabajo: setFechaTrabajo,
    }),
    [recepcionistaActiva, fechaTrabajo],
  )

  return <ClinicaContext value={valor}>{children}</ClinicaContext>
}
