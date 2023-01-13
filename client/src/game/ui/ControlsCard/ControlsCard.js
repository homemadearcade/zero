import classnames from 'classnames'
import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { jumpControlsToKeys } from '../../defaultData/jumping'
import { movementControlsToKeys } from '../../defaultData/movement'
import KeyIndicator from '../KeyIndicator/KeyIndicator'
import './ControlsCard.scss'

const ControlsCard = ({
  controlScheme,
  jumpStyle
}) => {
  const keys = {...movementControlsToKeys[controlScheme], ...jumpControlsToKeys[jumpStyle] }

  const list = []

  function renderKey({keyName, action}) {
    return <div className="ControlsCard__key" key={keyName}>
      <KeyIndicator className="ControlsCard__key-indicator" keyName={keyName}></KeyIndicator>
      {action}
    </div>
  }

  if(keys.up) {
    list.push(renderKey({keyName: 'up', action: keys.up}))
  }
  if(keys.up2) {
    list.push(renderKey({keyName: 'up', action: keys.up2}))
  }
  if(keys.left) {
    list.push(renderKey({keyName: 'left', action: keys.left}))
  }
  if(keys.right) {
    list.push(renderKey({keyName: 'right', action: keys.right}))
  }
  if(keys.down) {
    list.push(renderKey({keyName: 'down', action: keys.down}))
  }

  return <div className="ControlsCard">{list}</div>
}

const mapStateToProps = (state) => ({
  keysDown: state.keysDown
})


export default compose(
  connect(mapStateToProps, { }),
)(ControlsCard);
