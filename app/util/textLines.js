/*
   Splits text into lines with word wrapping.
   Used by <NodeLabel>

*/
export default function textLines(text) {
  if (text.length <= 18 || text.indexOf(' ') === -1) {
    return [text]
  }

  const perLineMax = text.length < 40 ? 18 : 25

  const words = text.split(/\s+/g)

  let lines = [words[0]]
  let currentWordIndex = 1
  let currentLineIndex = 0

  while (currentWordIndex < words.length) {
    let goToNewLine = ((lines[currentLineIndex] + words[currentWordIndex]).length + 1) > perLineMax

    if (goToNewLine) {
      currentLineIndex++
      lines[currentLineIndex] = words[currentWordIndex]
    } else {
      lines[currentLineIndex] = lines[currentLineIndex] + ' ' + words[currentWordIndex]
    }

    currentWordIndex++
  }

  return lines
}
