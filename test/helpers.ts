import { createElement,  ReactElement } from 'react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '../app/util/theme'

export const wrapInSvg = (element: ReactElement): ReactElement => createElement('svg', null, element)
export const wrapInThemeProvider = (element: ReactElement): ReactElement => createElement(ThemeProvider, { theme: theme }, element)

export const simpleGraph = {
  "nodes": {
    "-1Xu2uphP": {
      "id": "-1Xu2uphP",
      "display": {
        "x": -54.71783295711061,
        "y": -84.81264108352144,
        "scale": 1,
        "status": "normal",
        "name": "test1",
        "color": "#ccc"
      }
    },
    "L1K0sAKPx": {
      "id": "L1K0sAKPx",
      "display": {
        "x": 157.29119638826188,
        "y": -86.60948081264108,
        "scale": 1,
        "status": "normal",
        "name": "test2",
        "color": "#ccc"
      }
    },
    "_8bFKhgma": {
      "id": "_8bFKhgma",
      "display": {
        "x": 55.68397291196388,
        "y": 19.02708803611738,
        "scale": 1,
        "status": "normal",
        "name": "test3"
      }
    }
  },
  "edges": {
    "EW7LJH8ml": {
      "id": "EW7LJH8ml",
      "display": {
        "scale": 1,
        "arrow": false,
        "status": "normal",
        "label": "edgeA",
        "x1": 157.29119638826188,
        "y1": -86.60948081264108,
        "x2": -54.71783295711061,
        "y2": -84.81264108352144,
        "s1": 1,
        "s2": 1
      },
      "node1_id": "L1K0sAKPx",
      "node2_id": "-1Xu2uphP"
    },
    "WRIkscvlf": {
      "id": "WRIkscvlf",
      "display": {
        "scale": 1,
        "arrow": false,
        "status": "normal",
        "label": "edgeB",
        "x1": 157.29119638826188,
        "y1": -86.60948081264108,
        "x2": 55.68397291196388,
        "y2": 19.02708803611738,
        "s1": 1,
        "s2": 1,
        "cx": 63.78273137697517,
        "cy": 59.28216704288939
      },
      "node1_id": "L1K0sAKPx",
      "node2_id": "_8bFKhgma"
    }
  },
  "captions": {}
}
