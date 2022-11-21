import slugify from "slugify"
import pLimit from "p-limit"
import { getElementById } from "./helpers"
import { getDataUrl } from "../datasources/littlesis"

async function convertImage(image: SVGElement) {
  const url = image.getAttribute("href")

  // nothing to be done when already a dataurl
  if (!url || url.slice(0, 5) === "data:") {
    return
  }

  try {
    const dataurl = await getDataUrl(url)

    if (dataurl.dataurl) {
      image.setAttribute("href", dataurl.dataurl)
    } else {
      throw new Error(`Failed to get data url for ${url}`)
    }
  } catch (error) {
    console.error(error)
  }
}

async function convertImages(element: SVGSVGElement): Promise<SVGSVGElement> {
  const limit = pLimit(2)
  const actions = []

  for (const image of element.getElementsByTagName("image")) {
    actions.push(limit(() => convertImage(image)))
  }

  await Promise.all(actions)
  return element
}

function simulateClick(filename: string, dataUrl: string) {
  const link = document.createElement("a")
  link.download = filename
  link.style.opacity = "0"
  document.body.append(link)
  link.href = dataUrl
  link.click()
  link.remove()
}

const serializeToString = (element: Node): string => new XMLSerializer().serializeToString(element)

export function cloneSvg(): Promise<SVGSVGElement> {
  const svg = getElementById("oligrapher-svg")
  const clonedSvg = svg.cloneNode(true)
  clonedSvg.setAttribute("style", "background-color: white")
  return convertImages(clonedSvg)
}

export function getGraphMarkup(): Promise<string> {
  return cloneSvg().then(serializeToString)
}

export async function downloadSvg(title: string) {
  try {
    const svgElement = await cloneSvg()
    const data = serializeToString(svgElement)
    const svgBlob = new Blob([data], { type: "image/svg+xml;charset=utf-8" })
    const dataurl = URL.createObjectURL(svgBlob)
    const filename = slugify(title) + ".svg"
    simulateClick(filename, dataurl)
    URL.revokeObjectURL(dataurl)
    return true
  } catch (error) {
    console.error(error)
    return false
  }
}
