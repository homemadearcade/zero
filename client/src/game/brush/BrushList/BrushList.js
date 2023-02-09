/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushList.scss';
import BrushItem from '../../brush/BrushItem/BrushItem';
import { openCreateBrushFlow } from '../../../store/actions/gameFormEditorActions';
import { BACKGROUND_CANVAS_ID, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID } from '../../constants';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import BrushControl from '../BrushControl/BrushControl';
import LayerVisibility from '../../ui/LayerVisibility/LayerVisibility';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import LayerColorSelect from '../../color/LayerColorSelect/LayerColorSelect';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import CobrowsingAccordianList from '../../../game/cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { ADD_BRUSH_IID, BACKGROUND_CANVAS_CONTAINER_IID, FOREGROUND_CANVAS_CONTAINER_IID, getBrushSelectFromCanvasId, PLAYGROUND_CANVAS_CONTAINER_IID } from '../../../constants/interfaceIds';

const BrushList = ({
  gameModel: { gameModel },
  gameViewEditor: { layerVisibility },
  openCreateBrushFlow,
}) => {
  const brushes = gameModel?.brushes

  if(!brushes) {
    return null
  }

  const renderBrushItem = (canvasId) =>  ({brushId}, i) => {
    const el = <BrushItem key={i} brushId={brushId}/>
    return <Unlockable interfaceId={getBrushSelectFromCanvasId(canvasId)}>
      {el}
    </Unlockable>
  }

  const brushesByLayer = Object.keys(brushes).reduce((prev, brushId) => {
    const brush = brushes[brushId]
    if(!prev[brush.canvasId]) prev[brush.canvasId] = []
    prev[brush.canvasId].push({ brushId, brush })
    return prev
  }, {})

  const bgBrushes = brushesByLayer[BACKGROUND_CANVAS_ID]?.map(
    renderBrushItem(BACKGROUND_CANVAS_ID)
  ).slice(0, 14) || []
  
  bgBrushes.push(<Unlockable isTiny interfaceId={ADD_BRUSH_IID}>
    <Button size="fit" onClick={() => {
      openCreateBrushFlow(BACKGROUND_CANVAS_ID)
    }}>
    +
    </Button>
  </Unlockable>)

  const pgBrushes = brushesByLayer[PLAYGROUND_CANVAS_ID]?.map(
    renderBrushItem(PLAYGROUND_CANVAS_ID)
  ).slice(0, 14) || []

  pgBrushes.push(<Unlockable isTiny interfaceId={ADD_BRUSH_IID}>
    <Button size="fit" onClick={() => {
      openCreateBrushFlow(PLAYGROUND_CANVAS_ID)
    }}>
      +
    </Button>
  </Unlockable>)

  const fgBrushes = brushesByLayer[FOREGROUND_CANVAS_ID]?.map(
    renderBrushItem(FOREGROUND_CANVAS_ID)
  ).slice(0, 14) || []

  fgBrushes.push(<Unlockable isTiny interfaceId={ADD_BRUSH_IID}>
    <Button size="fit" onClick={() => {
      openCreateBrushFlow(FOREGROUND_CANVAS_ID)
    }}>
      +
    </Button>
  </Unlockable>)

  const accordians = []

  const hiddenOpacity = 0.5
  accordians.push({
    id: 'Background',
    interfaceId: BACKGROUND_CANVAS_CONTAINER_IID,
    title: <>
      <Typography sx={!layerVisibility[BACKGROUND_CANVAS_ID] ? {opacity: hiddenOpacity} : {}} component="div" variant="subtitle1">Background</Typography>
    </>,
    body: <>
      <div className="BrushList__tools">
        <LayerVisibility canvasId={BACKGROUND_CANVAS_ID} />
      </div>
      <LayerColorSelect withEraser canvasId={BACKGROUND_CANVAS_ID}/>
      <div className="BrushList__brushes">
        <BorderedGrid 
        maxItems={15} 
        width="3.5vh"
        height="3.5vh"
        items={bgBrushes}/>
      </div>
    </>
  })

  accordians.push({
    id: 'Playground',
    interfaceId: PLAYGROUND_CANVAS_CONTAINER_IID,
    title: <>
      <Typography  sx={!layerVisibility[PLAYGROUND_CANVAS_ID] ? {opacity: hiddenOpacity} : {}}  component="div" variant="subtitle1">Playground</Typography>
    </>,
    body: <>
     <div className="BrushList__tools">
        <LayerVisibility canvasId={PLAYGROUND_CANVAS_ID} />
      </div>
      <LayerColorSelect withEraser canvasId={PLAYGROUND_CANVAS_ID}/>
      <div className="BrushList__brushes">
        <BorderedGrid 
          maxItems={15} 
          width="3.5vh"
          height="3.5vh"
          items={pgBrushes}/>
      </div>
    </>
  })

  accordians.push({
    id: 'Foreground',
    interfaceId: FOREGROUND_CANVAS_CONTAINER_IID,
    title: <>
      <Typography  sx={!layerVisibility[FOREGROUND_CANVAS_ID] ? {opacity: hiddenOpacity} : {}} component="div" variant="subtitle1">Foreground</Typography>
    </>,
    body: <>
      <div className="BrushList__tools">
        <LayerVisibility canvasId={FOREGROUND_CANVAS_ID} />
      </div>
      <LayerColorSelect withEraser canvasId={FOREGROUND_CANVAS_ID}/>
      <div className="BrushList__brushes">
        <BorderedGrid 
        maxItems={15} 
        width="3.5vh"
        height="3.5vh"
        items={fgBrushes}/>
      </div>
    </>
  })

  return <div className="BrushList">
    <BrushControl/>
    <CobrowsingAccordianList
      listId="BrushList"
      accordians={accordians}
    />
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameViewEditor: state.gameViewEditor,
  // for the unlockability to show up
  cobrowsing: state.cobrowsing
})


export default compose(
  connect(mapStateToProps, { openCreateBrushFlow }),
)(BrushList);
