import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from './Login';

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
  beforeEach(() => localStorage.clear());

  it('mostra os campos Email e Senha', () => {
    renderizar();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('enviar vazio mostra mensagem de erro', async () => {
    renderizar();
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText(/informe email e senha/i)).toBeInTheDocument();
  });

  it('login valido redireciona para a home', async () => {
    renderizar();
    await userEvent.type(screen.getByLabelText('Email'), 'pedro@email.com');
    await userEvent.type(screen.getByLabelText('Senha'), '123456');
    await userEvent.click(screen.getByRole('button', { name: /entrar/i }));
    expect(await screen.findByText('HOME')).toBeInTheDocument();
  });
});
