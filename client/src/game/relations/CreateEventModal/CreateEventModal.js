/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEventModal.scss';
import { closeCreateEvent, updateCreateEvent } from '../../../store/actions/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { EVENT_ID_PREFIX } from '../../constants';
import useIsEventSaveable from '../../../hooks/useIsEventSaveable';
import CobrowsingModal from '../../cobrowsing/CobrowsingModal/CobrowsingModal';
import CreateEvent from '../CreateEvent/CreateEvent';

const CreateEventModal = ({ closeCreateEvent, editGameModel, updateCreateEvent, gameFormEditor: { event }}) => {
  function handleClose() {
    closeCreateEvent()
  }

  useEffect(() => {
    if(!event.eventId) {
      updateCreateEvent({ eventId: EVENT_ID_PREFIX+generateUniqueId(), isNew: true })
    }
  }, [])

  const isEventSaveable = useIsEventSaveable(event)
  
  return <CobrowsingModal open={true} onClose={handleClose}>
        <CreateEvent/>
        <div className="CreateEvent__buttons">
          <Button 
            disabled={!isEventSaveable}
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
    </CobrowsingModal>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateEvent, closeCreateEvent, editGameModel }),
)(CreateEventModal);
