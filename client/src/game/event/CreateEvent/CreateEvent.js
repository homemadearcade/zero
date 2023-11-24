/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEvent.scss';
import { closeCreateEvent, updateCreateEvent } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { defaultEvent, eventInterfaceData, PLAYER_RELATION_TAG_ID } from '../../constants';
import { ON_TOUCH_ACTIVE, ON_COLLIDE_END, ON_TOUCH_START } from '../../constants';
import SelectSides from '../../ui/SelectSides/SelectSides';
import Switch from '../../../ui/Switch/Switch';
import { CUTSCENE_EVENT_IID, EVENT_ADD_RELATION_TAG_A_IID, EVENT_ADD_RELATION_TAG_B_IID, EVENT_ADVANCED_CONTAINER_IID, EVENT_IGNORE_SIDES_IID, EVENT_ONLY_ONCE_IID,  PLAYER_AND_RELATION_TAG_EVENT_IID, PLAYER_RELATION_TAG_EVENT_IID, SINGLE_RELATION_TAG_EVENT_IID, STAGE_EVENT_IID, TWO_RELATION_TAG_EVENT_IID  } from '../../../constants/interfaceIds';
import SelectRelationTag from '../../ui/SelectRelationTag/SelectRelationTag';
import SelectEventType from '../../ui/SelectEventType/SelectEventType';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';
import SelectCutscene from '../../ui/SelectCutscene/SelectCutscene';
import SelectStage from '../../ui/SelectStage/SelectStage';

/*



          <CobrowsingAccordianList
            interfaceGroupId="CreateEvent"
            accordians={[{
                id: 'Advanced',
                title: <>
                  Advanced
                </>,
                body: <>
                  {advancedOptions}
                </>
              }
            ]}
          />

*/

