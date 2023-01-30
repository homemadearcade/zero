import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './GameMetadataForm.scss';
import { TextField } from '@mui/material';
import { editGameModel } from '../../../../store/actions/gameModelActions';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../../ui/Button/Button';
import Typography from '../../../../ui/Typography/Typography';
import MySpritesModal from '../../../../game/sprites/MySpritesModal/MySpritesModal';
import { closeMySpritesModal, openMySpritesModal } from '../../../../store/actions/gameEditorActions';

const GameMetadataForm = ({ editGameModel, gameModel: { gameModel }, onSubmit, openMySpritesModal, closeMySpritesModal, gameEditor: { isMySpritesModalOpen} }) => {
  const metadata = gameModel.metadata

  const { title, description, authorPseudonym } = metadata

  const [imageUrl, setImageUrl] = useState(metadata.imageUrl)

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      title,
      description,
      authorPseudonym : authorPseudonym ? authorPseudonym : gameModel.user?.username,
      imageUrl
    },
  });

  const submit = async (data) => {
    editGameModel({
      metadata: {
        ...data,
        imageUrl
      }
    })
    reset();
    onSubmit()
  }

  function renderImageSelect() {
    return <>
      {imageUrl  && <img className="GameMetadataForm__image" alt={title + ' image'} src={window.awsUrl + imageUrl}/>}
      <Button onClick={() => {
        openMySpritesModal()
      }}>Select Image</Button>
    </>
  }

  return (
    <div className="GameMetadataform">
      <Typography variant="h2" component="h2">Game Metadata</Typography>
      <form>
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
      </form>
      {isMySpritesModalOpen && <MySpritesModal onClickSprite={(textureId) => {
        setImageUrl(gameModel.awsImages[textureId].url)
        closeMySpritesModal()
      }}/>}
    </div>
  )
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
  gameEditor: state.gameEditor
});

export default connect(mapStateToProps, { editGameModel, closeMySpritesModal, openMySpritesModal })(GameMetadataForm);
