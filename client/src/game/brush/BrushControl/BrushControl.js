/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushControl.scss';
import FormLabel from '../../../ui/FormLabel/FormLabel';
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import { updateBrushSize } from '../../../store/actions/game/gameSelectorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { BRUSH_SIZE_IID } from '../../../constants/interfaceIds';
import Icon from '../../../ui/Icon/Icon';

const BrushControl = ({
  gameModel: { gameModel: { brushes, stages }},
  updateBrushSize,
  gameSelector: { brushSize, brushIdSelectedBrushList },
  gameRoomInstance: { gameRoomInstance: { currentStageId } }
}) => {
  // const brush = brushes[brushIdSelectedBrushList]

  const boundaries = stages[currentStageId].boundaries
  const minZoomWidth = Math.floor((boundaries.width/boundaries.maxWidth) * 3)
  const minZoomHeight = Math.floor((boundaries.height/boundaries.maxHeight) * 3)

  const minZoomIndex = minZoomHeight < minZoomWidth ? minZoomHeight : minZoomWidth

  const sizes = [
    1, 
    3, 
    6, 
    minZoomIndex === 3 && 9, 
    15, 
    minZoomIndex === 3 && 22.5, 
    30
  ].filter((num) => {
    return !!num
  })

  return <div className="BrushControl">
    <Unlockable isSlider interfaceId={BRUSH_SIZE_IID}>
      <div className="BrushControl__title">
        <Icon size="xs" icon="faPaintbrush"></Icon>
        <FormLabel>
          Size
        </FormLabel>
      </div>

      <div className="BrushControl__size">
        <SliderNotched
          step={null}
          options={sizes}
          onChangeCommitted={(value) => {
            updateBrushSize(value)        
          }}
          value={brushSize}
        />
      </div>
    </Unlockable>
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
  gameRoomInstance: state.gameRoomInstance
})

export default compose(
  connect(mapStateToProps, { updateBrushSize }),
)(BrushControl);
