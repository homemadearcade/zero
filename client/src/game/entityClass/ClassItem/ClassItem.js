/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassItem.scss';
import classNames from 'classnames';
import { clearClass, selectClass } from '../../../store/actions/game/gameSelectorActions';
import { getCobrowsingState, mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { openContextMenuFromClassId } from '../../../store/actions/game/contextMenuActions';
import Texture from '../../textures/Texture/Texture';
import Icon from '../../../ui/Icon/Icon';
import { PLAYER_CLASS } from '../../constants';
import { toggleLayerVisibility } from '../../../store/actions/game/gameViewEditorActions';
import { changeClassIdHovering } from '../../../store/actions/game/hoverPreviewActions';
import { useWishTheme } from '../../../hooks/useWishTheme';

const ClassItem = ({
  gameModel: { gameModel: { entityClasses } },
  entityClassId,
  gameSelector: { entityClassIdSelectedClassList },
  selectClass,
  clearClass,
  openContextMenuFromClassId,
  width, height,
  playerInterface: { playerClassId },
  toggleLayerVisibility,
  changeClassIdHovering,
  onClick,
}) => {
  const entityClass = entityClasses[entityClassId]
  const [isHovering, setIsHovering] = useState(false)
  const isSelected = entityClassIdSelectedClassList === entityClassId

  
  const border = '1px solid ' + useWishTheme().primaryColor.hexString
  return <div
    style={{width: width? width: null, height: height? height: null, border: isSelected ? border : null}}
    onClick={(e) => {
      if(onClick) onClick(e)
      if(entityClass.classInterfaceCategory === PLAYER_CLASS) return

      if(entityClassId === entityClassIdSelectedClassList) {
        clearClass()
      } else {
        selectClass(entityClassId)
        if(getCobrowsingState().gameViewEditor.layerInvisibility[entityClass.classInterfaceCategory]) {
          toggleLayerVisibility(entityClass.classInterfaceCategory)
        }
      }
    }}
    onMouseEnter={() => {
      setIsHovering(true)
      changeClassIdHovering(entityClassId)
    }}
    onMouseLeave={() => {
      setIsHovering(false)
      changeClassIdHovering(null)
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      openContextMenuFromClassId(entityClassId, e)
    }}
    className={classNames("ClassItem", { 'ClassItem--isPlayer': entityClassId === playerClassId })}
  >
    {isSelected && isHovering && <Icon className="ClassItem__unselect" icon="faClose"/>}
    <div className="ClassItem__texture">
      <Texture textureTint={entityClass.graphics.textureTint} textureId={entityClass.graphics.textureId}/>
    </div>
    <div className="ClassItem__name">{entityClass.name}</div>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
  playerInterface: state.playerInterface
})

export default compose(
  connect(mapStateToProps, { changeClassIdHovering, openContextMenuFromClassId, selectClass, clearClass, toggleLayerVisibility }),
)(ClassItem);
