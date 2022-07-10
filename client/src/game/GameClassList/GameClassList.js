/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './GameClassList.scss';
import classNames from 'classnames';
import { Button } from '@mui/material';
import { editGameModel } from '../../store/actions/gameActions';
import { clearClass, selectClass, openContextMenuFromClassId, clearBrush } from '../../store/actions/editorActions';
import Loader from '../../components/ui/Loader/Loader';

const GameClassList = ({
  game: { gameModel },
  editor: { editorState: { classSelectedIdClassList }},
  editGameModel,
  selectClass,
  clearClass,
  clearBrush,
  openContextMenuFromClassId
}) => {
  const classes = gameModel?.classes

  if(!classes) {
    return <Loader text="No Game Loaded"/>
  }

  return <div className="GameClassList">
    {Object.keys(classes).map((currentClassId, i) => {
      const currentClass = classes[currentClassId]
      return <div
        key={i} 
        onClick={() => {
          if(currentClassId === classSelectedIdClassList) {
            clearClass()
          } else {
            clearBrush()
            selectClass(currentClassId)
          }
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          openContextMenuFromClassId(currentClassId, e)
        }}
        className={classNames("GameClassList__class", { 'GameClassList__class--selected': classSelectedIdClassList === currentClassId})}
      >
        {currentClassId}
      </div>
    })}
    <Button className="GameClassList__add" onClick={() => {
      const classId = uuidv4()
      editGameModel({
        classes: {
          [classId] : {}
        }
      })
    }}>
      Add New Class
    </Button>
  </div>
};

const mapStateToProps = (state) => ({
  game: state.game,
  editor: state.editor
});

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, editGameModel, selectClass, clearClass, clearBrush }),
)(GameClassList);
