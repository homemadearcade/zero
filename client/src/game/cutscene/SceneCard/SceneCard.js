import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';

// import './SceneCard.scss';
import { CardActions, TextField } from '@mui/material';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import { CANVAS_IMAGE_CUTSCENE, TEXT_CUTSCENE } from '../../constants';

const SceneCard = ({isEditing, scene, onDoneEditing, onChooseNewImage, onChangeText, onRemoveScene, onEditScene, index}) => {
 return <Card sx={{ width: 200 }}>
      <Typography gutterBottom variant="h5" component="div">
      #{index+1}
    </Typography>
    {scene.sceneInterfaceType != TEXT_CUTSCENE && 
      <>
      <CardMedia
        component="img"
        image={scene.imageUrl ? window.awsUrl + scene.imageUrl : ""}
        alt={scene.title}
      />
      {isEditing && <Button onClick={onChooseNewImage}>Choose Image</Button>}
    </>}
    {scene.sceneInterfaceType != CANVAS_IMAGE_CUTSCENE && <CardContent>
      {scene.text && !isEditing && <Typography variant="body2" color="text.secondary">
        {scene.text}
      </Typography>}
      {isEditing &&  <TextField multiline value={scene.text} onChange={onChangeText}/>}
    </CardContent>}
    <CardActions>
      {isEditing ? <Button onClick={onDoneEditing}>Done Editing</Button> : <>
            <Button onClick={onEditScene}>Edit</Button>
      <Button onClick={onRemoveScene}>Remove</Button>
      </>}

    </CardActions>
  </Card>
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { }))(SceneCard);
