import { describe, it, expect } from 'vitest'
import { formatarPreco } from './formato'

const NBSP = String.fromCharCode(160) // espaco nao-quebravel (U+00A0)

describe('formatarPreco', () => {
  it('formata um valor com centavos no padrao brasileiro', () => {
    expect(formatarPreco(49.9)).toBe('R$ 49,90')
  })

  it('usa ponto como separador de milhar', () => {
    expect(formatarPreco(1234.5)).toBe('R$ 1.234,50')
  })

  it('formata inteiros com duas casas decimais', () => {
    expect(formatarPreco(80)).toBe('R$ 80,00')
  })

  it('normaliza o espaco e nao deixa caractere nao-quebravel', () => {
    expect(formatarPreco(10)).not.toContain(NBSP)
    expect(formatarPreco(10)).toBe('R$ 10,00')
  })
})
