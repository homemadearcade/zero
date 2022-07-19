/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './BrushList.scss';
import { Button, FormLabel } from '@mui/material';
import { editGameModel } from '../../store/actions/gameActions';
import Loader from '../../app/ui/Loader/Loader';
import BrushItem from '../BrushItem/BrushItem';
import CreateBrushFlow from '../CreateBrushFlow/CreateBrushFlow';
import { closeCreateBrushFlow, openCreateBrushFlow } from '../../store/actions/editorFormsActions';
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import { updateBrushSize } from '../../store/actions/editorActions';
import { BACKGROUND_LAYER_DEPTH, OVERHEAD_LAYER_DEPTH, PLAYGROUND_LAYER_DEPTH } from '../../constants';

const BrushList = ({
  game: { gameModel },
  updateBrushSize,
  editorState: { brushSize },
  editorFormsState: { isCreateBrushFlowOpen },
  editGameModel,
  closeCreateBrushFlow,
  openCreateBrushFlow
}) => {
  const brushes = gameModel?.brushes

  if(!brushes) {
    return <Loader text="No Game Loaded"/>
  }

  const brushesByLayer = Object.keys(brushes).reduce((prev, brushId) => {
    const brush = brushes[brushId]
    if(!prev[brush.layer]) prev[brush.layer] = []
    prev[brush.layer].push({ brushId, brush })
    return prev
  }, {})

  return <>
    <div className="BrushList">
      <div className="BrushList__size">
        <FormLabel>Brush Size</FormLabel>
        <SliderNotched
          step={null}
          options={[1, 2, 5, 10, 20]}
          onChangeCommitted={(value) => {
            updateBrushSize(value)        
          }}
          value={brushSize}
        />
      </div>
      <h4>Background</h4>
      {brushesByLayer[BACKGROUND_LAYER_DEPTH]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}
      <h4>Playground</h4>
      {brushesByLayer[PLAYGROUND_LAYER_DEPTH]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}
      <h4>Overhead</h4>
      {brushesByLayer[OVERHEAD_LAYER_DEPTH]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}
      <Button className="BrushList__add" onClick={() => {
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
    editorState: isCobrowsing ? state.cobrowsing.remoteState.editor : state.editor.editorState,
  }
};


export default compose(
  connect(mapStateToProps, { editGameModel, openCreateBrushFlow, updateBrushSize, closeCreateBrushFlow }),
)(BrushList);
