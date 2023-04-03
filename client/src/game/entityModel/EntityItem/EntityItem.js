/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './EntityItem.scss';
import classNames from 'classnames';
import { clearEntity, selectEntity } from '../../../store/actions/game/gameSelectorActions';
import { getCobrowsingState, mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { openContextMenuFromEntityId } from '../../../store/actions/game/contextMenuActions';
import Texture from '../../textures/Texture/Texture';
import Icon from '../../../ui/Icon/Icon';
import { toggleLayerVisibility } from '../../../store/actions/game/gameViewEditorActions';
import { changeEntityIdHovering } from '../../../store/actions/game/hoverPreviewActions';
import { useWishTheme } from '../../../hooks/useWishTheme';
import { PLAYER_ENTITY_IID } from '../../../constants/interfaceIds';

const EntityItem = ({
  gameModel: { gameModel: { entityModels } },
  entityModelId,
  gameSelector: { entityModelIdSelectedEntityList },
  selectEntity,
  clearEntity,
  openContextMenuFromEntityId,
  width, height,
  playerInterface: { playerEntityModelId },
  toggleLayerVisibility,
  changeEntityIdHovering,
  onClick,
}) => {
  const entityModel = entityModels[entityModelId]
  const [isHovering, setIsHovering] = useState(false)
  const isSelected = entityModelIdSelectedEntityList === entityModelId

  
  const border = '1px solid ' + useWishTheme().primaryColor.hexString
  return <div
    style={{width: width? width: null, height: height? height: null, border: isSelected ? border : null}}
    onClick={(e) => {
      if(onClick) onClick(e)
      if(entityModel.entityInterfaceId === PLAYER_ENTITY_IID) return

      if(entityModelId === entityModelIdSelectedEntityList) {
        clearEntity()
      } else {
        selectEntity(entityModelId)
        if(getCobrowsingState().gameViewEditor.layerInvisibility[entityModel.entityInterfaceId]) {
          toggleLayerVisibility(entityModel.entityInterfaceId)
        }
      }
    }}
    onMouseEnter={() => {
      setIsHovering(true)
      changeEntityIdHovering(entityModelId)
    }}
    onMouseLeave={() => {
      setIsHovering(false)
      changeEntityIdHovering(null)
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      openContextMenuFromEntityId(entityModelId, e)
    }}
    className={classNames("EntityItem", { 'EntityItem--isPlayer': entityModelId === playerEntityModelId })}
  >
    {isSelected && isHovering && <Icon className="EntityItem__unselect" icon="faClose"/>}
    <div className="EntityItem__texture">
      <Texture textureTint={entityModel.graphics.textureTint} textureId={entityModel.graphics.textureId}/>
    </div>
    <div className="EntityItem__name">{entityModel.name}</div>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
  playerInterface: state.playerInterface
})

export default compose(
  connect(mapStateToProps, { changeEntityIdHovering, openContextMenuFromEntityId, selectEntity, clearEntity, toggleLayerVisibility }),
)(EntityItem);
