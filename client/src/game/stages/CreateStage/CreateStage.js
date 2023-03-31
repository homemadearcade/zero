/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateStage.scss';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import SelectEntity from '../../ui/SelectEntityModel/SelectEntityModel';
import { ZONE_CLASS } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import StageNameForm from '../StageNameForm/StageNameForm';
import SelectStageColor from '../SelectStageColor/SelectStageColor';
import Divider from '../../../ui/Divider/Divider';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';
import SelectStageDefaultType from '../../ui/SelectStageDefaultType/SelectStageDefaultType';
import Switch from '../../../ui/Switch/Switch';

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
const CreateStage = ({ stage, onUpdate }) => {
  return <div className='CreateStage'>
        <Typography component="h2" variant="h2">{stage.name}</Typography>
        <StageNameForm initialName={stage.name}/>
      
         <Divider></Divider>

         <SelectStageColor selectedColor={stage.color} onSelectColor={(hex) => {
            onUpdate({
              color: hex
            })
         }}/>

         <Divider></Divider>

         <SelectStageDefaultType
            formLabel="Stage Default"
            value={stage.defaultType ? [stage.defaultType] : []}
            onChange={(event, defaultProperties) => {
              onUpdate({  ...defaultProperties[defaultProperties.length-1] })    
            }}/>

          {false && <SelectEntity 
            entityModelType={ZONE_CLASS}
            formLabel={"Into which zone should the Player spawn?"}
            value={stage.playerSpawnZoneEntityId ? [stage.playerSpawnZoneEntityId] : []}
            onChange={(event, entityModels) => {
              const newEntityId = entityModels[entityModels.length-1]
              onUpdate({
                playerSpawnZoneEntityId: newEntityId
              })
          }}/>}
        <CobrowsingNestedList id={'stage'} title="Customize" listId="StageCustomize">
          <>
          {<SelectEntity
            formLabel="Should the player spawn as a new class? ( Leave blank to keep the same hero )"
            value={stage.playerEntityModelId ? [stage.playerEntityModelId] : []}
            onChange={(event, entityModels) => {
              const newEntityId = entityModels[entityModels.length-1]
              onUpdate({
                playerEntityModelId: newEntityId
              })
            }}/>}
          </>
          {<Switch
            labels={["No Gravity", "Gravity"]}
            checked={stage.gravityY}
            onChange={(e) => {
              onUpdate({
                gravityY: e.target.checked
              })
            }}
          >
          </Switch>}
        </CobrowsingNestedList>
    </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {

})

export default compose(
  connect(mapStateToProps, {}),
)(CreateStage);
