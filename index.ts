import Oligrapher from './app/Oligrapher'

if (window.Oligrapher) {
  console.warn("Redefing window.Oligrapher")
}

window.Oligrapher = Oligrapher
