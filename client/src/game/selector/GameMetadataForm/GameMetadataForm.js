import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './GameMetadataForm.scss';
import { TextField } from '@mui/material';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import GameTexturesDialog from '../../textures/GameTexturesDialog/GameTexturesDialog';
import { closeGameTexturesDialog, openGameTexturesDialog } from '../../../store/actions/game/gameSelectorActions';
import { getImageUrlFromTextureId } from '../../../utils';

const GameMetadataForm = ({ editGameModel, gameModel: { gameModel }, onSubmit, openGameTexturesDialog, closeGameTexturesDialog, gameSelector: { isGameTexturesDialogOpen} }) => {
  const metadata = gameModel.metadata

  const { title, description, authorPseudonym } = metadata

  const [imageUrl, setImageUrl] = useState(metadata.imageUrl)

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      title,
      description,
      authorPseudonym : authorPseudonym ? authorPseudonym : gameModel.owner?.username,
      imageUrl
    },
  });

  const submit = async (data) => {
    editGameModel({
      metadata: {
        ...data,
        imageUrl
      },
    })
    reset();
    onSubmit()
  }

  function renderImageSelect() {
    return <>
      {imageUrl  && <img className="GameMetadataForm__image" alt={title + ' image'} src={imageUrl}/>}
      <Button onClick={() => {
        openGameTexturesDialog()
      }}>Select Image</Button>
    </>
  }

  return (
    <div className="GameMetadataform">
      <Typography variant="h2" component="h2">Game Metadata</Typography>
        {renderImageSelect()}
        <div>
          <Controller
            name={"title"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Title"} />
            )}
          />
        </div>
        <div>
          <Controller
            name={"authorPseudonym"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Author"} />
            )}
          />
        </div>
        <div>
          <Controller
            name={"description"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField multiline onChange={onChange} value={value} label={"Description"} />
            )}
          />
        </div>
      <Button type="submit" onClick={handleSubmit(submit)}>Save</Button>
      {isGameTexturesDialogOpen && <GameTexturesDialog onClickTexture={(textureId) => {
        setImageUrl(getImageUrlFromTextureId(textureId))
        closeGameTexturesDialog()
      }}/>}
    </div>
  )
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
  gameSelector: state.gameSelector
});

export default connect(mapStateToProps, { editGameModel, closeGameTexturesDialog, openGameTexturesDialog })(GameMetadataForm);
