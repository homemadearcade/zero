/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushList.scss';
import BrushItem from '../../brush/BrushItem/BrushItem';
import { openCreateBrushFlow } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import BrushControl from '../BrushControl/BrushControl';
import LayerVisibility from '../../ui/LayerVisibility/LayerVisibility';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import LayerColorSelect from '../../color/LayerColorSelect/LayerColorSelect';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import CobrowsingAccordianList from '../../../game/cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { BRUSH_ADD_IID, BRUSH_SELECT_IID } from '../../../constants/interfaceIds';
import { sortByLastSelectedDate } from '../../../utils/editorUtils';

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

  const stage = gameModel.stages[currentStageId]

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

  const renderBrushItem = (layerId) =>  (brushId, i) => {
    const el = <BrushItem key={i} brushId={brushId}/>
    return <Unlockable interfaceId={BRUSH_SELECT_IID}>
      {el}
    </Unlockable>
  }

  const brushesByLayer = Object.keys(brushes).reduce((prev, brushId) => {
    const brush = brushes[brushId]
    if(!prev[brush.layerId]) prev[brush.layerId] = []
    prev[brush.layerId].push(brushId)
    return prev
  }, {})

  const accordians = []
  const hiddenOpacity = 0.5
  Object.keys(stage.layers).forEach((layerId) => {
    const layer = stage.layers[layerId]

    const layerBrushes = brushesByLayer[layerId]?.
    sort(sortByLastSelectedDate(brushes)).
    map(renderBrushItem(layerId)).
    slice(0, 14) || []
  
    layerBrushes.push(<Unlockable isTiny interfaceId={BRUSH_ADD_IID}>
      <Button size="fit" onClick={() => {
        openCreateBrushFlow(layerId)
      }}>
      +
      </Button>
    </Unlockable>)

    accordians.push({
      interfaceId: layer.layerGroupIID,
      sx:  layerInvisibility[layerId] ? {opacity: hiddenOpacity} : {},
      title: <>
        <Typography  component="div" variant="subtitle1">{layer.name}</Typography>
        {renderUnsaved(layer.textureId)}
        {renderPending(layer.textureId)}
      </>,
      body: <>
        <BrushControl/>
        <LayerColorSelect withEraser layerId={layerId}/>
        <div className="BrushList__brushes">
          <BorderedGrid 
          maxItems={15} 
          width="2em"
          height="2em"
          items={layerBrushes}/>
        </div>
        <div className="BrushList__tools">
          <LayerVisibility layerId={layerId} />
        </div>
      </>
    })
  })

  return <div className="BrushList">
    <CobrowsingAccordianList
      interfaceGroupId="SelectorColumns"
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
