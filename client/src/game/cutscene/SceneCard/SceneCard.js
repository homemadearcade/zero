import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

// import './SceneCard.scss';
import Typography from '../../../ui/Typography/Typography';
import CutsceneBody from '../CutsceneBody/CutsceneBody';
import CutsceneBodyEdit from '../CutsceneBodyEdit/CutsceneBodyEdit';
import Button from '../../../ui/Button/Button';
import './SceneCard.scss'
import { Paper } from '@mui/material';

const SceneCard = ({isEditing, scene, onSelectEntityModelId, onDoneEditing, onChooseNewImage, onChangeText, onRemoveScene, onEditScene, index}) => {
 return <div className="SceneCard">
    <Paper sx={{
      width: 'max-content',
      padding: '.4em',
    }} elevation={1}>
      <Typography variant="h5" component="div">
        Scene #{index+1}
      </Typography>
    </Paper>  
    {isEditing ? <CutsceneBodyEdit onSelectEntityModelId={onSelectEntityModelId} onDoneEditing={onDoneEditing} onChooseNewImage={onChooseNewImage} onChangeText={onChangeText} scene={scene} /> : <CutsceneBody scene={scene} />} 
    {!isEditing && <>
      <Button onClick={onEditScene}>Edit</Button>
      <Button onClick={onRemoveScene}>Remove</Button>
    </>}
  </div>
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { }))(SceneCard);
