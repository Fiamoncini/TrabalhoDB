import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Leva a pagina para o topo a cada troca de rota (o React Router preserva a
// posicao de scroll por padrao, fazendo a pagina nova abrir no meio/embaixo).
export default function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    } catch {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  return null
}
