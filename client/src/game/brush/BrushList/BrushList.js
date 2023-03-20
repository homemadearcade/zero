/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushList.scss';
import BrushItem from '../../brush/BrushItem/BrushItem';
import { openCreateBrushFlow } from '../../../store/actions/gameFormEditorActions';
import { BACKGROUND_LAYER_CANVAS_ID, FOREGROUND_LAYER_CANVAS_ID, PLAYGROUND_LAYER_CANVAS_ID } from '../../constants';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import BrushControl from '../BrushControl/BrushControl';
import LayerVisibility from '../../ui/LayerVisibility/LayerVisibility';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import LayerColorSelect from '../../color/LayerColorSelect/LayerColorSelect';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import CobrowsingAccordianList from '../../../game/cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { ADD_BRUSH_IID, BACKGROUND_LAYER_CANVAS_CONTAINER_IID, FOREGROUND_LAYER_CANVAS_CONTAINER_IID, getBrushSelectFromLayerCanvasId, PLAYGROUND_LAYER_CANVAS_CONTAINER_IID } from '../../../constants/interfaceIds';
import { sortByLastSelectedDate } from '../../../utils/editorUtils';
import { getTextureIdForLayerCanvasId } from '../../../utils';

const BrushList = ({
  gameModel: { gameModel, currentStageId },
  gameViewEditor: { layerInvisibility },
  openCreateBrushFlow,
  canvasImage: { textureIdSaving, textureIdUnsaved, textureIdStrokesPending },
}) => {
  const brushes = gameModel?.brushes

  if(!brushes) {
    return null
  }

  function renderUnsaved(textureId) {
    if(textureIdUnsaved[textureId] || textureIdSaving[textureId]) {
      return <div style={{borderRadius: '4px', backgroundColor: 'white', width: '4px', height: '4px', opacity: textureIdSaving[textureId] ? '0.5' : '1'}}></div>
    }
  }

  function renderPending(textureId) {
    if(textureIdStrokesPending[textureId]) {
      // borderRadius: '4px',
      return <div style={{backgroundColor: 'white', width: '4px', height: '4px'}}></div>
    }
  }

  const renderBrushItem = (layerCanvasId) =>  (brushId, i) => {
    const el = <BrushItem key={i} brushId={brushId}/>
    return <Unlockable interfaceId={getBrushSelectFromLayerCanvasId(layerCanvasId)}>
      {el}
    </Unlockable>
  }

  const brushesByLayer = Object.keys(brushes).reduce((prev, brushId) => {
    const brush = brushes[brushId]
    if(!prev[brush.layerCanvasId]) prev[brush.layerCanvasId] = []
    prev[brush.layerCanvasId].push(brushId)
    return prev
  }, {})

  const bgBrushes = brushesByLayer[BACKGROUND_LAYER_CANVAS_ID]?.
    sort(sortByLastSelectedDate(brushes)).
    map(renderBrushItem(BACKGROUND_LAYER_CANVAS_ID)).
    slice(0, 14) || []
  
  bgBrushes.push(<Unlockable isTiny interfaceId={ADD_BRUSH_IID}>
    <Button size="fit" onClick={() => {
      openCreateBrushFlow(BACKGROUND_LAYER_CANVAS_ID)
    }}>
    +
    </Button>
  </Unlockable>)

  const pgBrushes = brushesByLayer[PLAYGROUND_LAYER_CANVAS_ID]?.
    sort(sortByLastSelectedDate(brushes)).
    map(renderBrushItem(PLAYGROUND_LAYER_CANVAS_ID)).
    slice(0, 14) || []

  pgBrushes.push(<Unlockable isTiny interfaceId={ADD_BRUSH_IID}>
    <Button size="fit" onClick={() => {
      openCreateBrushFlow(PLAYGROUND_LAYER_CANVAS_ID)
    }}>
      +
    </Button>
  </Unlockable>)

  const fgBrushes = brushesByLayer[FOREGROUND_LAYER_CANVAS_ID]?.
    sort(sortByLastSelectedDate(brushes)).
    map(renderBrushItem(FOREGROUND_LAYER_CANVAS_ID)).
    slice(0, 14) || []

  fgBrushes.push(<Unlockable isTiny interfaceId={ADD_BRUSH_IID}>
    <Button size="fit" onClick={() => {
      openCreateBrushFlow(FOREGROUND_LAYER_CANVAS_ID)
    }}>
      +
    </Button>
  </Unlockable>)

  const accordians = []

  const hiddenOpacity = 0.5

  const backgroundTextureId = getTextureIdForLayerCanvasId(gameModel.id, currentStageId, BACKGROUND_LAYER_CANVAS_ID)
  accordians.push({
    id: 'Background',
    interfaceId: BACKGROUND_LAYER_CANVAS_CONTAINER_IID,
    sx:  layerInvisibility[BACKGROUND_LAYER_CANVAS_ID] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography  component="div" variant="subtitle1">Background</Typography>
      {renderUnsaved(backgroundTextureId)}
      {renderPending(backgroundTextureId)}
    </>,
    body: <>
      <BrushControl/>
      <LayerColorSelect withEraser layerCanvasId={BACKGROUND_LAYER_CANVAS_ID}/>
      <div className="BrushList__brushes">
        <BorderedGrid 
        maxItems={15} 
        width="2em"
        height="2em"
        items={bgBrushes}/>
      </div>
      <div className="BrushList__tools">
        <LayerVisibility layerId={BACKGROUND_LAYER_CANVAS_ID} />
      </div>
    </>
  })

  const playgroundTextureId = getTextureIdForLayerCanvasId(gameModel.id, currentStageId, PLAYGROUND_LAYER_CANVAS_ID)
  accordians.push({
    id: 'Playground',
    interfaceId: PLAYGROUND_LAYER_CANVAS_CONTAINER_IID,
    sx: layerInvisibility[PLAYGROUND_LAYER_CANVAS_ID] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">
        Playground
      </Typography>
      {renderUnsaved(playgroundTextureId)}
      {renderPending(playgroundTextureId)}
    </>,
    body: <>
      <BrushControl/>
      <LayerColorSelect withEraser layerCanvasId={PLAYGROUND_LAYER_CANVAS_ID}/>
      <div className="BrushList__brushes">
        <BorderedGrid 
          maxItems={15} 
          width="2em"
          height="2em"
          items={pgBrushes}/>
      </div>
      <div className="BrushList__tools">
        <LayerVisibility layerId={PLAYGROUND_LAYER_CANVAS_ID} />
      </div>
    </>
  })

  const foregroundTextureId = getTextureIdForLayerCanvasId(gameModel.id, currentStageId, FOREGROUND_LAYER_CANVAS_ID)
  accordians.push({
    id: 'Foreground',
    interfaceId: FOREGROUND_LAYER_CANVAS_CONTAINER_IID,
    sx: layerInvisibility[FOREGROUND_LAYER_CANVAS_ID] ? {opacity: hiddenOpacity} : {},
    title: <>
      <Typography component="div" variant="subtitle1">Foreground</Typography>
      {renderUnsaved(foregroundTextureId)}
      {renderPending(foregroundTextureId)}
    </>,
    body: <>
      <BrushControl/>
      <LayerColorSelect withEraser layerCanvasId={FOREGROUND_LAYER_CANVAS_ID}/>
      <div className="BrushList__brushes">
        <BorderedGrid 
        maxItems={15} 
        width="2em"
        height="2em"
        items={fgBrushes}/>
      </div>
      <div className="BrushList__tools">
        <LayerVisibility layerId={FOREGROUND_LAYER_CANVAS_ID} />
      </div>
    </>
  })

  return <div className="BrushList">
    <CobrowsingAccordianList
      listId="LeftColumn"
      accordians={accordians}
    />
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameViewEditor: state.gameViewEditor,
  // for the unlockability to show up
  cobrowsing: state.cobrowsing,
  canvasImage: state.canvasImage 
})


export default compose(
  connect(mapStateToProps, { openCreateBrushFlow }),
)(BrushList);
