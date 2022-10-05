import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './CameraEditor.scss'
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import { Typography } from '@mui/material';
import Unlockable from '../../app/cobrowsing/Unlockable/Unlockable';

const CameraEditor = ({ classId, game: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]

  if(!classSelected?.camera) {
    console.error('opened camera editor on a class with no camera')
    return null
  }

  const boundaries = gameModel.world.boundaries
  const minZoomWidth = Math.floor((boundaries.width/boundaries.maxWidth) * 3)
  const minZoomHeight = Math.floor((boundaries.height/boundaries.maxHeight) * 3)

  const minZoomIndex = minZoomHeight < minZoomWidth ? minZoomHeight : minZoomWidth

  const zooms = [
    minZoomIndex === 3 && 1,
    minZoomIndex >= 2 && 1.5, 
    // 2.2,
    // 2.4,
    // 2.6,
    // 2.8,
     3, 
     4, 
     5
  ].filter((num) => {
    return !!num
  })

// step={0.2} is like... perfect for grids

  return (
    <div className="CameraEditor">
      <Typography component="h5" variant="h5">Editing Class {classId}</Typography>
      <Unlockable isSlider interfaceId="camera/zoom">
        <SliderNotched
          formLabel="Zoom"
          options={zooms}
          step={0.1}
          onChangeCommitted={(value) => {
            editGameModel({ classes: { [classId]: { camera: { zoom: value }  }}})        
          }}
          value={classSelected.camera.zoom}
      />
      </Unlockable>
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(CameraEditor);
