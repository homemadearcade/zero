import React, { useState } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import './PlayerControlsCardCurrent.scss'
import PlayerControlsCard from '../PlayerControlsCard/PlayerControlsCard'
import { mapCobrowsingState } from '../../../utils'

const PlayerControlsCardCurrent = ({
  playerInterface: {
    playerEntityModelId,
  },
  gameModel: {
    gameModel: {
      entityModels,
    }
  }
}) => {
  if(!playerEntityModelId) {
    return null
  }

  const playerEntityModel = entityModels[playerEntityModelId]
  const projectileEntityModel = entityModels[playerEntityModel.projectile.entityModelId]
 
  return <PlayerControlsCard
    entityModel={playerEntityModel}
    projectileEntityModel={projectileEntityModel}
    movementControlBehavior={playerEntityModel.movement.movementControlsBehavior}
    jumpControlsBehavior={playerEntityModel.jump.jumpControlsBehavior}
  />
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  playerInterface: state.playerInterface,
  gameModel: state.gameModel,
})


export default compose(
  connect(mapStateToProps, { }),
)(PlayerControlsCardCurrent);
