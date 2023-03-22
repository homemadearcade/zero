/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateStage.scss';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import SelectClass from '../../ui/SelectClass/SelectClass';
import { ZONE_CLASS } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import StageNameForm from '../StageNameForm/StageNameForm';
import SelectBackgroundColor from '../SelectBackgroundColor/SelectBackgroundColor';
import Divider from '../../../ui/Divider/Divider';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';
import SelectStageDefaultType from '../../ui/SelectStageDefaultType/SelectStageDefaultType';
import Switch from '../../../ui/Switch/Switch';

        // {/* <RadioGroupColumn
        //   formLabel={"Perspective"}
        //   value={stage.playerClassId}
        //   onChange={(e, value) => {
        //     onUpdate({
        //       playerClassId: value
        //     })
        //   }}
        //   options={[{
        //       value: directionalPlayerClassId,
        //       label: 'Overhead'
        //     },
        //     {
        //       value: jumperPlayerClassId,
        //       label: 'Platformer'
        //     },
        //   ]}
        // /> */}
const CreateStage = ({ stage, onUpdate }) => {
  return <div className='CreateStage'>
        <Typography component="h2" variant="h2">{stage.name}</Typography>
        <StageNameForm initialName={stage.name}/>
      
         <Divider></Divider>

         <SelectBackgroundColor selectedColor={stage.backgroundColor} onSelectColor={(hex) => {
            onUpdate({
              backgroundColor: hex
            })
         }}/>

         <Divider></Divider>

         <SelectStageDefaultType
            formLabel="Stage Default"
            value={stage.defaultType ? [stage.defaultType] : []}
            onChange={(event, defaultProperties) => {
              onUpdate({  ...defaultProperties[defaultProperties.length-1] })    
            }}/>

          {false && <SelectClass 
            classType={ZONE_CLASS}
            formLabel={"Into which zone should the Player spawn?"}
            value={stage.playerSpawnZoneClassId ? [stage.playerSpawnZoneClassId] : []}
            onChange={(event, entityClasses) => {
              const newClassId = entityClasses[entityClasses.length-1]
              onUpdate({
                playerSpawnZoneClassId: newClassId
              })
          }}/>}
        <CobrowsingNestedList id={'stage'} title="Customize" listId="StageCustomize">
          <>
          {<SelectClass
            formLabel="Should the player spawn as a new class? ( Leave blank to keep the same hero )"
            value={stage.playerClassId ? [stage.playerClassId] : []}
            onChange={(event, entityClasses) => {
              const newClassId = entityClasses[entityClasses.length-1]
              onUpdate({
                playerClassId: newClassId
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
