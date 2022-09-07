import Oligrapher from './app/Oligrapher'

if (window.Oligrapher) {
  console.warn("redefining window.Oligrapher")
}

window.Oligrapher = Oligrapher
