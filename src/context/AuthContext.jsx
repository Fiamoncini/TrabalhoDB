import { createContext, useContext, useMemo, useState } from 'react'

// Autenticacao MOCK (sem backend): valida campos basicos, cria uma sessao
// falsa e persiste no localStorage. Para usar a API real, troque login/cadastrar
// por chamadas axios (ex.: api.post('/auth/login')).

const AuthContext = createContext(null)

function lerUsuario() {
  try {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  } catch {
    return null
  }
}

// Deriva um nome amigavel a partir do email (ex.: "joao.silva@x.com" -> "Joao Silva").
function nomeDoEmail(email) {
  const base = email.split('@')[0].replace(/[._-]+/g, ' ').trim()
  return base
    .split(' ')
    .filter(Boolean)
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join(' ') || 'Cliente'
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(lerUsuario)
  const [token, setToken] = useState(() => localStorage.getItem('token'))

  function persistir(novoUsuario, novoToken) {
    localStorage.setItem('usuario', JSON.stringify(novoUsuario))
    localStorage.setItem('token', novoToken)
    setUsuario(novoUsuario)
    setToken(novoToken)
  }

  function login(email, senha) {
    if (!email || !senha) {
      throw new Error('Informe email e senha.')
    }
    const novoUsuario = { nome: nomeDoEmail(email), email }
    persistir(novoUsuario, 'mock.jwt.token')
    return novoUsuario
  }

  function cadastrar(nome, email, senha) {
    if (!nome || !email || !senha) {
      throw new Error('Preencha todos os campos.')
    }
    const novoUsuario = { nome, email }
    persistir(novoUsuario, 'mock.jwt.token')
    return novoUsuario
  }

  function logout() {
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    setUsuario(null)
    setToken(null)
  }

  const valor = useMemo(
    () => ({
      usuario,
      token,
      autenticado: !!token,
      carregando: false,
      login,
      cadastrar,
      logout,
    }),
    [usuario, token]
  )

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth deve ser usado dentro de <AuthProvider>')
  }
  return ctx
}
