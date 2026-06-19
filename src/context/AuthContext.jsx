import { createContext, useContext, useMemo, useState } from 'react'
import api from '../api/client'

// Autenticacao via API real: login/cadastro chamam o backend, recebem um JWT
// e persistem usuario + token no localStorage (o token e usado pelo interceptor
// do axios em api/client.js).

const AuthContext = createContext(null)

function lerUsuario() {
  try {
    const salvo = localStorage.getItem('usuario')
    return salvo ? JSON.parse(salvo) : null
  } catch {
    return null
  }
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

  async function login(email, senha) {
    if (!email || !senha) {
      throw new Error('Informe email e senha.')
    }
    try {
      const { data } = await api.post('/auth/login', { email, senha })
      persistir(data.usuario, data.token)
      return data.usuario
    } catch (err) {
      throw new Error(err.response?.data?.erro || 'Nao foi possivel entrar. Tente novamente.')
    }
  }

  async function cadastrar(nome, email, senha) {
    if (!nome || !email || !senha) {
      throw new Error('Preencha todos os campos.')
    }
    try {
      const { data } = await api.post('/auth/register', { nome, email, senha })
      persistir(data.usuario, data.token)
      return data.usuario
    } catch (err) {
      throw new Error(err.response?.data?.erro || 'Nao foi possivel criar a conta. Tente novamente.')
    }
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
