/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEvent.scss';
import { closeCreateEvent, updateCreateEvent } from '../../../store/actions/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { defaultEvent, eventEditInterface, playerTagId, PLAYER_AND_TAG_EVENT, PLAYER_TAG_EVENT, SINGLE_TAG_EVENT, TWO_TAG_EVENT } from '../../constants';
import { ON_TOUCH_ACTIVE, ON_COLLIDE_END, ON_TOUCH_START } from '../../constants';
import SelectSides from '../../ui/SelectSides/SelectSides';
import Switch from '../../../ui/Switch/Switch';
import { EVENT_ADVANCED_CONTAINER_IID, EVENT_IGNORE_SIDES_IID, EVENT_ONLY_ONCE_IID } from '../../../constants/interfaceIds';
import SelectTag from '../../ui/SelectTag/SelectTag';
import SelectEventType from '../../ui/SelectEventType/SelectEventType';
import CobrowsingNestedList from '../../cobrowsing/CobrowsingNestedList/CobrowsingNestedList';

/*



          <CobrowsingAccordianList
            listId="CreateEvent"
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
    const eventInterface = eventEditInterface[event.eventType]

    if(eventInterface.onlyOnce) {
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

    if(event.tagIdA && correctEvent && !eventInterface.tagSelectType != PLAYER_TAG_EVENT) {
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

    if(event.tagIdB && correctEvent && !eventInterface.tagSelectType != SINGLE_TAG_EVENT && !eventInterface.tagSelectType != PLAYER_TAG_EVENT) {
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
    const eventInterface = eventEditInterface[event.eventType]

    if(eventInterface.tagSelectType === PLAYER_TAG_EVENT) {
      return null
    }

    if(eventInterface.tagSelectType === SINGLE_TAG_EVENT) {
      return <SelectTag
        disabled={event.tagIdA}
        formLabel="Tag A"
        value={event.tagIdA ? [event.tagIdA] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          updateCreateEvent({
            tagIdA: newClassId,
          })
          // handleEventChange('tagIdB', newClassId)
      }}/>
    }

    if(eventInterface.tagSelectType === PLAYER_AND_TAG_EVENT) {
      return <SelectTag
        disabled={event.tagIdB}
        formLabel="Interactable Tag"
        value={event.tagIdB ? [event.tagIdB] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          updateCreateEvent({
            tagIdB: newClassId,
          })
          // handleEventChange('tagIdB', newClassId)
      }}/>
    }

    if(eventInterface.tagSelectType === TWO_TAG_EVENT) {
      return <>
        <SelectTag
          disabled={event.tagIdA}
          formLabel="Tag A"
          value={event.tagIdA ? [event.tagIdA] : []}
          onChange={(event, classes) => {
            const newClassId = classes[classes.length-1]
            updateCreateEvent({
              tagIdA: newClassId,
            })
            // handleEventChange('tagIdB', newClassId)
        }}/>
        <SelectTag
          disabled={event.tagIdB}
          formLabel="Tag B"
          value={event.tagIdB ? [event.tagIdB] : []}
          onChange={(event, classes) => {
            const newClassId = classes[classes.length-1]
            updateCreateEvent({
              tagIdB: newClassId
            })
            // handleEventChange('tagIdB', newClassId)
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
        const { tagSelectType } = eventEditInterface[eventType]
        if(tagSelectType === PLAYER_AND_TAG_EVENT || tagSelectType === PLAYER_TAG_EVENT) {
          updateCreateEvent({
            ...defaultEvent,
            eventType: eventType,
            tagIdA: playerTagId,
            eventId: event.eventId
          })
        } else {
          updateCreateEvent({
            ...defaultEvent,
            eventType: eventType,
            eventId: event.eventId
          })
        }
    }}/>
    {renderTagSelect()}
    {event.eventType && <CobrowsingNestedList interfaceId={EVENT_ADVANCED_CONTAINER_IID} id={event.eventId} title="More Options" listId="CreateEvent">{renderAdvancedOptions()}</CobrowsingNestedList>}
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateEvent, closeCreateEvent}),
)(CreateEvent);
