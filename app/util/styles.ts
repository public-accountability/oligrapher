import { Caption } from '../graph/caption'

export const styleForCaption = (caption: Caption) => ({
  isolate: true,
  display: 'block',
  fontFamily: caption.font,
  fontSize: caption.size,
  fontWeight: caption.weight,
  height: caption.height,
  width: caption.width,
  border: '1px solid #ccc',
  margin: 0,
  boxSizing: 'border-box',
  padding: 15,
  backgroundColor: '#f8f8f8'
})