import './Boton.css'

function Boton({
  texto,
  variante = 'primario',
  onClick,
  children,
  disabled = false,
  type = 'button',
  ...props
}) {
  return (
    <button
      className={`boton boton--${variante}`}
      type={type}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children || texto}
    </button>
  )
}

export default Boton
