/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';

import './LayerColorSelect.scss';
import {  COLOR_BRUSH_ID } from '../../constants';
import { openCreateColorFlow } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CreateColorFlow from '../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import ColorSelect from '../ColorSelect/ColorSelect';
import { clearBrush, closeSelectAggregateColor, openSelectAggregateColor, selectBrush } from '../../../store/actions/game/gameSelectorActions';
import { getHexFromColorId, getLayerIdFromColorId, isBrushIdColor, sortColorByLastSelectedDate } from '../../../utils/editorUtils';
import AggregateColorSelectDialog from '../AggregateColorSelectDialog/AggregateColorSelectDialog';
import { LAYER_AGGREGATE_COLOR_SELECT_IID, LAYER_CREATE_COLOR_DIALOG_IID } from '../../../constants/interfaceIds';

const LayerColorSelect = ({
  gameModel: { gameModel : { colors }},
  layerId,
  openCreateColorFlow,
  openSelectAggregateColor,
  editGameModel,
  selectBrush,
  clearBrush,
  gameSelector: { brushIdSelectedBrushList, isSelectAggregateColorOpen },
  closeSelectAggregateColor,
  withEraser
}) => {
  const colorsByLayer = Object.keys(colors).reduce((prev, hex) => {
    const color = colors[hex]
    Object.keys(color).forEach((layerId) => {
      if(!color[layerId]) return
      if(!prev[layerId]) prev[layerId] = []
      prev[layerId].push(hex)
    })
    return prev
  }, {})
  
  function onAddColor() {
    if(Object.keys(colors).length) {
      openSelectAggregateColor(LAYER_AGGREGATE_COLOR_SELECT_IID)
    } else {
      openCreateColorFlow(LAYER_CREATE_COLOR_DIALOG_IID, layerId)
    }
  }

  function onSelectColor(hex) {
    if(!colors[hex] || !colors[hex][layerId]) {
      editGameModel({
        colors: {
          [hex]: {
            [layerId]: Date.now()
          }
        }
      })
    }

    selectBrush(COLOR_BRUSH_ID + '/' + layerId + '/' + hex, layerId)
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
        selectedColorLayer = getLayerIdFromColorId(brushIdSelectedBrushList)
      }
    }

    return <ColorSelect 
      withEraser={withEraser}
      layerId={layerId}
      maxColors={16}
      selectedColorHex={selectedColorLayer === layerId && selectedColorHex} 
      colors={colorsByLayer[layerId]?.sort(sortColorByLastSelectedDate(colors, layerId))} 
      onSelectColor={onSelectColor} 
      onUnselectColor={onUnselectColor}
      onAddColor={onAddColor}
    />
  }

  return <>
    {renderColorSelect()}
    {isSelectAggregateColorOpen === LAYER_AGGREGATE_COLOR_SELECT_IID && <AggregateColorSelectDialog
      onSelectColor={(hex) => {
        closeSelectAggregateColor()
        editGameModel({
          colors: {
            [hex]: {
              [layerId]: Date.now()
            }
          }
        })
        selectBrush(COLOR_BRUSH_ID + '/' + layerId + '/' + hex, layerId)
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
