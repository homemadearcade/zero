import React from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { DOWN_KID, LEFT_KID, RIGHT_KID, SPACE_KID, UP_KID } from '../../../constants/keyboard/keyIds'
import { useKeyPress } from '../../../hooks/useKeyPress'
import { useWishTheme } from '../../../hooks/useWishTheme'
import Typography from '../../../ui/Typography/Typography'
import { ADVANCED_DIRECTIONAL_CONTROLS, jumpControlsToKeys } from '../../constants'
import { movementControlsToKeys } from '../../constants'
import './PlayerControlsCard.scss'

const PlayerControlsCard = ({
  movementControlBehavior = {},
  jumpControlsBehavior = {},
  projectileEntityModel,
  entityModel
}) => {

  const isSpacePressed = useKeyPress(' ')
  const isLeftPressed = useKeyPress('ArrowLeft')
  const isRightPressed = useKeyPress('ArrowRight')
  const isUpPressed = useKeyPress('ArrowUp')
  const isDownPressed = useKeyPress('ArrowDown')

  const keyIdToIsPressed = {
    [SPACE_KID]: isSpacePressed,
    [LEFT_KID]: isLeftPressed,
    [RIGHT_KID]: isRightPressed,
    [UP_KID]: isUpPressed,
    [DOWN_KID]: isDownPressed,
  }

  const theme = useWishTheme()

  let keys = {}

  if(entityModel.movement.movementControlsBehavior !== ADVANCED_DIRECTIONAL_CONTROLS || entityModel.movement.ignoreGravity) {
    keys = {...movementControlsToKeys[movementControlBehavior] }
  } else {
    keys = {...movementControlsToKeys[movementControlBehavior], ...jumpControlsToKeys[jumpControlsBehavior] }
  }

  const list = []

  function renderKey(text) {
    return <>
      <Typography sx={{fontSize: '.5em', color: '#aaa'}} variant="subtitle2" font="2P">
        {text}
      </Typography>
    </>
  }

  function renderActionTitle(action) {
    return <>
      <Typography sx={{fontSize: '.8em'}} variant="subtitle2">
        {action}
      </Typography>
    </>
  }


  function renderKeyAction(action) {
    if(action instanceof Function) {
      return action(entityModel)
    } else if(typeof action === 'string') {
      return action
    } else if(Array.isArray(action)) {
      return action[0]
    }
  }

  function renderKeyAndAction({keyName, action, keyId}) {
    return <div key={keyName} className="PlayerControlsCard__row">
      <div className="PlayerControlsCard__key" style={{
        backgroundColor: keyIdToIsPressed[keyId] && theme.primaryColor.hexString,
        color: keyIdToIsPressed[keyId] && 'white',
      }}>
        {renderKey(keyName)}
      </div>
      <div className="PlayerControlsCard__action">
        {renderActionTitle(renderKeyAction(action))}
      </div>
    </div>
  }

  if(projectileEntityModel) {
    list.push(renderKeyAndAction({
      keyName: 'space',
      action: 'Shoot ' + projectileEntityModel.name,
      keyId: SPACE_KID
    }))
  }

  if(keys[UP_KID]) {
    list.push(renderKeyAndAction({keyName: 'up', action: keys[UP_KID], keyId: UP_KID}))
  }
  if(keys[LEFT_KID]) {
    list.push(renderKeyAndAction({keyName: 'left', action: keys[LEFT_KID], keyId: LEFT_KID}))
  }
  if(keys[RIGHT_KID]) {
    list.push(renderKeyAndAction({keyName: 'right', action: keys[RIGHT_KID], keyId: RIGHT_KID}))
  }
  if(keys[DOWN_KID]) {
    list.push(renderKeyAndAction({keyName: 'down', action: keys[DOWN_KID], keyId: DOWN_KID}))
  }

  return <div className="PlayerControlsCard">{list}</div>
}

const mapStateToProps = (state) => ({
})


export default compose(
  connect(mapStateToProps, { }),
)(PlayerControlsCard);
