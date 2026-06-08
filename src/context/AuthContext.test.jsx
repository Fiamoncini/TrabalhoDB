import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { AuthProvider, useAuth } from './AuthContext'

function montar() {
  return renderHook(() => useAuth(), { wrapper: AuthProvider })
}

describe('AuthContext (mock)', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('comeca deslogado', () => {
    const { result } = montar()
    expect(result.current.usuario).toBeNull()
    expect(result.current.autenticado).toBe(false)
  })

  it('cadastrar autentica o usuario', () => {
    const { result } = montar()
    act(() => result.current.cadastrar('Maria Silva', 'maria@email.com', '123456'))
    expect(result.current.autenticado).toBe(true)
    expect(result.current.usuario.nome).toBe('Maria Silva')
    expect(result.current.token).toBeTruthy()
  })

  it('login autentica o usuario', () => {
    const { result } = montar()
    act(() => result.current.login('joao@email.com', '123456'))
    expect(result.current.autenticado).toBe(true)
    expect(result.current.usuario.email).toBe('joao@email.com')
  })

  it('login sem email ou senha lanca erro', () => {
    const { result } = montar()
    expect(() => result.current.login('', '')).toThrow()
  })

  it('logout limpa o usuario', () => {
    const { result } = montar()
    act(() => result.current.login('joao@email.com', '123456'))
    act(() => result.current.logout())
    expect(result.current.usuario).toBeNull()
    expect(result.current.autenticado).toBe(false)
  })

  it('persiste e recarrega a sessao do localStorage', () => {
    const primeiro = montar()
    act(() => primeiro.result.current.login('ana@email.com', '123456'))
    // novo mount le do localStorage
    const segundo = montar()
    expect(segundo.result.current.autenticado).toBe(true)
    expect(segundo.result.current.usuario.email).toBe('ana@email.com')
  })
})
