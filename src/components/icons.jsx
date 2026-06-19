// Icones SVG inline (estilo feather), monocromaticos — herdam currentColor,
// entao pegam a cor do contexto (navy/ambar/verde) e tem tamanho consistente.
function Svg({ size = 18, fill = 'none', children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={fill}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const IconeBusca = (p) => (
  <Svg {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m21 21-4.3-4.3" />
  </Svg>
)
export const IconeCarrinho = (p) => (
  <Svg {...p}>
    <circle cx="9" cy="20" r="1.4" />
    <circle cx="19" cy="20" r="1.4" />
    <path d="M2 3h2.2l2.4 12.2a1.6 1.6 0 0 0 1.6 1.3h8.4a1.6 1.6 0 0 0 1.6-1.3L21 7H5.3" />
  </Svg>
)
export const IconeUsuario = (p) => (
  <Svg {...p}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </Svg>
)
export const IconePacote = (p) => (
  <Svg {...p}>
    <path d="M21 16V8a2 2 0 0 0-1-1.7l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.7l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <path d="m3.3 7 8.7 5 8.7-5" />
    <path d="M12 22V12" />
  </Svg>
)
export const IconeCaminhao = (p) => (
  <Svg {...p}>
    <path d="M10 17h4V5H2v12h3" />
    <path d="M20 17h2v-3.3a1 1 0 0 0-.3-.7l-2.6-2.6a1 1 0 0 0-.7-.3H14v7h2" />
    <circle cx="7.5" cy="17.5" r="1.6" />
    <circle cx="17.5" cy="17.5" r="1.6" />
  </Svg>
)
export const IconeCadeado = (p) => (
  <Svg {...p}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </Svg>
)
export const IconeEstrela = ({ size = 16, ...p }) => (
  <Svg size={size} fill="currentColor" stroke="none" {...p}>
    <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z" />
  </Svg>
)
export const IconeGrafico = (p) => (
  <Svg {...p}>
    <path d="M3 3v18h18" />
    <rect x="7" y="10" width="3" height="7" />
    <rect x="12" y="6" width="3" height="11" />
    <rect x="17" y="13" width="3" height="4" />
  </Svg>
)
export const IconeDevolucao = (p) => (
  <Svg {...p}>
    <path d="M3 7v6h6" />
    <path d="M3.5 13a9 9 0 1 0 2.6-7.4L3 8" />
  </Svg>
)
export const IconeEscudo = (p) => (
  <Svg {...p}>
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </Svg>
)
export const IconeRaio = (p) => (
  <Svg {...p}>
    <path d="M13 2 3 14h8l-1 8 10-12h-8z" />
  </Svg>
)
export const IconeCheck = (p) => (
  <Svg {...p}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
)
export const IconeCasa = (p) => (
  <Svg {...p}>
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <path d="M9 22V12h6v10" />
  </Svg>
)
export const IconeSair = (p) => (
  <Svg {...p}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </Svg>
)
