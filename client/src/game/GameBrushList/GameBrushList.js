/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './GameBrushList.scss';
import { Button } from '@mui/material';
import { editGameModel } from '../../store/actions/gameActions';
import Loader from '../../components/ui/Loader/Loader';
import BrushItem from '../BrushItem/BrushItem';
import CreateBrushFlow from '../CreateBrushFlow/CreateBrushFlow';
import { closeCreateBrushFlow, openCreateBrushFlow } from '../../store/actions/editorFormsActions';

const GameBrushList = ({
  game: { gameModel },
  editorFormsState: { isCreateBrushFlowOpen },
  editGameModel,
  closeCreateBrushFlow,
  openCreateBrushFlow
}) => {
  const brushes = gameModel?.brushes

  if(!brushes) {
    return <Loader text="No Game Loaded"/>
  }

  return <>
    <div className="GameBrushList">
      {Object.keys(brushes).map((brushId, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}
      <Button className="GameBrushList__add" onClick={() => {
        openCreateBrushFlow()
      }}>
        Add New Brush
      </Button>
    </div>
    {isCreateBrushFlowOpen && <CreateBrushFlow 
      onClose={() => {
        closeCreateBrushFlow()
      }}
      onComplete={(brush) => {
        const brushId = uuidv4()
        
        editGameModel({
          brushes: {
            [brushId] : brush
          }
        })

        closeCreateBrushFlow()
      }}
    />}
  </>
};

const mapStateToProps = (state) => {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing

  return {
    game: state.game,
    editorFormsState: isCobrowsing ? state.cobrowsing.remoteState.editorForms : state.editorForms.editorFormsState,
  }
};


export default compose(
  connect(mapStateToProps, { editGameModel, openCreateBrushFlow, closeCreateBrushFlow }),
)(GameBrushList);
