/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushControl.scss';
import FormLabel from '../../app/ui/FormLabel/FormLabel';
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import { updateBrushSize } from '../../store/actions/editorActions';
import { mapCobrowsingState } from '../../utils/cobrowsing';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';

const BrushControl = ({
  game: { gameModel: { brushes, world }},
  updateBrushSize,
  editor: { brushSize, brushIdSelectedBrushList },
}) => {
  const brush = brushes[brushIdSelectedBrushList]

  return <div className="BrushControl">
    <Unlockable isSlider interfaceId="brushSize">
      <div className="BrushControl__size">
        <FormLabel>Brush Size</FormLabel>
        <SliderNotched
          step={null}
          options={[1, 3, 6, 9, 15, 22.5, 30]}
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
  game: state.game,
  editor: state.editor,
})

export default compose(
  connect(mapStateToProps, { updateBrushSize }),
)(BrushControl);
