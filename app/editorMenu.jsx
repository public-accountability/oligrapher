import React from 'react'
// Icons
import { FaRegCircle, FaBezierCurve, FaFlipboard, FaTv, FaRegEdit, FaRegTrashAlt } from "react-icons/fa"
import { FiHelpCircle } from 'react-icons/fi'
import { GoTextSize, GoGear } from 'react-icons/go'
import { TiArrowMove } from 'react-icons/ti'

export const MENU = {
  "node": {
    icon: <FaRegCircle />,
    title: 'Add Node'
  },
  "edge": {
    icon: <FaBezierCurve />,
    title: 'Add edge'
  },
  "text": {
    icon: <GoTextSize />,
    title: 'Add Caption'
  },
  "legend": {
    icon: <FaFlipboard />,
    title: 'Add Legend'
  },
  "story": {
    icon: <FaTv />,
    title: 'story'
  },
  "style": {
    icon: <FaRegEdit />,
    title: 'Style Nodes'
  },
  "organize": {
    icon: <TiArrowMove />,
    title: 'organize'
  },
  "delete": {
    icon: <FaRegTrashAlt />,
    title: 'delete'
  },
  "settings": {
    icon: <GoGear />,
    title: 'settings'
  },
  "help": {
    icon: <FiHelpCircle />,
    title: 'help'
  }
}

export const MENU_ITEMS = [
  'node',
  'edge',
  'text',
  'legend',
  'story',
  'style',
  'organize',
  'delete',
  'settings',
  'help'
]

export default MENU
