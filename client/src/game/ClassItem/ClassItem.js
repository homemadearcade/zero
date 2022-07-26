/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassItem.scss';
import classNames from 'classnames';
import { clearClass, selectClass } from '../../store/actions/editorActions';
import Sprite from '../ui/Sprite/Sprite';
import { mapCobrowsingState } from '../../utils/cobrowsing';
import { openContextMenuFromClassId } from '../../store/actions/contextMenuActions';

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
    {objectClass.textureId && <Sprite textureId={objectClass.textureId} width={50} height={50}/>}
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
