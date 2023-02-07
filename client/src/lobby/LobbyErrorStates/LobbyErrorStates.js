/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { COBROWSING_CONNECTION_LOST, GAME_CONNECTION_LOST } from '../constants';
import { clearErrorState } from '../../store/actions/errorsActions';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

const LobbyErrorStates = ({
  errors: { errorStates },
  clearErrorState
}) => {
  function renderErrors() {
    if(errorStates[GAME_CONNECTION_LOST].on) return <Dialog open onClose={() => {
      clearErrorState(GAME_CONNECTION_LOST)
    }}>
      <DialogTitle>Game Connection Lost</DialogTitle>
      <DialogContent>{errorStates[GAME_CONNECTION_LOST].message}</DialogContent>
    </Dialog>

   if(errorStates[COBROWSING_CONNECTION_LOST].on) {
      return <Dialog open>
        <DialogTitle>Cobrowsing Connection Lost</DialogTitle>
        <DialogContent>{errorStates[COBROWSING_CONNECTION_LOST].message ? errorStates[COBROWSING_CONNECTION_LOST].message : 'Attempting to reconnect...'}</DialogContent>
      </Dialog>
   }
  }

  return renderErrors()
};

const mapStateToProps = (state) => ({
  errors: state.errors,
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(LobbyErrorStates);
