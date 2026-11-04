import './ResumenCitas.css'

function ResumenCitas({ citas, estados }) {
  return (
    <section className="resumen-citas" aria-label="Resumen de citas por estado">
      <div className="resumen-citas__grid">
        {estados.map((estado) => {
          const total = citas.filter((cita) => cita.estado === estado.id).length

          return (
            <article
              key={estado.id}
              className={`resumen-citas__tarjeta resumen-citas__tarjeta--${estado.nombre}`}
            >
              <span>{estado.nombre}</span>
              <strong>{total}</strong>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default ResumenCitas
