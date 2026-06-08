import { Link } from 'react-router-dom'
import { categorias } from '../mocks/produtos'

export default function CategoryBar() {
  return (
    <div className="categorias">
      <div className="container categorias-inner">
        <Link to="/" className="chip">
          🏠 Início
        </Link>
        {categorias.map((c) => (
          <Link key={c.id} to={`/?categoria=${c.id}`} className="chip">
            {c.emoji} {c.nome}
          </Link>
        ))}
      </div>
    </div>
  )
}
