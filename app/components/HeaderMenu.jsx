import React, { useCallback, useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { Button } from '@material-ui/core'

import { useSelector } from '../util/helpers'
import AnnotationsToggler from './AnnotationsToggler'
import Disclaimer from './Disclaimer'
import ShareModal from './ShareModal'
import EmbedForm from './EmbedForm'
import { userIsOwnerSelector, userCanEditSelector } from '../util/selectors'


export default function HeaderMenu() {
  const dispatch = useDispatch()
  const userIsOwner = useSelector(userIsOwnerSelector)
  const userCanEdit = useSelector(userCanEditSelector)
  const user = useSelector(state => state.attributes.user)
  const isCloneable = useSelector(state => state.attributes.settings.clone)
  const isPrivate = useSelector(state => state.attributes.settings.private)
  const shareUrl = useSelector(state => state.attributes.shareUrl)
  const [showDisclaimer, setShowDisclaimer] = useState(false)
  const [showShare, setShowShare] = useState(false)
  const [showEmbed, setShowEmbed] = useState(false)
  const canClone = userIsOwner || (user && isCloneable)
  const canShare = userIsOwner && isPrivate && shareUrl

  const enableEditorMode = useCallback(
    () => dispatch({ type: 'SET_EDITOR_MODE', enabled: true }), 
    [dispatch]
  )

  const clone = useCallback(() => dispatch({ type: 'CLONE_REQUESTED' }), [dispatch])
  
  const openShare = useCallback(() => setShowShare(true), [])
  const closeShare = useCallback(() => setShowShare(false), [])

  const openDisclaimer = useCallback(() => setShowDisclaimer(true), [])
  const closeDisclaimer = useCallback(() => setShowDisclaimer(false), [])

  const embedRef = useRef()
  const toggleEmbed = useCallback(() => setShowEmbed(!showEmbed), [showEmbed])
  const closeEmbed = useCallback(() => setShowEmbed(false), [])

  return (
    <div id="oligrapher-header-menu">
      <AnnotationsToggler />

      { userCanEdit &&
        <Button size="small" variant="outlined" onClick={enableEditorMode}>Edit</Button> 
      }

      { canShare &&
        <Button size="small" variant="outlined" onClick={openShare}>Share</Button>
      }

      { canClone &&
        <Button size="small" variant="outlined" onClick={clone}>Clone</Button>
      }

      <Button size="small" variant="outlined" onClick={toggleEmbed} ref={embedRef}>Embed</Button>

      <Button size="small" variant="outlined" onClick={openDisclaimer}>Disclaimer</Button>

      <Disclaimer open={showDisclaimer} close={closeDisclaimer} />
      <ShareModal open={showShare} close={closeShare} url={shareUrl} />
      <EmbedForm open={showEmbed} anchor={embedRef.current} close={closeEmbed} />
    </div>
  )
}