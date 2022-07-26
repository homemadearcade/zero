import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../store/actions/gameActions';

import './CameraEditor.scss'
import SliderNotched from '../../app/ui/SliderNotched/SliderNotched';
import { FormLabel, Typography } from '@mui/material';

const CameraEditor = ({ classId, game: { gameModel }, editGameModel }) => {
  const classSelected = gameModel.classes[classId]

  if(!classSelected?.camera) {
    console.error('opened camera editor on a class with no camera')
    return null
  }
  
  return (
    <div className="CameraEditor">
      <Typography component="h5" variant="h5">Editing Class {classId}</Typography>
      <SliderNotched
        formLabel="Zoom"
        options={[1, 2, 3, 4]}
        step={0.2}
        onChangeCommitted={(value) => {
          editGameModel({ classes: { [classId]: { camera: { zoom: value }  }}})        
        }}
        value={classSelected.camera.zoom}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(CameraEditor);
