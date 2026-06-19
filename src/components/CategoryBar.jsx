import { Link } from 'react-router-dom'
import { categorias } from '../mocks/produtos'
import { IconeCasa } from './icons'

export default function CategoryBar() {
  return (
    <nav className="categorias" aria-label="Categorias">
      <div className="container categorias-inner">
        <Link to="/" className="chip">
          <IconeCasa size={15} /> Início
        </Link>
        {categorias.map((c) => (
          <Link key={c.id} to={`/?categoria=${c.id}`} className="chip">
            {c.emoji} {c.nome}
          </Link>
        ))}
      </div>
    </nav>
  )
}
