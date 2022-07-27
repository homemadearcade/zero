/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassItem.scss';
import classNames from 'classnames';
import { clearClass, selectClass } from '../../store/actions/editorActions';
import { mapCobrowsingState } from '../../utils/cobrowsing';
import { openContextMenuFromClassId } from '../../store/actions/contextMenuActions';
import CanvasSprite from '../ui/CanvasSprite/CanvasSprite';

const ClassItem = ({
  game: { gameModel: { classes } },
  classId,
  editor: { classIdSelectedClassList },
  selectClass,
  clearClass,
  openContextMenuFromClassId
}) => {
  const objectClass = classes[classId]

  return <div
    onClick={() => {
      if(objectClass.type === 'hero') return

      if(classId === classIdSelectedClassList) {
        clearClass()
      } else {
        selectClass(classId)
      }
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      openContextMenuFromClassId(classId, e)
    }}
    className={classNames("ClassItem", { 'ClassItem--selected': classIdSelectedClassList === classId})}
  >
    <div className="ClassItem__sprite">
      <CanvasSprite tint={objectClass.tint} textureId={objectClass.textureId}/>
    </div>
    {objectClass.name || objectClass.descriptors ? objectClass.descriptors[0] : classId}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editor: state.editor,
})

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectClass, clearClass }),
)(ClassItem);
