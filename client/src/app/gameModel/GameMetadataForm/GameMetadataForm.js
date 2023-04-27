import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './GameMetadataForm.scss';
import { TextField } from '@mui/material';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import GameTexturesDialog from '../../../game/textures/GameTexturesDialog/GameTexturesDialog';
import { closeGameTexturesDialog, openGameTexturesDialog } from '../../../store/actions/game/gameSelectorActions';
import { getImageUrlFromTextureId } from '../../../utils';
import SelectPlayScope from '../../../game/ui/SelectPlayScope/SelectPlayScope';
import SelectEditScope from '../../../game/ui/SelectEditScope/SelectEditScope';
import Divider from '../../../ui/Divider/Divider';

const GameMetadataForm = ({ editGameModel, gameModel: { gameModel }, onSubmit, openGameTexturesDialog, closeGameTexturesDialog, gameSelector: { isGameTexturesDialogOpen} }) => {
  const metadata = gameModel.metadata

  const { title, description, authorPseudonym } = metadata

  const [imageUrl, setImageUrl] = useState(metadata.imageUrl)

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      metadata: {
        title,
        description,
        authorPseudonym : authorPseudonym ? authorPseudonym : gameModel.owner?.username,
        imageUrl
      },
      playScope: gameModel.playScope,
      editScope: gameModel.editScope,
    },
  });

  const submit = async (data) => {
    editGameModel({
      metadata: {
        ...data.metadata,
        imageUrl
      },
      playScope: data.playScope,
      editScope: data.editScope,
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
        {renderImageSelect()}
        <div>
          <Controller
            name={"metadata.title"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Title"} />
            )}
          />
        </div>
        <div>
          <Controller
            name={"metadata.authorPseudonym"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Author"} />
            )}
          />
        </div>
        <div>
          <Controller
            name={"metadata.description"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField multiline onChange={onChange} value={value} label={"Description"} />
            )}
          />
        </div>
        <div>
          <Controller
            name={"playScope"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectPlayScope formLabel="Who can play this game?" onChange={onChange} value={value} />
            )}
          />
        </div>
        {/* <div>
          <Controller
            name={"editScope"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectEditScope formLabel="Who can edit this game?" onChange={onChange} value={value} />
            )}
          />
        </div> */}
      <Divider/>
      <Button type="submit" onClick={handleSubmit(submit)}>Save</Button>
      <Button type="submit" onClick={handleSubmit(submit)}>Cancel</Button>
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
