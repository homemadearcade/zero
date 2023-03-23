/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createPortal } from 'react-dom';

import './LayerColorSelect.scss';
import {  COLOR_BRUSH_ID } from '../../constants';
import { openCreateColorFlow } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CreateColorFlow from '../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/gameModelActions';
import ColorSelect from '../ColorSelect/ColorSelect';
import { clearBrush, closeSelectAggregateColor, openSelectAggregateColor, selectBrush } from '../../../store/actions/gameSelectorActions';
import { getHexFromColorId, getLayerIdFromColorId, isBrushIdColor, sortColorByLastSelectedDate } from '../../../utils/editorUtils';
import AggregateColorSelectModal from '../AggregateColorSelectModal/AggregateColorSelectModal';

const LayerColorSelect = ({
  gameModel: { gameModel : { colors }},
  layerId,
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
    Object.keys(color).forEach((layerId) => {
      if(!color[layerId]) return
      if(!prev[layerId]) prev[layerId] = []
      prev[layerId].push(hex)
    })
    return prev
  }, {})

  function onAddColor() {
    if(Object.keys(colors).length) {
      openSelectAggregateColor('LayerColorSelect' + layerId)
    } else {
      openCreateColorFlow('LayerColorSelect' + layerId, layerId)
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
    {isCreateColorFlowOpen === ('LayerColorSelect' + layerId) && <CreateColorFlow
      onComplete={(color) => {
        editGameModel({
          colors: {
            [color.hex]: {
              [color.layerId]: Date.now()
            }
          }
        })
        selectBrush(COLOR_BRUSH_ID + '/' + color.layerId + '/' + color.hex, color.layerId)
      }}
    />}
    {isSelectAggregateColorOpen === ('LayerColorSelect' + layerId) && <AggregateColorSelectModal
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
