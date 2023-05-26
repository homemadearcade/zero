import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';

import './GameMetadataForm.scss';
import { TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../ui/Button/Button';
import GameTexturesDialog from '../../../game/textures/GameTexturesDialog/GameTexturesDialog';
import { closeGameTexturesDialog, openGameTexturesDialog } from '../../../store/actions/game/gameSelectorActions';
import { getImageUrlFromTextureId } from '../../../utils';
import { updateFormEditorGameModel } from '../../../store/actions/game/gameFormEditorActions';
import { editGameModel } from '../../../store/actions/game/gameModelActions';

const GameMetadataForm = ({ 
  gameModel: { gameModel }, 
  gameFormEditor: { gameModelFormEditor }, 
  openGameTexturesDialog, 
  closeGameTexturesDialog, 
  gameSelector: { isGameTexturesDialogOpen}, 
  updateFormEditorGameModel,
  editGameModel
}) => {
  const { title, description, authorPseudonym, imageUrl} = gameModel.metadata

  const { control } = useForm({
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

  useEffect(() => {
    updateFormEditorGameModel({
      metadata: gameModel.metadata,
    })

    return () => {
      editGameModel({
        metadata: {
          ...gameModelFormEditor.metadata,
        },
      })
    }
  }, [])

  if(!gameModelFormEditor.metadata) return

  return (
    <div className="GameMetadataForm">
      <div className="GameMetadataForm__stage">
        {gameModelFormEditor.metadata.imageUrl  && <img className="GameMetadataForm__image" alt={title + ' image'} src={gameModelFormEditor.metadata.imageUrl}/>}
        <Button onClick={() => {
          openGameTexturesDialog()
        }}>Select Image</Button>
      </div>
      <div className="GameMetadataForm__details">
        <div>
          <Controller
            name={"metadata.title"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField fullWidth onChange={(event) => {
                updateFormEditorGameModel({
                  metadata: {
                    title: event.target.value
                  }
                })
                onChange(event)
              }} value={value} label={"Title"} />
            )}
          />
        </div>
        <div>
          <Controller
            name={"metadata.authorPseudonym"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField fullWidth onChange={(event) => {
                updateFormEditorGameModel({
                  metadata: {
                    authorPseudonym: event.target.value
                  }
                })
                onChange(event)
              }} value={value} label={"Author"} />
            )}
          />
        </div>
        <div>
          <Controller
            name={"metadata.description"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField multiline minRows={3} fullWidth onChange={(event) => {
                updateFormEditorGameModel({
                  metadata: {
                    description: event.target.value
                  }
                })
                onChange(event)
              }} value={value} label={"Description"} />
            )}
          />
        </div>
      </div>
      {isGameTexturesDialogOpen && <GameTexturesDialog onClickTexture={(textureId) => {
        updateFormEditorGameModel({
          metadata: {
            imageUrl: getImageUrlFromTextureId(textureId)
          }
        })
        closeGameTexturesDialog()
      }}/>}
    </div>
  )
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
  gameFormEditor: state.gameFormEditor
});

export default connect(mapStateToProps, { editGameModel, closeGameTexturesDialog, openGameTexturesDialog, updateFormEditorGameModel })(GameMetadataForm);
