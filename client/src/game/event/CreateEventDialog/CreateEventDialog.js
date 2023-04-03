/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateEventDialog.scss';
import { closeCreateEvent, updateCreateEvent } from '../../../store/actions/game/gameFormEditorActions';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { generateUniqueId } from '../../../utils/webPageUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import { EVENT_ID_PREFIX } from '../../constants';
import useIsEventSaveable from '../../../hooks/relations/useIsEventSaveable';
import CobrowsingDialog from '../../cobrowsing/CobrowsingDialog/CobrowsingDialog';
import CreateEvent from '../CreateEvent/CreateEvent';
import ReadOnlyWarning from '../../ui/ReadOnlyWarning/ReadOnlyWarning';

const CreateEventDialog = ({ closeCreateEvent, editGameModel, updateCreateEvent, gameFormEditor: { event }}) => {
  function handleClose() {
    closeCreateEvent()
  }

  useEffect(() => {
    if(!event.eventId) {
      updateCreateEvent({ eventId: EVENT_ID_PREFIX+generateUniqueId(), isNew: true })
    }
  }, [])

  const isEventSaveable = useIsEventSaveable(event)

  function renderButtons() {
    if(event.isReadOnly) return <ReadOnlyWarning text={'This Event is Read only'} />
    
     return <div className="CreateEvent__buttons">
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
  }
  
  return <CobrowsingDialog open={true} onClose={handleClose}>
        <CreateEvent/>
        {renderButtons()}
    </CobrowsingDialog>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { updateCreateEvent, closeCreateEvent, editGameModel }),
)(CreateEventDialog);
