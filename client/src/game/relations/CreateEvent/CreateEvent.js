/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEvent.scss';
import CobrowsingModal from '../../../game/cobrowsing/CobrowsingModal/CobrowsingModal';
import { closeCreateEvent, updateCreateEvent } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import { eventEditInterface, EVENT_ID_PREFIX, NO_TAG_EVENT, SINGLE_TAG_EVENT, TWO_TAG_EVENT } from '../../constants';
import { ON_COLLIDE_ACTIVE, ON_COLLIDE_END, ON_COLLIDE_START } from '../../constants';
import SelectSides from '../../ui/SelectSides/SelectSides';
import { getClassAandB } from '../../../utils/gameUtils';
import Switch from '../../../ui/Switch/Switch';
import Typography from '../../../ui/Typography/Typography';
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import { EFFECT_ADVANCED_CONTAINER_IID, EVENT_DELAY_IID, EVENT_DELAY_INTERVAL_IID, EVENT_IGNORE_SIDES_IID, EVENT_ONLY_ONCE_IID } from '../../../constants/interfaceIds';
import SelectTag from '../../ui/SelectTag/SelectTag';
import SelectEventType from '../../ui/SelectEventType/SelectEventType';

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

const CreateEvent = ({ closeCreateEvent, editGameModel, updateCreateEvent, gameFormEditor: { event }, gameModel: { gameModel} }) => {
  function handleClose() {
    closeCreateEvent()
  }

  useEffect(() => {
    if(!event.eventId) {
      updateCreateEvent({ eventId: EVENT_ID_PREFIX+generateUniqueId(), isNew: true })
    }
  }, [])

  function isAutosaveDisabled() {
    if(!event.type) return true
    const eventInterface = eventEditInterface[event.type]


    // if(eventInterface.tagSelectType === NO_TAG_EVENT) {
     
    // }

    if(eventInterface.tagSelectType === SINGLE_TAG_EVENT) {
      if(!event.tagId) return
    }

    if(eventInterface.tagSelectType === TWO_TAG_EVENT) {
      if(!event.tagIdA || !event.tagIdB) return 
    }
    return false 
  }

  // const handleEventChange = (prop, value) => {
  //   event[prop] = value
  //   updateCreateEvent(event)
  // }

  function renderEventForms() {
    const eventInterface = eventEditInterface[event.type]
    if(!event.type) return

    const forms = []
    if(eventInterface.onlyOnce) {
      forms.push(<Unlockable key={"event/onlyOnce"} interfaceId={EVENT_ONLY_ONCE_IID}>
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

    if(eventInterface.delayEffect) {
      forms.push(<Unlockable key={"event/delayEffect"} interfaceId={EVENT_DELAY_IID}>
        <SliderNotched
          formLabel="Delay Effect (ms)"
          step={10}
          options={[0, 10, 50, 100, 200, 400, 1000, 3000, 6000, 9000, 15000, 20000]}
          onChangeCommitted={(value) => {
            updateCreateEvent({
              'delayEffect': value
            })
          }}
          value={event.delayEffect || 0}
        />
      </Unlockable>)
    }

    return forms
  }

  function renderAdvancedOptions() {
    if(!event.type) return
    const { tagA, tagB } = getClassAandB(event.tagIdA, event.tagIdB)
    const eventInterface = eventEditInterface[event.type]
    const advancedOptions = [
      !event.onlyOnce && eventInterface.delayInterval && <Unlockable interfaceId={EVENT_DELAY_INTERVAL_IID}>
        <SliderNotched
          key="event/delayInterval"
          formLabel="Delay Interval (ms)"
          step={10}
          options={[100, 200, 400, 1000, 3000]}
          onChangeCommitted={(value) => {
            updateCreateEvent({delayInterval: value})
          }}
          value={event.delayInterval || 200}
        />
      </Unlockable>,
      tagB && (event.type === ON_COLLIDE_START || event.type === ON_COLLIDE_ACTIVE || event.type === ON_COLLIDE_END) && <Unlockable interfaceId={EVENT_IGNORE_SIDES_IID}>
        <SelectSides
          key="event/sidesA"
          formLabel={"Touching which side of " + tagA.name + '? ( leave blank for all sides )'}
          value={event.sidesA ? event.sidesA : []}
          onChange={(event, sides) => {
            updateCreateEvent({
              sidesA: sides
            })
          }}
        />
        <SelectSides
          key="event/sidesB"
          formLabel={"Touching which side of " + tagB.name + '? ( leave blank for all sides )'}
          value={event.sidesB ? event.sidesB : []}
          onChange={(event, sides) => {
            updateCreateEvent({
              sidesB: sides
            })
        }}/>
      </Unlockable>,
    ].filter((i) => {
      return !!i
    })

    return advancedOptions.length > 0 && <Unlockable interfaceId={EFFECT_ADVANCED_CONTAINER_IID}>
      <Typography variant="h5">Advanced</Typography>
      {advancedOptions}
    </Unlockable>
  }

  

  function renderTagSelect() {
    if(!event.type) return
    const eventInterface = eventEditInterface[event.type]

    if(eventInterface.tagSelectType === NO_TAG_EVENT) {
      return null
    }

    if(eventInterface.tagSelectType === SINGLE_TAG_EVENT) {
      return <SelectTag
        disabled={event.tagId}
        formLabel="Tag"
        value={event.tagId ? [event.tagId] : []}
        onChange={(event, classes) => {
          const newClassId = classes[classes.length-1]
          updateCreateEvent({
            tagId: newClassId,
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
          value={event.type ? [event.type] : []}
          onChange={(event, events) => {
            const newEvent = events[events.length-1]
            updateCreateEvent({
              type: newEvent
            })
        }}/>
        {renderTagSelect()}
        {renderEventForms()}
        {renderAdvancedOptions()}
        <div className="CreateEvent__buttons">
          <Button 
            disabled={isAutosaveDisabled()}
            onClick={() => {
            editGameModel({
              events: {
                [event.eventId] : {
                  ...event,
                  isNew: false,
                }
              }
            })
            handleClose()
          }}>
            Save
          </Button>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          {!event.isNew && <Button onClick={() => {
            editGameModel({
              events: {
                [event.eventId]: null
              }
            })
            handleClose()
          }}>Delete</Button>}
      </div>
    </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { updateCreateEvent, closeCreateEvent, editGameModel }),
)(CreateEvent);
