import { describe, it, expect, vi, beforeEach } from 'vitest'
import api from '../api/client'
import { listarProdutos, obterProduto } from './produtosService'

// O servico agora so faz a "costura" HTTP — mockamos o client axios.
vi.mock('../api/client', () => ({
  default: { get: vi.fn() },
}))

describe('produtosService', () => {
  beforeEach(() => vi.clearAllMocks())

  it('listarProdutos chama GET /produtos sem params quando nao ha filtros', async () => {
    api.get.mockResolvedValue({ data: [{ id: 'p01' }] })
    const lista = await listarProdutos()
    expect(api.get).toHaveBeenCalledWith('/produtos', { params: {} })
    expect(lista).toEqual([{ id: 'p01' }])
  })

  it('listarProdutos repassa categoria, busca e ordenar como query params', async () => {
    api.get.mockResolvedValue({ data: [] })
    await listarProdutos({ categoria: 'eletronicos', busca: 'fone', ordenar: 'maior-preco' })
    expect(api.get).toHaveBeenCalledWith('/produtos', {
      params: { categoria: 'eletronicos', busca: 'fone', ordenar: 'maior-preco' },
    })
  })

  it('obterProduto retorna o produto quando existe', async () => {
    api.get.mockResolvedValue({ data: { id: 'p01', nome: 'Fone' } })
    const produto = await obterProduto('p01')
    expect(api.get).toHaveBeenCalledWith('/produtos/p01')
    expect(produto.id).toBe('p01')
  })

  it('obterProduto retorna null em caso de 404', async () => {
    api.get.mockRejectedValue({ response: { status: 404 } })
    expect(await obterProduto('nao-existe')).toBeNull()
  })

  it('obterProduto propaga erros que nao sejam 404', async () => {
    api.get.mockRejectedValue({ response: { status: 500 } })
    await expect(obterProduto('p01')).rejects.toBeTruthy()
  })
})
