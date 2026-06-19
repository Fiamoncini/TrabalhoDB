import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import api from '../api/client'
import { AuthProvider, useAuth } from './AuthContext'

// Login/cadastro chamam o backend — mockamos o client axios.
vi.mock('../api/client', () => ({
  default: { post: vi.fn() },
}))

function montar() {
  return renderHook(() => useAuth(), { wrapper: AuthProvider })
}

const respostaOk = (usuario) => ({ data: { token: 'jwt.de.teste', usuario } })

describe('AuthContext', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  it('comeca deslogado', () => {
    const { result } = montar()
    expect(result.current.usuario).toBeNull()
    expect(result.current.autenticado).toBe(false)
  })

  it('cadastrar chama /auth/register, autentica e persiste', async () => {
    api.post.mockResolvedValue(respostaOk({ nome: 'Maria Silva', email: 'maria@email.com' }))
    const { result } = montar()
    await act(async () => {
      await result.current.cadastrar('Maria Silva', 'maria@email.com', '123456')
    })
    expect(api.post).toHaveBeenCalledWith('/auth/register', {
      nome: 'Maria Silva',
      email: 'maria@email.com',
      senha: '123456',
    })
    expect(result.current.autenticado).toBe(true)
    expect(result.current.usuario.nome).toBe('Maria Silva')
    expect(result.current.token).toBe('jwt.de.teste')
  })

  it('login chama /auth/login e autentica', async () => {
    api.post.mockResolvedValue(respostaOk({ nome: 'Joao', email: 'joao@email.com' }))
    const { result } = montar()
    await act(async () => {
      await result.current.login('joao@email.com', '123456')
    })
    expect(api.post).toHaveBeenCalledWith('/auth/login', {
      email: 'joao@email.com',
      senha: '123456',
    })
    expect(result.current.usuario.email).toBe('joao@email.com')
  })

  it('login sem email ou senha lanca erro sem chamar a API', async () => {
    const { result } = montar()
    await expect(result.current.login('', '')).rejects.toThrow(/informe email e senha/i)
    expect(api.post).not.toHaveBeenCalled()
  })

  it('login com credenciais invalidas propaga a mensagem do backend', async () => {
    api.post.mockRejectedValue({ response: { data: { erro: 'Email ou senha invalidos.' } } })
    const { result } = montar()
    await expect(result.current.login('x@x.com', 'errada')).rejects.toThrow('Email ou senha invalidos.')
    expect(result.current.autenticado).toBe(false)
  })

  it('logout limpa o usuario', async () => {
    api.post.mockResolvedValue(respostaOk({ nome: 'Joao', email: 'joao@email.com' }))
    const { result } = montar()
    await act(async () => {
      await result.current.login('joao@email.com', '123456')
    })
    act(() => result.current.logout())
    expect(result.current.usuario).toBeNull()
    expect(result.current.autenticado).toBe(false)
  })

  it('persiste e recarrega a sessao do localStorage', async () => {
    api.post.mockResolvedValue(respostaOk({ nome: 'Ana', email: 'ana@email.com' }))
    const primeiro = montar()
    await act(async () => {
      await primeiro.result.current.login('ana@email.com', '123456')
    })
    // novo mount le do localStorage
    const segundo = montar()
    expect(segundo.result.current.autenticado).toBe(true)
    expect(segundo.result.current.usuario.email).toBe('ana@email.com')
  })
})
