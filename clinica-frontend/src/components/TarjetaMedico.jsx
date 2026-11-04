import avatarMedico from '../assets/avatar-medico.svg'
import './TarjetaMedico.css'

function TarjetaMedico({ nombres, cmp, especialidad, foto }) {
  return (
    <article className="tarjeta-medico">
      <img
        className="tarjeta-medico__foto"
        src={foto || avatarMedico}
        alt={`Foto de ${nombres}`}
        width="88"
        height="88"
      />
      <div className="tarjeta-medico__datos">
        <h3>{nombres}</h3>
        <p className="tarjeta-medico__especialidad">{especialidad}</p>
        <span className="tarjeta-medico__cmp">{cmp}</span>
      </div>
    </article>
  )
}

export default TarjetaMedico
