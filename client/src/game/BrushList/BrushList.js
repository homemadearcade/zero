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
import { BACKGROUND_CANVAS_ID, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID } from '../../constants';
import Button from '../../app/ui/Button/Button';
import Typography from '../../app/ui/Typography/Typography';
import BrushControl from '../BrushControl/BrushControl';
import EraserSelect from '../ui/EraserSelect/EraserSelect';
import LayerVisibility from '../ui/LayerVisibility/LayerVisibility';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import LayerColorSelect from '../LayerColorSelect/LayerColorSelect';
import BorderedGrid from '../../app/ui/BorderedGrid/BorderedGrid';
import CobrowsingAccordianList from '../../app/cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';

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

  const bgBrushes = brushesByLayer[BACKGROUND_CANVAS_ID]?.map(({brushId}, i) => {
    return <BrushItem key={i} brushId={brushId}/>
  }).slice(0, 14) || []
  
  bgBrushes.push(<Button size="fit" onClick={() => {
    openCreateBrushFlow(BACKGROUND_CANVAS_ID)
  }}>
    +
  </Button>)

  const pgBrushes = brushesByLayer[PLAYGROUND_CANVAS_ID]?.map(({brushId}, i) => {
    return <BrushItem key={i} brushId={brushId}/>
  }).slice(0, 14) || []

  pgBrushes.push(<Button size="fit" onClick={() => {
    openCreateBrushFlow(PLAYGROUND_CANVAS_ID)
  }}>
    +
  </Button>)

  const fgBrushes = brushesByLayer[FOREGROUND_CANVAS_ID]?.map(({brushId}, i) => {
    return <BrushItem key={i} brushId={brushId}/>
  }).slice(0, 14) || []

  fgBrushes.push(<Button size="fit" onClick={() => {
    openCreateBrushFlow(FOREGROUND_CANVAS_ID)
  }}>
    +
  </Button>)

  return <div className="BrushList">
    <BrushControl/>
    <CobrowsingAccordianList
      listId="BrushList"
      accordians={[
        {
          id: 'Background',
          title: <>
            <Typography component="div" variant="subtitle1">Background</Typography>
            <LayerVisibility canvasId={BACKGROUND_CANVAS_ID} />
          </>,
          body: <>
            <EraserSelect canvasId={BACKGROUND_CANVAS_ID}/>
            <LayerColorSelect canvasId={BACKGROUND_CANVAS_ID}/>
            <div className="BrushList__brushes">
              <BorderedGrid 
              maxItems={15} 
              size="3.5vh"
              items={bgBrushes}/>
            </div>
          </>
        },
        {
          id: 'Playground',
          title: <>
            <Typography component="div" variant="subtitle1">Playground</Typography>
            <LayerVisibility canvasId={PLAYGROUND_CANVAS_ID} />
          </>,
          body: <>
            <EraserSelect canvasId={PLAYGROUND_CANVAS_ID}/>
            <LayerColorSelect canvasId={PLAYGROUND_CANVAS_ID}/>
            <div className="BrushList__brushes">
              <BorderedGrid 
                maxItems={15} 
                size="3.5vh"
                items={pgBrushes}/>
            </div>
          </>
      },
      {
        id: 'Foreground',
        title: <>
          <Typography component="div" variant="subtitle1">Foreground</Typography>
          <LayerVisibility canvasId={FOREGROUND_CANVAS_ID} />
        </>,
        body: <>
          <EraserSelect canvasId={FOREGROUND_CANVAS_ID}/>
          <LayerColorSelect canvasId={FOREGROUND_CANVAS_ID}/>
          <div className="BrushList__brushes">
            <BorderedGrid 
            maxItems={15} 
            size="3.5vh"
            items={fgBrushes}/>
          </div>
        </>
        }
      ]}
    />
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

    }}/>
  }
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editorForms: state.editorForms,
})


export default compose(
  connect(mapStateToProps, { editGameModel, openCreateBrushFlow }),
)(BrushList);
