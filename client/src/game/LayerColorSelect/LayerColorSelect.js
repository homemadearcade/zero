/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LayerColorSelect.scss';
import { BACKGROUND_CANVAS_ID, COLOR_BRUSH_ID, FOREGROUND_CANVAS_ID, PLAYGROUND_CANVAS_ID } from '../../constants';
import { openCreateColorFlow } from '../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import CreateColorFlow from '../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../store/actions/gameActions';
import ColorSelect from '../ui/ColorSelect/ColorSelect';
import { clearBrush, selectBrush } from '../../store/actions/editorActions';
import { getHexFromColorId, getCanvasIdFromColorId, isBrushIdColor } from '../../utils/editorUtils';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';

const LayerColorSelect = ({
  game: { gameModel : { colors }},
  canvasId,
  openCreateColorFlow,
  editGameModel,
  selectBrush,
  clearBrush,
  editor: { brushIdSelectedBrushList },
  gameFormEditor: { isCreateColorFlowOpen }
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
    openCreateColorFlow('LayerColorSelect' + canvasId, canvasId)
  }

  function onSelectColor(hex) {
    if(!colors[hex] || !colors[hex][canvasId]) {
      editGameModel({
        colors: {
          [hex]: {
            [canvasId]: true
          }
        }
      })
    }

    selectBrush(COLOR_BRUSH_ID + '/' + canvasId + '/' + hex)
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
        maxColors={16}
        selectedColorHex={selectedColorLayer === BACKGROUND_CANVAS_ID && selectedColorHex} 
        colors={colorsByLayer[BACKGROUND_CANVAS_ID]} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor}
      />
    }
    if(canvasId === PLAYGROUND_CANVAS_ID) {
      return <ColorSelect 
        maxColors={16}
        selectedColorHex={selectedColorLayer === PLAYGROUND_CANVAS_ID && selectedColorHex} 
        colors={colorsByLayer[PLAYGROUND_CANVAS_ID]} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor} 
      />
    }
    if(canvasId === FOREGROUND_CANVAS_ID) {
      return <ColorSelect 
        maxColors={16}
        selectedColorHex={selectedColorLayer === FOREGROUND_CANVAS_ID && selectedColorHex} 
        colors={colorsByLayer[FOREGROUND_CANVAS_ID]} 
        onSelectColor={onSelectColor} 
        onUnselectColor={onUnselectColor}
        onAddColor={onAddColor}
      />
    }
  }

  return <>
    <Unlockable interfaceId={canvasId + "/colorSelect"}>{renderColorSelect()}</Unlockable>
    {isCreateColorFlowOpen === ('LayerColorSelect' + canvasId) && <CreateColorFlow
      onComplete={(color) => {
        editGameModel({
          colors: {
            [color.hex]: {
              [color.canvasId]: true
            }
          }
        })
        selectBrush(COLOR_BRUSH_ID + '/' + color.canvasId + '/' + color.hex)
      }}
    />}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  gameFormEditor: state.gameFormEditor,
  editor: state.editor,
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, clearBrush, selectBrush, editGameModel }),
)(LayerColorSelect);
