import { createContext, useContext, useCallback, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Link } from 'react-router-dom'
import { IconeCheck } from '../components/icons'

// Contexto de toasts (feedback rapido). O valor padrao e um no-op, entao
// componentes podem chamar useToast() mesmo sem o provider (ex.: em testes).
const ToastContext = createContext({ mostrar: () => {} })

let seq = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const mostrar = useCallback((mensagem, opts = {}) => {
    const id = ++seq
    setToasts((t) => [...t, { id, mensagem, ...opts }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  return (
    <ToastContext.Provider value={{ mostrar }}>
      {children}
      <div className="toast-area" aria-live="polite" aria-atomic="false">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              className="toast"
              role="status"
              initial={{ opacity: 0, y: 18, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 380, damping: 28 }}
            >
              <span className="toast-icone">
                <IconeCheck size={15} />
              </span>
              <span className="toast-msg">{t.mensagem}</span>
              {t.link && (
                <Link to={t.link} className="toast-link">
                  {t.linkTexto || 'Ver'}
                </Link>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => useContext(ToastContext)
