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
    title: 'Delete'
  },
  "settings": {
    icon: <GoGear />,
    title: 'Settings'
  },
  "help": {
    icon: <FiHelpCircle />,
    title: 'Help'
  }
}

export const MENU_ITEMS = [
  'node',
  'text',
  // 'legend',
  // TODO:
  // 'story',
  // 'style',
  // 'organize',
  'delete',
  'settings',
  'help'
]

export default MENU
