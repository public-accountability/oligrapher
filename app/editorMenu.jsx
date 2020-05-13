import React from 'react'
// Icons
import { FaRegCircle, FaBezierCurve, FaFlipboard, FaTv, FaRegEdit, FaRegTrashAlt } from "react-icons/fa"
import { FiHelpCircle, FiUsers } from 'react-icons/fi'
import { GoTextSize, GoGear } from 'react-icons/go'

export const MENU = {
  "node": {
    icon: <FaRegCircle />,
    title: 'Add Node'
  },
  "text": {
    icon: <GoTextSize />,
    title: 'Add Text'
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
    icon: <FaBezierCurve />,
    title: 'Organize Map'
  },
  "settings": {
    icon: <GoGear />,
    title: 'Settings'
  },
  "editors": {
    icon: <FiUsers />,
    title: 'Editors'
  },
  "delete": {
    icon: <FaRegTrashAlt />,
    title: 'Delete Map'
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
  'organize',
  'settings',
  'editors',
  // 'delete',
  'help'
]

export default MENU
