/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ClassItem.scss';
import classNames from 'classnames';
import { clearClass, selectClass, openContextMenuFromClassId, clearBrush } from '../../store/actions/editorActions';
import Sprite from '../Sprite/Sprite';

const ClassItem = ({
  game: { gameModel: { classes } },
  classId,
  editor: { editorState: { classSelectedIdClassList }},
  selectClass,
  clearClass,
  clearBrush,
  openContextMenuFromClassId
}) => {
  const objectClass = classes[classId]

  return <div
    onClick={() => {
      if(objectClass.type === 'hero') return

      if(classId === classSelectedIdClassList) {
        clearClass()
      } else {
        clearBrush()
        selectClass(classId)
      }
    }}
    onContextMenu={(e) => {
      e.preventDefault();
      openContextMenuFromClassId(classId, e)
    }}
    className={classNames("ClassItem", { 'ClassItem--selected': classSelectedIdClassList === classId})}
  >
    {objectClass.textureId && <Sprite textureId={objectClass.textureId} width={50} height={50}/>}
    {objectClass.name || objectClass.descriptors ? objectClass.descriptors[0] : classId}
  </div>
};

const mapStateToProps = (state) => ({
  game: state.game,
  editor: state.editor
});

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, selectClass, clearClass, clearBrush }),
)(ClassItem);
