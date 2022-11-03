/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassItem.scss';
import classNames from 'classnames';
import { clearClass, selectClass } from '../../../store/actions/gameEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { openContextMenuFromClassId } from '../../../store/actions/contextMenuActions';
import Sprite from '../../sprites/Sprite/Sprite';
import Icon from '../../../ui/Icon/Icon';
import { HERO_CLASS } from '../../constants';

const ClassItem = ({
  game: { gameModel: { classes } },
  classId,
  gameEditor: { classIdSelectedClassList },
  selectClass,
  clearClass,
  openContextMenuFromClassId,
  width, height
}) => {
  const objectClass = classes[classId]
  const [isHovering, setIsHovering] = useState(false)
  const isSelected = classIdSelectedClassList === classId

  return <div
    style={{width: width? width: null, height: height? height: null}}
    onClick={() => {
      if(objectClass.type === HERO_CLASS) return

      if(classId === classIdSelectedClassList) {
        clearClass()
      } else {
        selectClass(classId)
      }
    }}
    onMouseEnter={() => {
      setIsHovering(true)
    }}
    onMouseLeave={() => {
      setIsHovering(false)
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      openContextMenuFromClassId(classId, e)
    }}
    className={classNames("ClassItem", { 'ClassItem--selected': isSelected})}
  >
    {isSelected && isHovering && <Icon className="ClassItem__unselect" icon="faClose"/>}
    <div className="ClassItem__sprite">
      <Sprite tint={objectClass.graphics.tint} textureId={objectClass.graphics.textureId}/>
    </div>
    <div className="ClassItem__name">{objectClass.name}</div>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  gameEditor: state.gameEditor,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectClass, clearClass }),
)(ClassItem);
