import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import { editExperienceModel } from '../../../../store/actions/experience/experienceModelActions';
import { useForm } from 'react-hook-form';
import Button from '../../../../ui/Button/Button';
import InstructionForm from '../InstructionForm/InstructionForm';
import StepBuilder from '../StepBuilder/StepBuilder';
import { loadArcadeGameByMongoId, unloadArcadeGame } from '../../../../store/actions/game/arcadeGameActions';
import Loader from '../../../../ui/Loader/Loader';
import StepAddForm from '../StepAddForm/StepAddForm';
import GameCard from '../../../gameModel/GameCard/GameCard';
import Typography from '../../../../ui/Typography/Typography';
import { INSTRUCTION_GAME_ROOM } from '../../../../constants';

const InstructionEditForm = ({ loadArcadeGameByMongoId, unloadArcadeGame, editExperienceModel, instructionId, gameModel: { gameModel, isLoading }, experienceModel: { experienceModel, isSaving }, onSubmit}) => {
  const instruction = experienceModel.instructions[instructionId]
  
  useEffect(() => {
    if(instruction.arcadeGameMongoId) {
      loadArcadeGameByMongoId(instruction.arcadeGameMongoId)
    }
    return () => {
      unloadArcadeGame()
    }
  }, [])

  const { handleSubmit, control, formState: { isValid }, register } = useForm({
    defaultValues: instruction
  });
  const submit = async (data) => {
    editExperienceModel(experienceModel.id, {
      instructions: {
        [instructionId]: {
          ...data
        }
      }
    })
    if(onSubmit) onSubmit()
  }


  if(instruction.arcadeGameMongoId && (!gameModel || isLoading)) return <Loader/>

  return (
    <div className="InstructionEditForm">
      <form>
        <InstructionForm isEdit control={control} register={register} />
        <br/>
        <Button disabled={isSaving || !isValid} type="submit" onClick={handleSubmit(submit)}>Save</Button>
        <Button disabled={instruction.isNotRemoveable} onClick={() => {
          editExperienceModel(experienceModel.id, {
            instructions: {
              [instructionId]: {
                isRemoved: true
              }
            }
          })
        }}>Remove</Button>
        {gameModel && <GameCard game={gameModel} />}
        <Typography variant="h2">{instruction.instructionCategory === INSTRUCTION_GAME_ROOM ? 'Game Room Steps': 'Lobby Steps'}</Typography>
        <StepBuilder control={control} register={register} instructionId={instructionId}/>
        <StepAddForm
          instructionCategory={instruction.instructionCategory}
          onSubmit={(step) => {
            editExperienceModel(experienceModel.id, {
              instructions: {
                [instructionId]: {
                  steps: {
                    [step.stepId]: step
                  },
                  stepOrder: [
                    ...instruction.stepOrder,
                    step.stepId
                  ]
                }
              },
            })
          }}/>
      </form>
    </div>
  )
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
  gameModel: state.gameModel
});

export default connect(mapStateToProps, { loadArcadeGameByMongoId, unloadArcadeGame, editExperienceModel })(InstructionEditForm);
