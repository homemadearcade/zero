/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './StageLiveEditor.scss';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import SelectStageColor from '../SelectStageColor/SelectStageColor';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';
import SelectStageClass from '../../ui/SelectStageClass/SelectStageClass';
import Switch from '../../../ui/Switch/Switch';
import { LIVE_EDIT_STAGE_COLOR_TAB_IID, LIVE_EDIT_STAGE_GRAVITY_TAB_IID, LIVE_EDIT_STAGE_TAB_CONTAINER_IID, PLAYER_ENTITY_IID, STAGE_CUSTOMIZE_IID, STAGE_GRAVITY_X_IID, STAGE_GRAVITY_Y_IID, STAGE_SPAWN_ZONE_SELECT_IID, LIVE_EDIT_STAGE_SPAWN_TAB_IID, ZONE_ENTITY_IID, LIVE_EDIT_STAGE_PERSPECTIVE_TAB_IID, EDIT_CONTENT_STAGES_TAB_IID } from '../../../constants/interfaceIds';
import SelectEntityModel from '../../ui/SelectEntityModel/SelectEntityModel';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import CobrowsingTabs from '../../cobrowsing/CobrowsingTabs/CobrowsingTabs';
import Button from '../../../ui/Button/Button';
import { closeStageLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import Icon from '../../../ui/Icon/Icon';
import IconButton from '../../../ui/IconButton/IconButton';
import { openCreateStageDialog, openEditContentDialog } from '../../../store/actions/game/gameFormEditorActions';

        // {/* <RadioGroupColumn
        //   formLabel={"Perspective"}
        //   value={stage.playerEntityModelId}
        //   onChange={(e, value) => {
        //     onUpdate({
        //       playerEntityModelId: value
        //     })
        //   }}
        //   options={[{
        //       value: directionalPlayerEntityId,
        //       label: 'Overhead'
        //     },
        //     {
        //       value: jumperPlayerEntityId,
        //       label: 'Platformer'
        //     },
        //   ]}
        // /> */}
const StageLiveEditor = ({ 
  openCreateStageDialog, 
  editGameModel, 
  openEditContentDialog,
  gameModel: { gameModel }, 
  gameRoomInstance: { gameRoomInstance: { currentStageId } },
  closeStageLiveEditor
 }) => {
  const stage = gameModel.stages[currentStageId]

  const backgroundColorTab = {
    label: 'Background Color',
    interfaceId: LIVE_EDIT_STAGE_COLOR_TAB_IID,
    body: <>
      <SelectStageColor selectedColor={stage.color} onSelectColor={(hex) => {
        editGameModel({
          stages: {
            [stage.stageId] : {
              color: hex
            }
          }
        })
      }}/>
    </>
  }

  const perspectiveTab = {
    label: 'Perspective',
    interfaceId: LIVE_EDIT_STAGE_PERSPECTIVE_TAB_IID,
    body: <>
      <SelectStageClass
        value={stage.defaultType ? [stage.defaultType] : []}
        onChange={(stageClassProperties) => {
          const entityModelId = stageClassProperties.entityModelId
          const newStage = {
            playerEntityModelId: entityModelId,
            ...stageClassProperties
          }

          editGameModel({
            stages: {
            [stage.stageId] : {
                ...newStage
            }
          }})    
      }}/>
      <CobrowsingNestedList interfaceId={STAGE_CUSTOMIZE_IID} title="Customize" interfaceGroupId="StageCustomize">
        <>
          {<SelectEntityModel
            formLabel="Should the player spawn as a new class? ( Leave blank to keep the same hero )"
            interfaceId={STAGE_CUSTOMIZE_IID}
            entityModelClass={PLAYER_ENTITY_IID}
            value={stage.playerEntityModelId ? [stage.playerEntityModelId] : []}
            onChange={(event, entityModels) => {
              const newEntityId = entityModels[entityModels.length-1]
              editGameModel({
                stages: {
                  [stage.stageId] : {
                    playerEntityModelId: newEntityId
                  }
                }
              })
            }}/>}
        </>
        {<Switch
          labels={["No Gravity", "Gravity"]}
          checked={stage.gravityY}
          onChange={(e) => {
            editGameModel({
              stages: {
                [stage.stageId] : {
                  gravityY: e.target.checked
                }
              }
            })
          }}
        >
        </Switch>}
      </CobrowsingNestedList>
    </>
  }

  const gravityTab = {
    label: 'Gravity',
    interfaceId: LIVE_EDIT_STAGE_GRAVITY_TAB_IID,
    body: <>
        <Unlockable interfaceId={STAGE_GRAVITY_Y_IID}>
        <SliderNotched
          formLabel="Gravity ⇵"
          step={0.5}
          options={[-10, -5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5, 10]}
          onChangeCommitted={(value) => {
            editGameModel({ stages: { [stage.stageId] : { gravity: { y: value } }} })        
          }}
          value={stage.gravity.y}
        />
      </Unlockable>
      <Unlockable interfaceId={STAGE_GRAVITY_X_IID}>
        <SliderNotched
          formLabel="Gravity ⇆"
          step={0.5}
          options={[-10, -5, -2.5, -1, -0.5, 0, 0.5, 1, 2.5, 5, 10]}
          onChangeCommitted={(value) => {
            editGameModel({ stages: { [stage.stageId]: { gravity: { x: value } }} })        
          }}
          value={stage.gravity.x}
        />
      </Unlockable>
    </>
  }

  const spawnTab = {
    label: 'Spawn',
    interfaceId: LIVE_EDIT_STAGE_SPAWN_TAB_IID,
    body: <>
      <SelectEntityModel
        entityModelClass={ZONE_ENTITY_IID}
        interfaceId={STAGE_SPAWN_ZONE_SELECT_IID}
        formLabel={"Into which zone should the Player spawn?"}
        value={stage.playerSpawnZoneEntityId ? [stage.playerSpawnZoneEntityId] : []}
        onChange={(event, entityModels) => {
          const newEntityId = entityModels[entityModels.length-1]
          editGameModel({
            stages: {
              [stage.stageId] : {
                playerSpawnZoneEntityId: newEntityId
              }
            }
          })
      }}/>
    </>
  }

  const tabs = [backgroundColorTab, perspectiveTab, gravityTab, spawnTab]

  return <div className='StageLiveEditor'>
    <div className="StageLiveEditor__close"><Button onClick={closeStageLiveEditor}><Icon icon="faClose"/></Button></div>
   <div className="StageLiveEditor__name">
      <Typography component="h4" variant="h4">
        {stage.name}
      </Typography>
      <IconButton icon="faPen" color="primary" onClick={() => {
        openCreateStageDialog(stage)
      }}/> 
      <IconButton icon="faShuffle" color="primary" onClick={() => {
        openEditContentDialog(EDIT_CONTENT_STAGES_TAB_IID)
        closeStageLiveEditor()
      }}/> 
    </div>
    <CobrowsingTabs tabs={tabs} interfaceGroupId={LIVE_EDIT_STAGE_TAB_CONTAINER_IID}/>
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameRoomInstance: state.gameRoomInstance,
})

export default compose(
  connect(mapStateToProps, { editGameModel, closeStageLiveEditor, openCreateStageDialog, openEditContentDialog }),
)(StageLiveEditor);
