/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushControl.scss';
import FormLabel from '../../app/ui/FormLabel/FormLabel';
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import { updateBrushSize } from '../../store/actions/editorActions';
import { getRemoteCobrowsingState } from '../../utils/cobrowsing';

const BrushControl = ({
  game: { gameModel: { brushes, world }},
  updateBrushSize,
  editorState: { brushSize, brushSelectedIdBrushList },
}) => {
  const brush = brushes[brushSelectedIdBrushList]

  return <div className="BrushControl">
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
  </div>
};

const mapStateToProps = (state) => getRemoteCobrowsingState(state, {
  game: state.game,
  editorState: state.editor.editorState,
})

export default compose(
  connect(mapStateToProps, { updateBrushSize }),
)(BrushControl);
