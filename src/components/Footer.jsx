import { Link } from 'react-router-dom'
import { IconeCadeado, IconeCaminhao } from './icons'

export default function Footer() {
  return (
    <footer className="rodape">
      <div className="container">
        <div className="rodape-topo">
          <div className="rodape-marca">
            <div className="logo">
              <span className="logo-icone">N</span>
              <span>
                Mercado<span className="logo-marca">NoSQL</span>
              </span>
            </div>
            <p>
              Projeto academico de e-commerce com MongoDB. Demonstra schema
              flexivel, documentos embutidos e desnormalizacao. Feito com React +
              Vite.
            </p>
          </div>

          <div className="rodape-cols">
            <div className="rodape-col">
              <h4>Comprar</h4>
              <ul>
                <li><Link to="/?categoria=eletronicos">Eletronicos</Link></li>
                <li><Link to="/?categoria=roupas">Roupas</Link></li>
                <li><Link to="/?categoria=calcados">Calcados</Link></li>
                <li><Link to="/">Todas as ofertas</Link></li>
              </ul>
            </div>
            <div className="rodape-col">
              <h4>Conta</h4>
              <ul>
                <li><Link to="/login">Entrar</Link></li>
                <li><Link to="/cadastro">Criar conta</Link></li>
                <li><Link to="/meus-pedidos">Meus pedidos</Link></li>
                <li><Link to="/carrinho">Carrinho</Link></li>
              </ul>
            </div>
            <div className="rodape-col">
              <h4>Ajuda</h4>
              <ul>
                <li>Entrega e frete</li>
                <li>Trocas e devolucoes</li>
                <li>Formas de pagamento</li>
                <li>Privacidade</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="rodape-base">
          <span>© 2026 <strong>Mercado NoSQL</strong>. Projeto academico.</span>
          <span>
            <IconeCadeado size={14} /> Pagamento seguro &nbsp;·&nbsp;{' '}
            <IconeCaminhao size={14} /> Entrega rapida
          </span>
        </div>
      </div>
    </footer>
  )
}
