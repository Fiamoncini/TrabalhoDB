import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

// Pagina de login (mock)
export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await login(email, senha);
      navigate('/');
    } catch (err) {
      setErro(err.message);
      setEnviando(false);
    }
  }

  return (
    <div className="container">
      <motion.div
        className="cartao-auth"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
      >
        <h1>Entrar</h1>
        <p className="sub">Acesse sua conta para continuar comprando.</p>

        <form className="form" onSubmit={handleSubmit} noValidate>
          {erro && (
            <p className="erro" role="alert">
              {erro}
            </p>
          )}

          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Sua senha"
          />

          <motion.button
            type="submit"
            className="btn btn-bloco"
            whileTap={{ scale: 0.97 }}
            disabled={enviando}
          >
            {enviando ? 'Entrando...' : 'Entrar'}
          </motion.button>
        </form>

        <p>
          Nao tem conta? <Link to="/cadastro">Cadastre-se</Link>
        </p>
      </motion.div>
    </div>
  );
}
