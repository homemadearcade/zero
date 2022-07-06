/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './GameClassList.scss';
import classNames from 'classnames';
import { Button } from '@mui/material';
import { editGameModel } from '../../store/actions/gameActions';
import { clearClass, selectClass } from '../../store/actions/editorActions';

const GameClassList = ({
  game: { gameModel, gameModel : { classes }},
  editor: { editorState: { classSelectedId }},
  editGameModel,
  selectClass,
  clearClass
}) => {
  return <div className="GameClassList">
    {Object.keys(classes).map((currentClassId, i) => {
      const currentClass = classes[currentClassId]
      return <div key={i} onClick={() => {
        if(currentClassId === classSelectedId) {
          clearClass()
        } else {
          selectClass(currentClassId)
        }
      }} className={classNames("GameClassList__class", { 'GameClassList__class--selected': classSelectedId === currentClassId})}>
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
  connect(mapStateToProps, { editGameModel, selectClass, clearClass }),
)(GameClassList);
