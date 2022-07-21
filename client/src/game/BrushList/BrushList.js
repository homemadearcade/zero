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
import { BACKGROUND_LAYER_ID, OVERHEAD_LAYER_ID, PLAYGROUND_LAYER_ID } from '../../constants';
import Button from '../../app/ui/Button/Button';
import Typography from '../../app/ui/Typography/Typography';
import BrushControl from '../BrushControl/BrushControl';
import EraserSelect from '../ui/EraserSelect/EraserSelect';
import LayerVisibility from '../ui/LayerVisibility/LayerVisibility';
import { mapCobrowsingState } from '../../utils/cobrowsing';

const BrushList = ({
  game: { gameModel },
  editorFormsState: { isCreateBrushFlowOpen },
  editGameModel,
  closeCreateBrushFlow,
  openCreateBrushFlow
}) => {
  const brushes = gameModel?.brushes

  if(!brushes) {
    return null
  }

  const brushesByLayer = Object.keys(brushes).reduce((prev, brushId) => {
    const brush = brushes[brushId]
    if(!prev[brush.layerId]) prev[brush.layerId] = []
    prev[brush.layerId].push({ brushId, brush })
    return prev
  }, {})

  return <>
    <div className="BrushList">
      <BrushControl/>
      <Typography component="h5" variant="h5">Background</Typography>
      <LayerVisibility layerId={BACKGROUND_LAYER_ID} />
      <EraserSelect layerId={BACKGROUND_LAYER_ID}/>
      <div className="BrushList__brushes">{brushesByLayer[BACKGROUND_LAYER_ID]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}</div>
      <Button className="BrushList__add" onClick={() => {
        openCreateBrushFlow(BACKGROUND_LAYER_ID)
      }}>
        +
      </Button>
      <Typography component="h5" variant="h5">Playground</Typography>
      <LayerVisibility layerId={PLAYGROUND_LAYER_ID} />
      <EraserSelect layerId={PLAYGROUND_LAYER_ID}/>
      <div className="BrushList__brushes">{brushesByLayer[PLAYGROUND_LAYER_ID]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}</div>
      <Button className="BrushList__add" onClick={() => {
        openCreateBrushFlow(PLAYGROUND_LAYER_ID)
      }}>
        +
      </Button>
      <Typography component="h5" variant="h5">Overhead</Typography>
      <LayerVisibility layerId={OVERHEAD_LAYER_ID} />
      <EraserSelect layerId={OVERHEAD_LAYER_ID}/>
      <div className="BrushList__brushes">{brushesByLayer[OVERHEAD_LAYER_ID]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}</div>
      <Button className="BrushList__add" onClick={() => {
        openCreateBrushFlow(OVERHEAD_LAYER_ID)
      }}>
        +
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

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editorFormsState: state.editorForms.editorFormsState,
})


export default compose(
  connect(mapStateToProps, { editGameModel, openCreateBrushFlow, closeCreateBrushFlow }),
)(BrushList);
