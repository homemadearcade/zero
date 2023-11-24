import React, { useState } from 'react';
import { connect } from 'react-redux';

import { addArcadeGame, addImportedArcadeGame } from '../../../store/actions/game/arcadeGameActions';

import './styles.css';
import Button from '../../../ui/Button/Button';
import Icon from '../../../ui/Icon/Icon';
import Dialog from '../../../ui/Dialog/Dialog';
import { DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';
import { createInitialGameModel, gameGridHeight, gameGridWidth, nodeSize } from '../../../game/constants';
import { mergeDeep } from '../../../utils';
import { STARTER_PACK_GENERAL_IID } from '../../../constants/interfaceIds';

const GameAddForm = ({ addArcadeGame, addImportedArcadeGame, onSubmit, auth: { me }, appSettings: { appSettings }, defaultValues = {} }) => {
  const [isAddGameFormOpen, setIsAddGameFormOpen] = useState(false)

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      player: {},
      stages: {},
      metadata: {},
      layers: {},
      theme: {},
      relationTags: {},
      entityModels: {},
      colliisions: {},
      brushes: {},
      colors: {},
      textures: {},
      size: {
        nodeSize: nodeSize,
        gridWidth: gameGridWidth,
        gridHeight: gameGridHeight
      },
      userMongoId: me.id,
      ...defaultValues
    },
  });

  const submit = async (data) => {
    const initialGameModel = createInitialGameModel(STARTER_PACK_GENERAL_IID)

    const gameResponse = await addArcadeGame(mergeDeep(initialGameModel, data));

    const game = gameResponse.data.game

    if(appSettings.importedArcadeGameMongoIds) {
      for(let i = 0; i < appSettings.importedArcadeGameMongoIds.length; i++) {  
        await addImportedArcadeGame(appSettings.importedArcadeGameMongoIds[i], game.id)
      }
    }

    reset();
    if(onSubmit) onSubmit(game)
    setIsAddGameFormOpen(false)
  }

  return (
    <div className="GameAddForm">
      <Button onClick={() => {
        setIsAddGameFormOpen(true)
      }} startIcon={<Icon icon="faPlus"/>} type="submit" className="btn">New Game</Button>
      <Dialog onClose={() => {
        setIsAddGameFormOpen(false)
      }} open={isAddGameFormOpen}>
        <DialogTitle>New Game</DialogTitle>
        <DialogContent>
          <Controller
            name={"metadata.title"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField onChange={onChange} value={value} label={"Title"} />
            )}
          />
          <br></br><br/>
          <Controller
            name={"userMongoId"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectUsers onSelect={(users) => {
                onChange(users[users.length-1])
              }} usersSelected={value ? [value] : []} label={"User ( game owner )"} />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button type="submit" onClick={handleSubmit(submit)}>Add Game</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  appSettings: state.appSettings
});

export default connect(mapStateToProps, { addArcadeGame, addImportedArcadeGame })(GameAddForm);
