/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { GAME_SESSION_CONNECTION_LOST } from '../constants';
import { clearErrorState } from '../../store/actions/errorsActions';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

const GameSessionErrorStates = ({
  errors: { errorStates },
  clearErrorState,
  webPage: { recentlyFocused }
}) => {
  function renderErrors() {
    if(errorStates[GAME_SESSION_CONNECTION_LOST].on && !recentlyFocused) return <Dialog open>
      <DialogTitle>Game Connection Lost</DialogTitle>
      <DialogContent>{errorStates[GAME_SESSION_CONNECTION_LOST].message}</DialogContent>
    </Dialog>
  }

  return renderErrors()
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  webPage: state.webPage
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(GameSessionErrorStates);
