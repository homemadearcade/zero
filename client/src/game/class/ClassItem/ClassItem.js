/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassItem.scss';
import classNames from 'classnames';
import { clearClass, selectClass } from '../../../store/actions/gameSelectorActions';
import { getCobrowsingState, mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { openContextMenuFromClassId } from '../../../store/actions/contextMenuActions';
import Sprite from '../../sprites/Sprite/Sprite';
import Icon from '../../../ui/Icon/Icon';
import { PLAYER_CLASS } from '../../constants';
import { changeClassIdHovering, toggleLayerVisibility } from '../../../store/actions/gameViewEditorActions';
import { getLayerIdFromClass } from '../../../utils/gameUtils';
import { getThemePrimaryColor } from '../../../utils/webPageUtils';

const ClassItem = ({
  gameModel: { gameModel: { classes } },
  classId,
  gameSelector: { classIdSelectedClassList },
  selectClass,
  clearClass,
  openContextMenuFromClassId,
  width, height,
  playerInterface: { playerClassId },
  toggleLayerVisibility,
  changeClassIdHovering,
  onClick,
}) => {
  const objectClass = classes[classId]
  const [isHovering, setIsHovering] = useState(false)
  const isSelected = classIdSelectedClassList === classId

  const border = '1px solid ' + getThemePrimaryColor().hexString
  return <div
    style={{width: width? width: null, height: height? height: null, border: isSelected ? border : null}}
    onClick={(e) => {
      if(onClick) onClick(e)
      if(objectClass.type === PLAYER_CLASS) return

      if(classId === classIdSelectedClassList) {
        clearClass()
      } else {
        selectClass(classId)
        const layerId = getLayerIdFromClass(objectClass)
        if(!getCobrowsingState().gameViewEditor.layerVisibility[layerId]) {
          toggleLayerVisibility(layerId)
        }
      }
    }}
    onMouseEnter={() => {
      setIsHovering(true)
      changeClassIdHovering(classId)
    }}
    onMouseLeave={() => {
      setIsHovering(false)
      changeClassIdHovering(null)
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      openContextMenuFromClassId(classId, e)
    }}
    className={classNames("ClassItem", { 'ClassItem--isPlayer': classId === playerClassId })}
  >
    {isSelected && isHovering && <Icon className="ClassItem__unselect" icon="faClose"/>}
    <div className="ClassItem__sprite">
      <Sprite tint={objectClass.graphics.tint} textureId={objectClass.graphics.textureId}/>
    </div>
    <div className="ClassItem__name">{objectClass.name}</div>
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
