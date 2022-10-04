/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassItem.scss';
import classNames from 'classnames';
import { clearClass, selectClass } from '../../store/actions/editorActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { openContextMenuFromClassId } from '../../store/actions/contextMenuActions';
import Sprite from '../ui/Sprite/Sprite';
import Icon from '../../app/ui/Icon/Icon';

const ClassItem = ({
  game: { gameModel: { classes } },
  classId,
  editor: { classIdSelectedClassList },
  selectClass,
  clearClass,
  openContextMenuFromClassId
}) => {
  const objectClass = classes[classId]
  const [isHovering, setIsHovering] = useState(false)
  const isSelected = classIdSelectedClassList === classId

  return <div
    onClick={() => {
      if(objectClass.type === 'hero') return

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
      <Sprite tint={objectClass.tint} textureId={objectClass.textureId}/>
    </div>
    <div className="ClassItem__name">{objectClass.name}</div>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editor: state.editor,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectClass, clearClass }),
)(ClassItem);
