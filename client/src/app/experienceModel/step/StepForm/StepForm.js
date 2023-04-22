import React from 'react';
import { connect } from 'react-redux';

import { Controller, useWatch } from 'react-hook-form';
import {  GAME_ROOM_ACTIVITY, INSTRUCTION_GAME_ROOM, INSTRUCTION_LOBBY } from '../../../../constants';
import SelectRole from '../../../../ui/connected/SelectRole/SelectRole';
import SelectActivity from '../../../../ui/connected/SelectActivity/SelectActivity';
import Divider from '../../../../ui/Divider/Divider';
import SelectGameInstanceEffect from '../../../../game/ui/SelectGameInstanceEffect/SelectGameInstanceEffect';
import Switch from '../../../../ui/Switch/Switch';
import SelectViewCategory from '../../../../ui/SelectViewCategory/SelectViewCategory';

const StepForm = ({ register, control, instruction, experienceModel : { experienceModel }, step }) => { 

  const activityId = useWatch({
    control,
    name: "activityId",
  })


  const changeViewCategory = useWatch({
    control,
    name: "changeViewCategory",
  })

  const activity = experienceModel.activitys[activityId]

  function renderChangeView() {
    if(instruction.instructionCategory === INSTRUCTION_LOBBY) {
      return <>
        {activity && <>
            <Divider/>
            <Controller
              {...register("changeViewCategory", {
                // required: true,
              })}
            name={`changeViewCategory`}
            control={control}
            render={({ field: { onChange, value } }) => (
              <Switch 
                labels={["Keep previous view", "Change View"]}
                onChange={(event) => {
                  onChange(event.target.checked)
                }} checked={value} />
            )}
          />
        </>}

        {changeViewCategory && activity && <>
          <br/>
          <Controller
            {...register("viewCategory", {
              required: true
            })}
            name={"viewCategory"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectViewCategory
                activityCategory={activity.activityCategory}
                formLabel={"Which view will this step switch to"}
                value={[value]}
                onChange={(event, viewCategory) => {
                  onChange(viewCategory)
                }}/>
            )}
          />
        </>}
      </>
    }

    if(instruction.instructionCategory === INSTRUCTION_GAME_ROOM) {
      return <>
        <Divider/>
        <Controller
            {...register("changeViewCategory", {
              // required: true,
            })}
          name={`changeViewCategory`}
          control={control}
          render={({ field: { onChange, value } }) => (
            <Switch 
              labels={["Keep previous view", "Change View"]}
              onChange={(event) => {
                onChange(event.target.checked)
              }} checked={value} />
          )}
        />

        {changeViewCategory && <>
          <br/>
          <Controller
            {...register("viewCategory", {
              required: true
            })}
            name={"viewCategory"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <SelectViewCategory
                activityCategory={GAME_ROOM_ACTIVITY}
                formLabel={"Which view will this step switch to"}
                value={[value]}
                onChange={(event, viewCategory) => {
                  onChange(viewCategory)
                }}/>
            )}
          />
        </>}
      </>
    }
  }

  return <>
    <Controller
        {...register("cobrowsingRoleId", {
          required: true,
        })}
      name={`cobrowsingRoleId`}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectRole
        formLabel="Browsing Role:"
        onSelect={(roleIds) => {
          if(!roleIds || roleIds.length === 0) return
          const roleId = roleIds[roleIds.length - 1]
          onChange(roleId)
        }} value={value ? [value] : []} />
      )}
    />
    {instruction.instructionCategory === INSTRUCTION_LOBBY && <>
      <Divider/>
      <Controller
        {...register("activityId", {
          required: true
        })}
        name={"activityId"}
        control={control}
        render={({ field: { onChange, value } }) => (
          <SelectActivity
            activitys={experienceModel.activitys}
            formLabel={"Which activity will be active during this step?"}
            value={[value]}
            onChange={(event, activityId) => {
              onChange(activityId)
            }}/>
        )}
      />
    </>}
    {instruction.instructionCategory === INSTRUCTION_GAME_ROOM &&  <Controller
      {...register("effectIds", {
        required: true
      })}
      name={"effectIds"}
      control={control}
      render={({ field: { onChange, value } }) => (
        <SelectGameInstanceEffect
          formLabel="What changes occur when this step is loaded?" onChange={(event, effectIds) => {
          onChange(effectIds)
        }} value={value ? value : []} />
      )}
    />}

    {renderChangeView()}

  </>
};

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { })(StepForm);
