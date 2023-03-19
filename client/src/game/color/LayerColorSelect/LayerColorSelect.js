/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LayerColorSelect.scss';
import { BACKGROUND_LAYER_CANVAS_ID, COLOR_BRUSH_ID, FOREGROUND_LAYER_CANVAS_ID, PLAYGROUND_LAYER_CANVAS_ID } from '../../constants';
import { openCreateColorFlow } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CreateColorFlow from '../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/gameModelActions';
import ColorSelect from '../ColorSelect/ColorSelect';
import { clearBrush, closeSelectAggregateColor, openSelectAggregateColor, selectBrush } from '../../../store/actions/gameSelectorActions';
import { getHexFromColorId, getCanvasIdFromColorId, isBrushIdColor, sortColorByLastSelectedDate } from '../../../utils/editorUtils';
import AggregateColorSelectModal from '../AggregateColorSelectModal/AggregateColorSelectModal';

const LayerColorSelect = ({
  gameModel: { gameModel : { colors }},
  layerCanvasId,
  openCreateColorFlow,
  openSelectAggregateColor,
  editGameModel,
  selectBrush,
  clearBrush,
  gameSelector: { brushIdSelectedBrushList, isSelectAggregateColorOpen },
  gameFormEditor: { isCreateColorFlowOpen },
  closeSelectAggregateColor,
  withEraser
}) => {
  const colorsByLayer = Object.keys(colors).reduce((prev, hex) => {
    const color = colors[hex]
    Object.keys(color).forEach((layerCanvasId) => {
      if(!color[layerCanvasId]) return
      if(!prev[layerCanvasId]) prev[layerCanvasId] = []
      prev[layerCanvasId].push(hex)
    })
    return prev
  }, {})

  function onAddColor() {
    if(Object.keys(colors).length) {
      openSelectAggregateColor('LayerColorSelect' + layerCanvasId)
    } else {
      openCreateColorFlow('LayerColorSelect' + layerCanvasId, layerCanvasId)
    }
  }

  function onSelectColor(hex) {
    if(!colors[hex] || !colors[hex][layerCanvasId]) {
      editGameModel({
        colors: {
          [hex]: {
            [layerCanvasId]: Date.now()
          }
        }
      })
    }

    selectBrush(COLOR_BRUSH_ID + '/' + layerCanvasId + '/' + hex, layerCanvasId)
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

    if(layerCanvasId === BACKGROUND_LAYER_CANVAS_ID) {
      return <ColorSelect 
        withEraser={withEraser}
        layerCanvasId={layerCanvasId}
        maxColors={16}
        selectedColorHex={selectedColorLayer === BACKGROUND_LAYER_CANVAS_ID && selectedColorHex} 
        colors={colorsByLayer[BACKGROUND_LAYER_CANVAS_ID]?.sort(sortColorByLastSelectedDate(colors, BACKGROUND_LAYER_CANVAS_ID))} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor}
      />
    }
    if(layerCanvasId === PLAYGROUND_LAYER_CANVAS_ID) {
      return <ColorSelect 
        withEraser={withEraser}
        layerCanvasId={layerCanvasId}
        maxColors={16}
        selectedColorHex={selectedColorLayer === PLAYGROUND_LAYER_CANVAS_ID && selectedColorHex} 
        colors={colorsByLayer[PLAYGROUND_LAYER_CANVAS_ID]?.sort(sortColorByLastSelectedDate(colors, PLAYGROUND_LAYER_CANVAS_ID))} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor} 
      />
    }
    if(layerCanvasId === FOREGROUND_LAYER_CANVAS_ID) {
      return <ColorSelect 
        withEraser={withEraser}
        layerCanvasId={layerCanvasId}
        maxColors={16}
        selectedColorHex={selectedColorLayer === FOREGROUND_LAYER_CANVAS_ID && selectedColorHex} 
        colors={colorsByLayer[FOREGROUND_LAYER_CANVAS_ID]?.sort(sortColorByLastSelectedDate(colors, FOREGROUND_LAYER_CANVAS_ID))} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor}
      />
    }
  }

  return <>
    {renderColorSelect()}
    {isCreateColorFlowOpen === ('LayerColorSelect' + layerCanvasId) && <CreateColorFlow
      onComplete={(color) => {
        editGameModel({
          colors: {
            [color.hex]: {
              [color.layerCanvasId]: Date.now()
            }
          }
        })
        selectBrush(COLOR_BRUSH_ID + '/' + color.layerCanvasId + '/' + color.hex, color.layerCanvasId)
      }}
    />}
    {isSelectAggregateColorOpen === ('LayerColorSelect' + layerCanvasId) && <AggregateColorSelectModal
      onSelectColor={(hex) => {
        closeSelectAggregateColor()
        editGameModel({
          colors: {
            [hex]: {
              [layerCanvasId]: Date.now()
            }
          }
        })
        selectBrush(COLOR_BRUSH_ID + '/' + layerCanvasId + '/' + hex, layerCanvasId)
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
  connect(mapStateToProps, { openCreateColorFlow, closeSelectAggregateColor, clearBrush, selectBrush, editGameModel, openSelectAggregateColor }),
)(LayerColorSelect);
