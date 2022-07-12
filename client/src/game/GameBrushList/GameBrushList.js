/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './GameBrushList.scss';
import { Button } from '@mui/material';
import { editGameModel } from '../../store/actions/gameActions';
import Loader from '../../components/ui/Loader/Loader';
import BrushItem from '../BrushItem/BrushItem';

const GameBrushList = ({
  game: { gameModel },
  editGameModel,
}) => {
  const brushes = gameModel?.brushes

  if(!brushes) {
    return <Loader text="No Game Loaded"/>
  }

  return <div className="GameBrushList">
    {Object.keys(brushes).map((brushId, i) => {
      return <BrushItem key={i} brushId={brushId}/>
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
});

export default compose(
  connect(mapStateToProps, { editGameModel }),
)(GameBrushList);
