/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './BrushList.scss';
import { editGameModel } from '../../store/actions/gameActions';
import Loader from '../../app/ui/Loader/Loader';
import BrushItem from '../BrushItem/BrushItem';
import CreateBrushFlow from '../CreateBrushFlow/CreateBrushFlow';
import { closeCreateBrushFlow, openCreateBrushFlow } from '../../store/actions/editorFormsActions';
import { BACKGROUND_LAYER_DEPTH, OVERHEAD_LAYER_DEPTH, PLAYGROUND_LAYER_DEPTH } from '../../constants';
import Button from '../../app/ui/Button/Button';
import Typography from '../../app/ui/Typography/Typography';
import BrushControl from '../BrushControl/BrushControl';
import Eraser from '../ui/Eraser/Eraser';

const BrushList = ({
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

  const brushesByLayer = Object.keys(brushes).reduce((prev, brushId) => {
    const brush = brushes[brushId]
    if(!prev[brush.layer]) prev[brush.layer] = []
    prev[brush.layer].push({ brushId, brush })
    return prev
  }, {})

  return <>
    <div className="BrushList">
      <BrushControl/>
      <Typography component="h5" variant="h5">Background</Typography>
      <Eraser depth={BACKGROUND_LAYER_DEPTH}/>
      {brushesByLayer[BACKGROUND_LAYER_DEPTH]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}
      <Typography component="h5" variant="h5">Playground</Typography>
      <Eraser depth={PLAYGROUND_LAYER_DEPTH}/>
      {brushesByLayer[PLAYGROUND_LAYER_DEPTH]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}
      <Typography component="h5" variant="h5">Overhead</Typography>
      <Eraser depth={OVERHEAD_LAYER_DEPTH}/>
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
  }
};


export default compose(
  connect(mapStateToProps, { editGameModel, openCreateBrushFlow, closeCreateBrushFlow }),
)(BrushList);
