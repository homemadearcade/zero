/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './AggregateColorSelect.scss';
import { COLOR_BRUSH_ID } from '../../constants';
import { openCreateColorFlow } from '../../store/actions/editorFormsActions';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import CreateColorFlow from '../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../store/actions/gameActions';
import ColorSelect from '../ui/ColorSelect/ColorSelect';
import { clearBrush, selectBrush } from '../../store/actions/editorActions';
import { getHexFromColorId, isBrushIdColor } from '../../utils/editorUtils';

const AggregateColorSelect = ({
  game: { gameModel : { colors }},
  canvasId,
  openCreateColorFlow,
  editGameModel,
  selectBrush,
  clearBrush,
  editor: { brushIdSelectedBrushList },
  editorForms: { isCreateColorFlowOpen }
}) => {
  const aggregateColors = Object.keys(colors)

  function onAddColor() {
    openCreateColorFlow('AggregateColorSelect' + canvasId, canvasId)
  }

  function onSelectColor(hex) {
    if(!colors[hex]) {
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
    if(brushIdSelectedBrushList) {
      if(isBrushIdColor(brushIdSelectedBrushList)) {
        selectedColorHex = getHexFromColorId(brushIdSelectedBrushList)
      }
    }

    return <ColorSelect 
      maxColors={50}
      selectedColorHex={selectedColorHex} 
      colors={aggregateColors} 
      onSelectColor={onSelectColor} 
      onUnselectColor={onUnselectColor}
      onAddColor={onAddColor}
    />
  }

  return <>
    {renderColorSelect()}
    {isCreateColorFlowOpen === ('AggregateColorSelect' + canvasId) && <CreateColorFlow
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
  editorForms: state.editorForms,
  editor: state.editor,
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, clearBrush, selectBrush, editGameModel }),
)(AggregateColorSelect);
