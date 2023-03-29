/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import { clearErrorState } from '../../../store/actions/errorsActions';

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
