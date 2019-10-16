import React from 'react'
import PropTypes from 'prop-types'
import HeaderMenuItem from './HeaderMenuItem'

export default function HeaderMenu(props) {
  return <div id="oligrapher-header-menu-wrapper">
           <ul>{
             props.items.map(item => <HeaderMenuItem key={item.text}
                                                     text={item.text}
                                                     url={item.url} />)
           }
           </ul>
         </div>
}


HeaderMenu.propTypes = {
  "items": PropTypes.array.isRequired
}


HeaderMenu.defaultProps = {
  "items": []
}
