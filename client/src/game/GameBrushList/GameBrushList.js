/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './GameBrushList.scss';
import classNames from 'classnames';
import { Button } from '@mui/material';
import { editGameModel } from '../../store/actions/gameActions';
import { clearClass, clearBrush, selectBrush, openContextMenuFromClassId } from '../../store/actions/editorActions';
import Loader from '../../components/ui/Loader/Loader';

const GameBrushList = ({
  game: { gameModel },
  editor: { editorState: { brushSelectedIdBrushList }},
  editGameModel,
  selectBrush,
  clearClass,
  clearBrush,
}) => {
  const brushes = gameModel?.brushes

  if(!brushes) {
    return <Loader text="No Game Loaded"/>
  }

  return <div className="GameBrushList">
    {Object.keys(brushes).map((brushId, i) => {
      const currentBrush = brushes[brushId]
      return <div
        key={i} 
        onClick={() => {
          if(brushId === brushSelectedIdBrushList) {
            clearBrush()
          } else {
            clearClass()
            selectBrush(brushId)
          }
        }}
        className={classNames("GameBrushList__brush", { 'GameBrushList__brush--selected': brushSelectedIdBrushList === brushId})}
      >
        {brushId}
      </div>
    })}
    <Button className="GameBrushList__add" onClick={() => {
      const brushId = uuidv4()
      editGameModel({
        brushes: {
          [brushId] : {}
        }
      })
    }}>
      Add New Brush
    </Button>
  </div>
};

const mapStateToProps = (state) => ({
  game: state.game,
  editor: state.editor
});

export default compose(
  connect(mapStateToProps, { openContextMenuFromClassId, editGameModel, selectBrush, clearBrush, clearClass }),
)(GameBrushList);
