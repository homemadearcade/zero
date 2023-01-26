/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SetupDefaultsModal.scss';
import CobrowsingModal from '../cobrowsing/CobrowsingModal/CobrowsingModal';
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { closeSetupDefaultsModal } from '../../store/actions/gameEditorActions';
import CobrowsingVerticalLinearStepper from '../cobrowsing/CobrowsingVerticalLinearStepper/CobrowsingVerticalLinearStepper';
import Typography from '../../ui/Typography/Typography';
import AggregateColorSelect from '../color/AggregateColorSelect/AggregateColorSelect';
import { editGameModel } from '../../store/actions/gameModelActions';
import { BOUNDARY_COLLIDE, BOUNDARY_DESTROY, BOUNDARY_WRAP, STAGE_BACKGROUND_CANVAS_ID } from '../constants';
import Button from '../../ui/Button/Button';
import RadioGroupColumn from '../../ui/RadioGroupColumn/RadioGroupColumn';


            // <Typography component="h5" variant="h5">
                
            //   </Typography>
const SetupDefaultsModal = ({ closeSetupDefaultsModal, editGameModel, gameModel: { gameModel }, gameContext: { currentStageId }}) => {
  function handleClose() {
    closeSetupDefaultsModal()
  }

  return <CobrowsingModal open onClose={handleClose}>
    <div className="SetupDefaultsModal">
      <CobrowsingVerticalLinearStepper
        stepperId="EditingGameSetup"
        steps={[
          {
            id: 'Background Color',
            title: <Typography component="h5" variant="h5">Background Color</Typography>,
            instructions: <>
              <AggregateColorSelect 
                selectedColor={gameModel.stages[currentStageId].backgroundColor}
                canvasId={STAGE_BACKGROUND_CANVAS_ID} 
                onSelectColor={(hex) => {
                  editGameModel({
                    stages: {
                      [currentStageId] : {
                        backgroundColor: hex
                      }
                    }
                  })
                }}
              />
            </>,
            onClickNext:() => {

            }
          },
          {
            id: 'Overhead or Platformer',
            title: <Typography component="h5" variant="h5">Overhead or Platformer</Typography>,
            instructions: <>
              <Typography component="subtitle1" variant="subtitle1">From what perspective are we viewing all of the objects?</Typography><br/>
              <RadioGroupColumn
                value={gameModel.defaults?.playerClass}
                onChange={(e, value) => {
                  editGameModel({
                    defaults: {
                     playerClass: value
                    }
                  })
                }}
                options={[{
                  value: 'DIRECTIONAL_PLAYER',
                  label: 'Overhead'
                },
                {
                  value: 'JUMPER_PLAYER',
                  label: 'Platformer'
                },
                ]}
              />
            </>
          },
          {
            id: 'Boundary',
            title: <Typography component="h5" variant="h5">Boundary</Typography>,
            instructions: <>
              <Typography component="subtitle1" variant="subtitle1">What happens when the object you control touches the boundary?</Typography>
              <RadioGroupColumn
                value={gameModel.defaults?.boundaryRelation}
                onChange={(e, value) => {
                  editGameModel({
                    defaults: {
                     boundaryRelation: value
                    }
                  })
                }}
                options={[{
                  value: BOUNDARY_COLLIDE,
                  label: 'Stop Object'
                },
                // {
                //   value: BOUNDARY_DESTROY,
                //   label: 'Destroy Object'
                // },
                {
                  value: BOUNDARY_WRAP,
                  label: 'Flip Object to other side'
                }
                ]}
              />
            </>
          },
        ]}
         completed={<>
          <Button onClick={async () => {
            if(gameModel.defaults.playerClass === 'JUMPER_PLAYER') {
              await editGameModel({
                stages: {
                 ['stage/default']: {
                    playerClassId: 'oc/pl/jumper'
                 }
                }
              })
              editGameModel({
                classes: {
                 ['oc/pl/jumper']: {
                    boundaryRelation: gameModel.defaults.boundaryRelation
                 }
                }
              })
            } else {
              await editGameModel({
                stages: {
                 ['stage/default']: {
                    playerClassId: 'oc/pl/directional'
                 }
                }
              })
              editGameModel({
                classes: {
                 ['oc/pl/directional']: {
                    boundaryRelation: gameModel.defaults.boundaryRelation
                 }
                }
              })
            }
            handleClose()
          }}>Enter your game</Button>
        </>}
      />
    </div>
  </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameContext: state.gameContext
})

export default compose(
  connect(mapStateToProps, { closeSetupDefaultsModal, editGameModel }),
)(SetupDefaultsModal);
