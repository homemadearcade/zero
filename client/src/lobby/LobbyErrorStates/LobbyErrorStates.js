/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { GAME_SESSION_CONNECTION_LOST } from '../constants';
import { clearErrorState } from '../../store/actions/errorsActions';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';

const LobbyErrorStates = ({
  errors: { errorStates },
  clearErrorState,
  webPage: { recentlyFocused }
}) => {
  return null
};

const mapStateToProps = (state) => ({
  errors: state.errors,
  webPage: state.webPage
});

export default compose(
  connect(mapStateToProps, { clearErrorState }),
)(LobbyErrorStates);
