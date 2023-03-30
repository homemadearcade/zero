import React from 'react';
import { connect } from 'react-redux';

import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import { useForm } from 'react-hook-form';
import Button from '../../../../ui/Button/Button';
import GameRoomForm from '../GameRoomForm/GameRoomForm';

const GameRoomEditForm = ({ editExperienceModel, gameRoomId, experienceModel: { experienceModel, isSaving }, onSubmit}) => {
  const gameRoom = experienceModel.gameRooms[gameRoomId]
  
  const { handleSubmit, trigger, setValue, control, formState: { isValid }, register } = useForm({
    defaultValues: gameRoom
  });

  const submit = async (data) => {
    editExperienceModel(experienceModel.id, {
      gameRooms: {
        [gameRoomId]: {
          ...data
        }
      }
    })
    if(onSubmit) onSubmit()
  }

  return (
    <div className="GameRoomEditForm">
      <form>
        <GameRoomForm trigger={trigger} setValue={setValue} isEdit control={control} register={register} />
        <br/>
        <Button disabled={isSaving || !isValid} type="submit" onClick={handleSubmit(submit)}>Save</Button>
        <Button disabled={gameRoom.isNotRemoveable} onClick={() => {
          editExperienceModel(experienceModel.id, {
            gameRooms: {
              [gameRoomId]: {
                isRemoved: true
              }
            }
          })
        }}>Remove</Button>
      </form>
    </div>
  )
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { editExperienceModel })(GameRoomEditForm);