const CreateEvent = ({ updateCreateEvent, gameFormEditor: { event }}) => {
  function renderAdvancedOptions() {
    if(!event.eventType) return
    const correctEvent = event.eventType === ON_TOUCH_START || event.eventType === ON_TOUCH_ACTIVE || event.eventType === ON_COLLIDE_END
    const advancedOptions = []
    const eventTypeInterface = eventInterfaceData[event.eventType]

    if(eventTypeInterface.onlyOnce) {
      advancedOptions.push(<Unlockable key={"event/onlyOnce"} interfaceId={EVENT_ONLY_ONCE_IID}>
        <Switch
          labels={['Recurring', 'Only Occurs Once']}
          size="small"
          onChange={(e) => {
            updateCreateEvent({ onlyOnce: e.target.checked })
          }}
          checked={event.onlyOnce}
         />
      </Unlockable>)
    }

    if(event.relationTagIdA && correctEvent && !eventTypeInterface.relationTagSelectType != PLAYER_RELATION_TAG_EVENT_IID) {
      advancedOptions.push(
        <Unlockable interfaceId={EVENT_IGNORE_SIDES_IID}>
          <SelectSides
            key="event/sidesA"
            formLabel={"Touching which side of Tag A? ( leave blank for all sides )"}
            value={event.sidesA ? event.sidesA : []}
            onChange={(event, sides) => {
              updateCreateEvent({
                sidesA: sides
              })
            }}
          />
        </Unlockable>
      )
    }

    if(event.relationTagIdB && correctEvent && !eventTypeInterface.relationTagSelectType != SINGLE_RELATION_TAG_EVENT_IID && !eventTypeInterface.relationTagSelectType != PLAYER_RELATION_TAG_EVENT_IID) {
      advancedOptions.push(<Unlockable interfaceId={EVENT_IGNORE_SIDES_IID}>
        <SelectSides
          key="event/sidesB"
          formLabel={"Touching which side of Tag B? ( leave blank for all sides )"}
          value={event.sidesB ? event.sidesB : []}
          onChange={(event, sides) => {
            updateCreateEvent({
              sidesB: sides
            })
        }}/>
    </Unlockable>)
    }

    return advancedOptions
  }

  function renderTagSelect() {
    if(!event.eventType) return
    const eventTypeInterface = eventInterfaceData[event.eventType]

    if(eventTypeInterface.relationTagSelectType === CUTSCENE_EVENT_IID) {
      return <SelectCutscene
        key={'effectCutsceneId'}
        formLabel={'Cutscene'}
        value={event.cutsceneId ? [event.cutsceneId] : []}
        onChange={(event, cutscenes) => {
          const newCutsceneId = cutscenes[cutscenes.length-1]
          updateCreateEvent({
            cutsceneId: newCutsceneId,
          })
        }}/>
    }

    if(eventTypeInterface.relationTagSelectType === STAGE_EVENT_IID) {
      return <SelectStage
        key={'stageId'}
        formLabel={'Stage'}
        value={event.stageId ? [event.stageId] : []}
        onChange={(event, stages) => {
          const newstageId = stages[stages.length-1]
          updateCreateEvent({
            stageId: newstageId,
          })
        }}/>
    }

    if(eventTypeInterface.relationTagSelectType === PLAYER_RELATION_TAG_EVENT_IID) {
      return null
    }

    if(eventTypeInterface.relationTagSelectType === SINGLE_RELATION_TAG_EVENT_IID) {
      return <SelectRelationTag
        formLabel="Tag A"
        interfaceId={EVENT_ADD_RELATION_TAG_A_IID}
        value={event.relationTagIdA ? [event.relationTagIdA] : []}
        onChange={(event, entityModels) => {
          const newEntityId = entityModels[entityModels.length-1]
          updateCreateEvent({
            relationTagIdA: newEntityId,
          })
          // handleEventChange('relationTagIdB', newEntityId)
      }}/>
    }

    if(eventTypeInterface.relationTagSelectType === PLAYER_AND_RELATION_TAG_EVENT_IID) {
      return <SelectRelationTag
        interfaceId={EVENT_ADD_RELATION_TAG_B_IID}
        formLabel="Interactable Tag"
        value={event.relationTagIdB ? [event.relationTagIdB] : []}
        onChange={(event, entityModels) => {
          const newEntityId = entityModels[entityModels.length-1]
          updateCreateEvent({
            relationTagIdB: newEntityId,
          })
          // handleEventChange('relationTagIdB', newEntityId)
      }}/>
    }

    if(eventTypeInterface.relationTagSelectType === TWO_RELATION_TAG_EVENT_IID) {
      return <>
        <SelectRelationTag
          interfaceId={EVENT_ADD_RELATION_TAG_A_IID}
          formLabel="Tag A"
          value={event.relationTagIdA ? [event.relationTagIdA] : []}
          onChange={(event, entityModels) => {
            const newEntityId = entityModels[entityModels.length-1]
            updateCreateEvent({
              relationTagIdA: newEntityId,
            })
            // handleEventChange('relationTagIdB', newEntityId)
        }}/>
        <SelectRelationTag
          interfaceId={EVENT_ADD_RELATION_TAG_B_IID}
          formLabel="Tag B"
          value={event.relationTagIdB ? [event.relationTagIdB] : []}
          onChange={(event, entityModels) => {
            const newEntityId = entityModels[entityModels.length-1]
            updateCreateEvent({
              relationTagIdB: newEntityId
            })
            // handleEventChange('relationTagIdB', newEntityId)
        }}/>
      </>
    }
  }

  return <div className="CreateEvent">
    <SelectEventType
      formLabel="When?"
      value={event.eventType ? [event.eventType] : []}
      onChange={(event, eventTypes) => {
        const eventType = eventTypes[eventTypes.length-1]
        if(!eventType) return
        const { relationTagSelectType } = eventInterfaceData[eventType]
        if(relationTagSelectType === PLAYER_AND_RELATION_TAG_EVENT_IID || relationTagSelectType === PLAYER_RELATION_TAG_EVENT_IID) {
          updateCreateEvent({
            ...defaultEvent,
            eventType: eventType,
            relationTagIdA: PLAYER_RELATION_TAG_ID,
          })
        } else {
          updateCreateEvent({
            ...defaultEvent,
            eventType: eventType,
          })
        }
    }}/>
    {renderTagSelect()}
    {event.eventType && <CobrowsingNestedList interfaceId={EVENT_ADVANCED_CONTAINER_IID} title="More Options" interfaceGroupId="CreateEvent">{renderAdvancedOptions()}</CobrowsingNestedList>}
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateEvent, closeCreateEvent}),
)(CreateEvent);
