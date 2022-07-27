/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import './BrushList.scss';
import { editGameModel } from '../../store/actions/gameActions';
import BrushItem from '../BrushItem/BrushItem';
import CreateBrushFlow from '../CreateBrushFlow/CreateBrushFlow';
import { openCreateBrushFlow } from '../../store/actions/editorFormsActions';
import { BACKGROUND_CANVAS_ID, OVERHEAD_CANVAS_ID, PLAYGROUND_CANVAS_ID } from '../../constants';
import Button from '../../app/ui/Button/Button';
import Typography from '../../app/ui/Typography/Typography';
import BrushControl from '../BrushControl/BrushControl';
import EraserSelect from '../ui/EraserSelect/EraserSelect';
import LayerVisibility from '../ui/LayerVisibility/LayerVisibility';
import { mapCobrowsingState } from '../../utils/cobrowsing';
import LayerColorSelect from '../LayerColorSelect/LayerColorSelect';

const BrushList = ({
  game: { gameModel },
  editorForms: { isCreateBrushFlowOpen },
  editGameModel,
  openCreateBrushFlow,
}) => {
  const brushes = gameModel?.brushes

  if(!brushes) {
    return null
  }

  const brushesByLayer = Object.keys(brushes).reduce((prev, brushId) => {
    const brush = brushes[brushId]
    if(!prev[brush.canvasId]) prev[brush.canvasId] = []
    prev[brush.canvasId].push({ brushId, brush })
    return prev
  }, {})

  return <>
    <div className="BrushList">
      <BrushControl/>
      <Typography component="h5" variant="h5">Background</Typography>
      <LayerVisibility canvasId={BACKGROUND_CANVAS_ID} />
      <EraserSelect canvasId={BACKGROUND_CANVAS_ID}/>
      <LayerColorSelect canvasId={BACKGROUND_CANVAS_ID}/>
      <div className="BrushList__brushes">{brushesByLayer[BACKGROUND_CANVAS_ID]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}</div>
      <Button className="BrushList__add" onClick={() => {
        openCreateBrushFlow(BACKGROUND_CANVAS_ID)
      }}>
        +
      </Button>
      <Typography component="h5" variant="h5">Playground</Typography>
      <LayerVisibility canvasId={PLAYGROUND_CANVAS_ID} />
      <EraserSelect canvasId={PLAYGROUND_CANVAS_ID}/>
      <LayerColorSelect canvasId={PLAYGROUND_CANVAS_ID}/>
      <div className="BrushList__brushes">{brushesByLayer[PLAYGROUND_CANVAS_ID]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}</div>
      <Button className="BrushList__add" onClick={() => {
        openCreateBrushFlow(PLAYGROUND_CANVAS_ID)
      }}>
        +
      </Button>
      <Typography component="h5" variant="h5">Overhead</Typography>
      <LayerVisibility canvasId={OVERHEAD_CANVAS_ID} />
      <EraserSelect canvasId={OVERHEAD_CANVAS_ID}/>
      <LayerColorSelect canvasId={OVERHEAD_CANVAS_ID}/>
      <div className="BrushList__brushes">{brushesByLayer[OVERHEAD_CANVAS_ID]?.map(({brushId}, i) => {
        return <BrushItem key={i} brushId={brushId}/>
      })}</div>
      <Button className="BrushList__add" onClick={() => {
        openCreateBrushFlow(OVERHEAD_CANVAS_ID)
      }}>
        +
      </Button>
    </div>
    {isCreateBrushFlowOpen && <CreateBrushFlow 
      onComplete={(brush) => {
        if(!brush.textureId) {   
          if(brush.tint) {
            editGameModel({
              colors: {
                [brush.tint]: {
                  [brush.canvasId]: true
                }
              }
            })
          }
        } else {
          const brushId = uuidv4()
          editGameModel({
            brushes: {
              [brushId] : brush
            }
          })
        }

      }}
    />}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editorForms: state.editorForms,
})


export default compose(
  connect(mapStateToProps, { editGameModel, openCreateBrushFlow }),
)(BrushList);
