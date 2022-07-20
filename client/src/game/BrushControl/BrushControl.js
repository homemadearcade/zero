/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './BrushControl.scss';
import FormLabel from '../../app/ui/FormLabel/FormLabel';
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import { updateBrushSize } from '../../store/actions/editorActions';

const BrushControl = ({
  game: { gameModel : { brushes }},
  updateBrushSize,
  editorState: { brushSize, brushSelectedIdBrushList },
}) => {

  const brush = brushes[brushSelectedIdBrushList]

  return <div className="BrushControl">
    <div className="BrushControl__size">
      <FormLabel>Brush Size</FormLabel>
      <SliderNotched
        step={null}
        options={[1, 2, 5, 10, 20]}
        onChangeCommitted={(value) => {
          updateBrushSize(value)        
        }}
        value={brushSize}
      />
    </div>
  </div>
};

const mapStateToProps = (state) => {
  const isCobrowsing = state.cobrowsing.isSubscribedCobrowsing
  return {
    game: state.game,
    editorState: isCobrowsing ? state.cobrowsing.remoteState.editor : state.editor.editorState,
  }
};


export default compose(
  connect(mapStateToProps, { updateBrushSize }),
)(BrushControl);
