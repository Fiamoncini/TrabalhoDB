import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Cadastro from './Cadastro';
import api from '../api/client';

vi.mock('../api/client', () => ({
  default: { post: vi.fn() },
}));

function renderCadastro() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/cadastro']}>
        <Routes>
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/" element={<h1>Home</h1>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('Cadastro', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('mostra os tres campos', () => {
    renderCadastro();
    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('enviar vazio mostra erro e nao chama a API', async () => {
    const user = userEvent.setup();
    renderCadastro();

    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByText('Preencha todos os campos.')).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('cadastro valido redireciona para a home', async () => {
    api.post.mockResolvedValue({
      data: { token: 'jwt', usuario: { nome: 'Joao Silva', email: 'joao@email.com' } },
    });
    const user = userEvent.setup();
    renderCadastro();

    await user.type(screen.getByLabelText('Nome'), 'Joao Silva');
    await user.type(screen.getByLabelText('E-mail'), 'joao@email.com');
    await user.type(screen.getByLabelText('Senha'), 'senha123');
    await user.click(screen.getByRole('button', { name: 'Criar conta' }));

    expect(await screen.findByRole('heading', { name: 'Home' })).toBeInTheDocument();
  });
});
