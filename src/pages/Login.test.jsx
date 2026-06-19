import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';
import api from '../api/client';

// O AuthContext chama a API no login — mockamos o client axios.
vi.mock('../api/client', () => ({
  default: { post: vi.fn() },
}));

function renderizar() {
  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div>HOME</div>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe('Login', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('mostra os campos Email e Senha', () => {
    renderizar();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('enviar vazio mostra mensagem de erro e nao chama a API', async () => {
    renderizar();
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/informe email e senha/i)).toBeInTheDocument();
    expect(api.post).not.toHaveBeenCalled();
  });

  it('login valido redireciona para a home', async () => {
    api.post.mockResolvedValue({
      data: { token: 'jwt', usuario: { nome: 'Pedro', email: 'pedro@email.com' } },
    });
    renderizar();
    await userEvent.type(screen.getByLabelText('Email'), 'pedro@email.com');
    await userEvent.type(screen.getByLabelText('Senha'), '123456');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText('HOME')).toBeInTheDocument();
  });
});
