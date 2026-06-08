import '@testing-library/jest-dom'

// Polyfills para o jsdom — necessarios para a biblioteca de animacao Motion.
if (!window.matchMedia) {
  window.matchMedia = (query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })
}

class ObservadorFalso {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
if (!window.ResizeObserver) window.ResizeObserver = ObservadorFalso
if (!window.IntersectionObserver) window.IntersectionObserver = ObservadorFalso
