import React from 'react';
import { connect } from 'react-redux';

import './GameSizeEditor.scss';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { Controller, useForm } from 'react-hook-form';
import Button from '../../../ui/Button/Button';
import { closeGameTexturesDialog, openGameTexturesDialog } from '../../../store/actions/game/gameSelectorActions';
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';

const GameSizeEditor = ({ editGameModel, gameModel: { gameModel }, onSubmit }) => {

  const { handleSubmit, reset, control } = useForm({
    defaultValues: {
      size: gameModel.size,
    },
  });

  const submit = async (data) => {
    editGameModel({
      size: data.size,
    })
    reset();
    onSubmit()
  }

  return (
    <div className="GameSizeEditor">
      <Controller
        name={"size.nodeSize"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <SliderNotched
            formLabel="Grid Node Size"
            step={1}
            disabled
            options={[2, 4, 6, 8, 10, 12, 16, 20, 24, 32, 48]}
            onChangeCommitted={(value) => {
              onChange(value)
            }}
            value={value}
          />
        )}
      />
      <Controller
        name={"size.gridWidth"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <SliderNotched
            formLabel="Grid Width"
            step={10}
            disabled
            options={[10, 30, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]}
            onChangeCommitted={(value) => {
              onChange(value)
            }}
            value={value}
          />
        )}
      />
      <Controller
        name={"size.gridHeight"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <SliderNotched
            formLabel="Grid Height"
            step={10}
            disabled
            options={[10, 30, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360]}
            onChangeCommitted={(value) => {
              onChange(value)
            }}
            value={value}
          />
        )}
      />
      <Button type="submit" onClick={handleSubmit(submit)}>Save</Button>
    </div>
  )
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
  gameSelector: state.gameSelector
});

export default connect(mapStateToProps, { editGameModel, closeGameTexturesDialog, openGameTexturesDialog })(GameSizeEditor);
