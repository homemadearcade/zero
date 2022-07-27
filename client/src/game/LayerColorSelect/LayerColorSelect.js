/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LayerColorSelect.scss';
import { BACKGROUND_LAYER_ID, COLOR_BRUSH_ID, OVERHEAD_LAYER_ID, PLAYGROUND_LAYER_ID } from '../../constants';
import { openCreateColorFlow } from '../../store/actions/editorFormsActions';
import { mapCobrowsingState } from '../../utils/cobrowsing';
import CreateColorFlow from '../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../store/actions/gameActions';
import ColorSelect from '../ui/ColorSelect/ColorSelect';
import { clearBrush, selectBrush } from '../../store/actions/editorActions';
import { getHexFromColorId, getLayerIdFromColorId, isBrushIdColor } from '../../utils/editor';

const LayerColorSelect = ({
  game: { gameModel : { colors }},
  layerId,
  openCreateColorFlow,
  editGameModel,
  selectBrush,
  clearBrush,
  editor: { brushIdSelectedBrushList },
  editorForms: { isCreateColorFlowOpen }
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
    openCreateColorFlow(layerId)
  }

  function onSelectColor(hex) {
    if(!colors[hex] || !colors[hex][layerId]) {
      editGameModel({
        colors: {
          [hex]: {
            [layerId]: true
          }
        }
      })
    }

    selectBrush(COLOR_BRUSH_ID + '/' + layerId + '/' + hex)
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

    if(layerId === BACKGROUND_LAYER_ID) {
      return <ColorSelect 
        selectedColorHex={selectedColorLayer === BACKGROUND_LAYER_ID && selectedColorHex} 
        colors={colorsByLayer[BACKGROUND_LAYER_ID]} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor}
      />
    }
    if(layerId === PLAYGROUND_LAYER_ID) {
      return <ColorSelect 
        selectedColorHex={selectedColorLayer === PLAYGROUND_LAYER_ID && selectedColorHex} 
        colors={colorsByLayer[PLAYGROUND_LAYER_ID]} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor} 
      />
    }
    if(layerId === OVERHEAD_LAYER_ID) {
      return <ColorSelect 
        selectedColorHex={selectedColorLayer === OVERHEAD_LAYER_ID && selectedColorHex} 
        colors={colorsByLayer[OVERHEAD_LAYER_ID]} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor}
      />
    }
  } 

  return <>
    {renderColorSelect()}
    {isCreateColorFlowOpen && <CreateColorFlow
      onComplete={(color) => {
        editGameModel({
          colors: {
            [color.hex]: {
              [color.layerId]: true
            }
          }
        })
        selectBrush(COLOR_BRUSH_ID + '/' + color.layerId + '/' + color.hex)
      }}
    />}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editorForms: state.editorForms,
  editor: state.editor,
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, clearBrush, selectBrush, editGameModel }),
)(LayerColorSelect);
