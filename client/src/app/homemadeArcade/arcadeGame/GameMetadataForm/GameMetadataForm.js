import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './GameMetadataForm.scss';
import { TextField } from '@mui/material';
import { editGameModel } from '../../../../store/actions/gameActions';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../../ui/Button/Button';
import Typography from '../../../../ui/Typography/Typography';

const GameMetadataForm = ({ editGameModel, game: { gameModel }, onSubmit }) => {
  const metadata = gameModel.metadata

  const { title, description, authorPseudonym, imageUrl } = metadata

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      title,
      description,
      authorPseudonym : authorPseudonym ? authorPseudonym : gameModel.user.username,
      imageUrl
    },
  });

  const submit = async (data) => {
    console.log(data)
    editGameModel({
      metadata: {
        ...data
      }
    })
    reset();
    onSubmit()
  }

  return (
    <div className="LobbyForm">
      <Typography variant="h2" component="h2">Game Metadata</Typography>
      <form>
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
            name={"description"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField multiline onChange={onChange} value={value} label={"Description"} />
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
        <Button type="submit" onClick={handleSubmit(submit)}>Save</Button>
      </form>
    </div>
  )
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { editGameModel })(GameMetadataForm);
