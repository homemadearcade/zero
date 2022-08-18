import React from 'react';
import { connect } from 'react-redux';

import './ErrorHandler.scss';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import { clearError } from '../../../store/actions/errorsActions';
import Button from '../Button/Button'
import Icon from '../Icon/Icon';

const ErrorHandler = ({ 
  errors,
  clearError
 }) => {  

  function renderError(type, message, index) {
    return <Alert severity="error">
      <Button onClick={() => {
        clearError(index)
      }}><Icon icon="faClose"/></Button>
      <AlertTitle>{type}</AlertTitle>
      {message.toString()}
    </Alert>
  }

  // console.log(
  //   authError, editorError, cobrowsingError, 
  //   cobrowsingLobbyError, cobrowsingEditorError, cobrowsingVideoError,
  //   gameError, lobbyError, lobbysError, statusError, registerError,
  //   videoError, userError, usersError
  // )

  return <div className="ErrorHandler">
    {errors.map(({type, message}, index) => {
      if(!message) return null
      return renderError(type, message, index)
    })}
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  errors: state.errors
});

export default connect(mapStateToProps, { clearError })(ErrorHandler);
