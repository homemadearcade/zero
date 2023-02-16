/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './AggregateColorSelect.scss';
import { openCreateColorFlow } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CreateColorFlow from '../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/gameModelActions';
import ColorSelect from '../ColorSelect/ColorSelect';
import { getHexFromColorId, isBrushIdColor } from '../../../utils/editorUtils';
import { COMMON_COLOR_ID } from '../../constants';

const AggregateColorSelect = ({
  gameModel: { gameModel : { colors }},
  canvasId,
  openCreateColorFlow,
  editGameModel,
  onSelectColor,
  onUnselectColor,
  gameSelector: { brushIdSelectedBrushList },
  gameFormEditor: { isCreateColorFlowOpen },
  selectedColor
}) => {
  const aggregateColors = Object.keys(colors)

  function onAddColor() {
    openCreateColorFlow('AggregateColorSelect' + canvasId, canvasId)
  }

  function renderColorSelect() {
    let selectedColorHex
    if(brushIdSelectedBrushList) {
      if(isBrushIdColor(brushIdSelectedBrushList)) {
        selectedColorHex = getHexFromColorId(brushIdSelectedBrushList)
      }
    }

    return <ColorSelect 
      canvasId={canvasId}
      maxColors={50}
      selectedColorHex={selectedColorHex || selectedColor} 
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
              [COMMON_COLOR_ID]: true
            }
          }
        })
        onSelectColor(color.hex)
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
  connect(mapStateToProps, { openCreateColorFlow, editGameModel }),
)(AggregateColorSelect);
