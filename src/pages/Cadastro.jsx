import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../context/AuthContext';

// Pagina de cadastro (mock). Mesmo padrao do Login, com campo Nome adicional.
export default function Cadastro() {
  const { cadastrar } = useAuth();
  const navigate = useNavigate();

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setErro('');
    setEnviando(true);
    try {
      await cadastrar(nome, email, senha);
      navigate('/');
    } catch (err) {
      setErro(err.message);
      setEnviando(false);
    }
  }

  return (
    <div className="container">
      <div className="cartao-auth">
        <h1>Criar conta</h1>
        <p className="sub">Cadastre-se para comecar a comprar.</p>

        <form className="form" onSubmit={handleSubmit}>
          {erro && <p className="erro">{erro}</p>}

          <label htmlFor="nome">Nome</label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Seu nome"
          />

          <label htmlFor="email">E-mail</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="seu@email.com"
          />

          <label htmlFor="senha">Senha</label>
          <input
            id="senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Sua senha"
          />

          <motion.button
            whileTap={{ scale: 0.97 }}
            className="btn btn-bloco"
            type="submit"
            disabled={enviando}
          >
            {enviando ? 'Criando conta...' : 'Criar conta'}
          </motion.button>
        </form>

        <p className="sub">
          Ja tem conta? <Link to="/login">Entrar</Link>
        </p>
      </div>
    </div>
  );
}
