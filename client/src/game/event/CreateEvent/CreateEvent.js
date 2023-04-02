/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEvent.scss';
import { closeCreateEvent, updateCreateEvent } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { defaultEvent, eventTypeInterfaces, playerRelationTagId, PLAYER_AND_RELATION_TAG_EVENT, PLAYER_RELATION_TAG_EVENT, SINGLE_RELATION_TAG_EVENT, TWO_RELATION_TAG_EVENT } from '../../constants';
import { ON_TOUCH_ACTIVE, ON_COLLIDE_END, ON_TOUCH_START } from '../../constants';
import SelectSides from '../../ui/SelectSides/SelectSides';
import Switch from '../../../ui/Switch/Switch';
import { EVENT_ADVANCED_CONTAINER_IID, EVENT_IGNORE_SIDES_IID, EVENT_ONLY_ONCE_IID } from '../../../constants/interfaceIds';
import SelectRelationTag from '../../ui/SelectRelationTag/SelectRelationTag';
import SelectEventType from '../../ui/SelectEventType/SelectEventType';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';

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
    const eventTypeInterface = eventTypeInterfaces[event.eventType]

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

    if(event.relationTagIdA && correctEvent && !eventTypeInterface.relationTagSelectType != PLAYER_RELATION_TAG_EVENT) {
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

    if(event.relationTagIdB && correctEvent && !eventTypeInterface.relationTagSelectType != SINGLE_RELATION_TAG_EVENT && !eventTypeInterface.relationTagSelectType != PLAYER_RELATION_TAG_EVENT) {
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
    const eventTypeInterface = eventTypeInterfaces[event.eventType]

    if(eventTypeInterface.relationTagSelectType === PLAYER_RELATION_TAG_EVENT) {
      return null
    }

    if(eventTypeInterface.relationTagSelectType === SINGLE_RELATION_TAG_EVENT) {
      return <SelectRelationTag
        disabled={event.relationTagIdA}
        formLabel="Tag A"
        value={event.relationTagIdA ? [event.relationTagIdA] : []}
        onChange={(event, entityModels) => {
          const newEntityId = entityModels[entityModels.length-1]
          updateCreateEvent({
            relationTagIdA: newEntityId,
          })
          // handleEventChange('relationTagIdB', newEntityId)
      }}/>
    }

    if(eventTypeInterface.relationTagSelectType === PLAYER_AND_RELATION_TAG_EVENT) {
      return <SelectRelationTag
        disabled={event.relationTagIdB}
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

    if(eventTypeInterface.relationTagSelectType === TWO_RELATION_TAG_EVENT) {
      return <>
        <SelectRelationTag
          disabled={event.relationTagIdA}
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
          disabled={event.relationTagIdB}
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
        const { relationTagSelectType } = eventTypeInterfaces[eventType]
        if(relationTagSelectType === PLAYER_AND_RELATION_TAG_EVENT || relationTagSelectType === PLAYER_RELATION_TAG_EVENT) {
          updateCreateEvent({
            ...defaultEvent,
            eventType: eventType,
            relationTagIdA: playerRelationTagId,
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
