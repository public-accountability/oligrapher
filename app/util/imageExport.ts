import slugify from 'slugify'
import { Viewbox } from '../graph/graph'
import { State } from './defaultState'
import isNull from 'lodash/isNull'

// @ts-ignore
import { GRAPH_CONTAINER_ID, GRAPH_CONTENT_ID } from '../components/Graph'

// converts an image's href from plain URL to data URL
function convertImage(image: any) {
  // we have to load the url into a new image object
  // in order to get the original width and height
  const url = image.getAttribute('href')
  const img = new Image()
  img.src = url

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d') as any
  canvas.width = img.width
  canvas.height = img.height
  ctx.drawImage(image, 0, 0)

  // catch CORS-related errors if url is external to littlesis
  try {
    const dataUrl = canvas.toDataURL('image/jpeg')
    image.setAttribute('href', dataUrl)
  } catch (error) {
    console.log(`Couldn't convert image to data uri: ${url}`)
  }
}


// Converts a SVG string to a jpeg  data url using <canvas>
async function svgToJpeg(svg: string, width: number, height: number): Promise<string> {
  const source = await blobToDataUrl(new Blob([svg], { type: 'image/svg+xml' }))
  const image = new Image()
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  return new Promise( (resolve, reject) => {
    try {
      image.onload = () => {
        const context = canvas.getContext('2d') as any
        context.drawImage(image, 0, 0, width, height)
        const jpegDataUrl = canvas.toDataURL('image/jpeg')
        canvas.remove()
        resolve(jpegDataUrl)
      }
      image.src = source
    } catch(error) {
      reject(error)
    }
  })
}

// we use FileReader istead of the simpler URL.createObjectURL() in order to
// circumvent a longstanding chrome bug that causes svg to taint a canvas
// see: https://bugs.chromium.org/p/chromium/issues/detail?id=294129
async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    try {
      reader.onload = (e: any) => {
        resolve(e.target.result)
      }

      reader.readAsDataURL(blob)
    } catch (error) {
      reject(error)
    }
  })
}

export function padViewbox(viewbox: Viewbox, padding: number = 100): Viewbox {
  return {
    minX: viewbox.minX - padding,
    minY: viewbox.minY - padding,
    w: viewbox.w + padding * 2,
    h: viewbox.h + padding * 2
  }
}

function serializeViewbox(viewbox: Viewbox): string {
  return [
    viewbox.minX, viewbox.minY, viewbox.w, viewbox.h
  ].join(' ')
}

export async function downloadRasteredSvg(
  svg: string,
  title: string,
  width: number,
  height: number
): Promise<boolean> {
  try {
    const jpegDataUrl = await svgToJpeg(svg, width, height)

    // download image by using data url a href
    // a in a link and simulating a click
    const link = document.createElement('a')
    link.download = slugify(title) + '.jpg'
    link.style.opacity = "0"
    document.body.append(link)
    link.href = jpegDataUrl
    link.click()
    link.remove()
    return true
  } catch(error) {
    console.error(error)
    return false
  }
}

// TODO: import element ids as constants from elsewhere or
// use querySelector to locate elements based on structure
export function getGraphMarkup(viewbox: Viewbox): string {
  const svg = document.querySelector(`#${GRAPH_CONTAINER_ID} > svg`) as any
  const g = document.getElementById(GRAPH_CONTENT_ID) as any
  const defs = document.querySelector(`#${GRAPH_CONTAINER_ID} > svg > defs`) as any
  const clonedSvg = svg.cloneNode(false)
  const clonedG = g.cloneNode(true)
  const clonedDefs = defs.cloneNode(true)
  Array.from(clonedG.getElementsByTagName('image')).forEach(convertImage)
  clonedSvg.setAttribute('width', viewbox.w)
  clonedSvg.setAttribute('height', viewbox.h)
  clonedSvg.setAttribute('viewBox', serializeViewbox(viewbox))
  clonedSvg.setAttribute('style', 'background-color: white')
  clonedSvg.appendChild(clonedDefs)
  clonedSvg.appendChild(clonedG)
  return clonedSvg.outerHTML
}

function checkViewBox(x: any): any {
  if (isNull(x)) {
    throw new Error("viewBox is null")
  } else {
    return x
  }
}

export function toSvg(state: State): string {
  return getGraphMarkup(padViewbox(checkViewBox(state.display.viewBox)))
}

export function toJpeg(state: State): Promise<string> {
  const paddedViewBox = padViewbox(checkViewBox(state.display.viewBox))
  const svg = getGraphMarkup(paddedViewBox)
  const width = paddedViewBox.w * 2
  const height = paddedViewBox.h * 2
  return svgToJpeg(svg, width, height)
}
