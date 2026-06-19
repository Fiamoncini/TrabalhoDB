import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'motion/react'
import Topbar from './components/Topbar'
import CategoryBar from './components/CategoryBar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'
import ScrollToTop from './components/ScrollToTop'
import { IconeCaminhao, IconeCadeado, IconeDevolucao } from './components/icons'
import Catalogo from './pages/Catalogo'
import ProdutoDetalhe from './pages/ProdutoDetalhe'
import Carrinho from './pages/Carrinho'
import Login from './pages/Login'
import Cadastro from './pages/Cadastro'
import MeusPedidos from './pages/MeusPedidos'

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <a href="#conteudo" className="skip-link">
        Pular para o conteúdo
      </a>
      <div className="barra-aviso">
        <div className="container barra-aviso-inner">
          <span>
            <IconeCaminhao size={15} /> <b>Frete grátis</b> em produtos selecionados
          </span>
          <span className="sep esconde-mobile">•</span>
          <span className="esconde-mobile">
            <IconeCadeado size={15} /> Compra 100% segura
          </span>
          <span className="sep esconde-mobile">•</span>
          <span className="esconde-mobile">
            <IconeDevolucao size={15} /> Devolução fácil em até 7 dias
          </span>
        </div>
      </div>
      <Topbar />
      <CategoryBar />
      <main className="app-main" id="conteudo">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            <Routes location={location}>
              <Route path="/" element={<Catalogo />} />
              <Route path="/produto/:id" element={<ProdutoDetalhe />} />
              <Route
                path="/carrinho"
                element={
                  <ProtectedRoute>
                    <Carrinho />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route
                path="/meus-pedidos"
                element={
                  <ProtectedRoute>
                    <MeusPedidos />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Catalogo />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
