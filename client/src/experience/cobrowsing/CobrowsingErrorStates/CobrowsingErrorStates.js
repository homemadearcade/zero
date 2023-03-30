/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { clearErrorState, changeErrorState } from '../../../store/actions/errorsActions';
import store from '../../../store';
import { noCobrowsingUpdateDelta } from '../../../constants';
import { COBROWSING_CONNECTION_LOST } from '../../../constants';

const CobrowsingErrorStates = ({
  errors: { errorStates },
  clearErrorState,
  changeErrorState,
  webPage: { recentlyFocused },
  cobrowsing: { cobrowsingUser }
}) => {

  const [lastPing, setLastPing] = useState()

  useEffect(() => {
    const mouseInterval = setInterval(() => {
      const mouseData = store.getState().status.cobrowsingMouses[cobrowsingUser.id];
      if(mouseData) {
        setLastPing(mouseData.lastPing)
        
        if(mouseData.lastPing + noCobrowsingUpdateDelta < Date.now()) {
          changeErrorState(COBROWSING_CONNECTION_LOST, { userMongoId: cobrowsingUser.id })
          setLastPing(null)
        } else if(errorStates[COBROWSING_CONNECTION_LOST].on) {
          clearErrorState(COBROWSING_CONNECTION_LOST)
          setLastPing(null)
        }
      } else if(lastPing) {
        if(lastPing + noCobrowsingUpdateDelta < Date.now()) {
          changeErrorState(COBROWSING_CONNECTION_LOST, { userMongoId: cobrowsingUser.id })
        }
      }

    }, 1000)

    return () => {
      clearInterval(mouseInterval)
    }
  }, [cobrowsingUser])


  function renderErrors() {
    if(errorStates[COBROWSING_CONNECTION_LOST].on && !recentlyFocused) {
      return <Dialog open onClose={() => {
        clearErrorState(COBROWSING_CONNECTION_LOST)
      }}>
        <DialogTitle>Cobrowsing Connection Lost</DialogTitle>
        <DialogContent>
          {errorStates[COBROWSING_CONNECTION_LOST].message ? errorStates[COBROWSING_CONNECTION_LOST].message : 'Attempting to reconnect...'}
          <br/><br/>The user you are cobrowsing cannot see this error
        </DialogContent>
      </Dialog>
   }
  }

  return renderErrors()
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  webPage: state.webPage,
  cobrowsing: state.cobrowsing,
});

export default compose(
  connect(mapStateToProps, { clearErrorState, changeErrorState }),
)(CobrowsingErrorStates);
