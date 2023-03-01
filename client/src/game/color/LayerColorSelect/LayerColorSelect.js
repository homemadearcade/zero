/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LayerColorSelect.scss';
import { BACKGROUND_CANVAS_ID, COLOR_BRUSH_ID, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID } from '../../constants';
import { openCreateColorFlow } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CreateColorFlow from '../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/gameModelActions';
import ColorSelect from '../ColorSelect/ColorSelect';
import { clearBrush, openSelectAggregateColor, selectBrush } from '../../../store/actions/gameSelectorActions';
import { getHexFromColorId, getCanvasIdFromColorId, isBrushIdColor, sortColorByLastSelectedDate } from '../../../utils/editorUtils';
import AggregateColorSelectModal from '../AggregateColorSelectModal/AggregateColorSelectModal';

const LayerColorSelect = ({
  gameModel: { gameModel : { colors }},
  canvasId,
  openCreateColorFlow,
  openSelectAggregateColor,
  editGameModel,
  selectBrush,
  clearBrush,
  gameSelector: { brushIdSelectedBrushList, isSelectAggregateColorOpen },
  gameFormEditor: { isCreateColorFlowOpen },
  withEraser
}) => {
  const colorsByLayer = Object.keys(colors).reduce((prev, hex) => {
    const color = colors[hex]
    Object.keys(color).forEach((canvasId) => {
      if(!color[canvasId]) return
      if(!prev[canvasId]) prev[canvasId] = []
      prev[canvasId].push(hex)
    })
    return prev
  }, {})

  function onAddColor() {
    if(Object.keys(colors).length) {
      openSelectAggregateColor('LayerColorSelect' + canvasId)
    } else {
      openCreateColorFlow('LayerColorSelect' + canvasId, canvasId)
    }
  }

  function onSelectColor(hex) {
    if(!colors[hex] || !colors[hex][canvasId]) {
      editGameModel({
        colors: {
          [hex]: {
            [canvasId]: Date.now()
          }
        }
      })
    }

    selectBrush(COLOR_BRUSH_ID + '/' + canvasId + '/' + hex, canvasId)
  }

  function onUnselectColor() {
    clearBrush()
  }

  function renderColorSelect() {
    let selectedColorHex
    let selectedColorLayer
    if(brushIdSelectedBrushList) {
      if(isBrushIdColor(brushIdSelectedBrushList)) {
        selectedColorHex = getHexFromColorId(brushIdSelectedBrushList)
        selectedColorLayer = getCanvasIdFromColorId(brushIdSelectedBrushList)
      }
    }

    if(canvasId === BACKGROUND_CANVAS_ID) {
      return <ColorSelect 
        withEraser={withEraser}
        canvasId={canvasId}
        maxColors={16}
        selectedColorHex={selectedColorLayer === BACKGROUND_CANVAS_ID && selectedColorHex} 
        colors={colorsByLayer[BACKGROUND_CANVAS_ID]?.sort(sortColorByLastSelectedDate(colors, BACKGROUND_CANVAS_ID))} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor}
      />
    }
    if(canvasId === PLAYGROUND_CANVAS_ID) {
      return <ColorSelect 
        withEraser={withEraser}
        canvasId={canvasId}
        maxColors={16}
        selectedColorHex={selectedColorLayer === PLAYGROUND_CANVAS_ID && selectedColorHex} 
        colors={colorsByLayer[PLAYGROUND_CANVAS_ID]?.sort(sortColorByLastSelectedDate(colors, PLAYGROUND_CANVAS_ID))} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor} 
      />
    }
    if(canvasId === FOREGROUND_CANVAS_ID) {
      return <ColorSelect 
        withEraser={withEraser}
        canvasId={canvasId}
        maxColors={16}
        selectedColorHex={selectedColorLayer === FOREGROUND_CANVAS_ID && selectedColorHex} 
        colors={colorsByLayer[FOREGROUND_CANVAS_ID]?.sort(sortColorByLastSelectedDate(colors, FOREGROUND_CANVAS_ID))} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor}
      />
    }
  }

  return <>
    {renderColorSelect()}
    {isCreateColorFlowOpen === ('LayerColorSelect' + canvasId) && <CreateColorFlow
      onComplete={(color) => {
        editGameModel({
          colors: {
            [color.hex]: {
              [color.canvasId]: Date.now()
            }
          }
        })
        selectBrush(COLOR_BRUSH_ID + '/' + color.canvasId + '/' + color.hex, color.canvasId)
      }}
    />}
    {isSelectAggregateColorOpen === ('LayerColorSelect' + canvasId) && <AggregateColorSelectModal
      onSelectColor={(hex) => {
        editGameModel({
          colors: {
            [hex]: {
              [canvasId]: Date.now()
            }
          }
        })
        selectBrush(COLOR_BRUSH_ID + '/' + canvasId + '/' + hex, canvasId)
      }}
    />}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
  gameSelector: state.gameSelector,
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, clearBrush, selectBrush, editGameModel, openSelectAggregateColor }),
)(LayerColorSelect);
