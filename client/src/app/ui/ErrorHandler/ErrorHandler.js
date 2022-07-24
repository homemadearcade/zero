import React from 'react';
import { connect } from 'react-redux';

import './ErrorHandler.scss';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

const ErrorHandler = ({ 
  authError, 
  cobrowsingError, 
  cobrowsingLobbyError,
  cobrowsingVideoError,
  cobrowsingEditorError,
  cobrowsingEditorInstanceError,
  cobrowsingEditorFormsError,
  editorError,
  gameError, 
  lobbyError, 
  lobbyJoinError,
  lobbysError,
  statusError, 
  registerError, 
  videoError, 
  userError, 
  usersError
 }) => {  

  function renderError(errorType, error) {
    return <Alert severity="error">
      <AlertTitle>{errorType}</AlertTitle>
      {error.toString()}
    </Alert>
  }

  // console.log(
  //   authError, editorError, cobrowsingError, 
  //   cobrowsingLobbyError, cobrowsingEditorError, cobrowsingVideoError,
  //   gameError, lobbyError, lobbysError, statusError, registerError,
  //   videoError, userError, usersError
  // )

  return <div className="ErrorHandler">
    {editorError && renderError('Editor Error', editorError)}
    {cobrowsingError && renderError('Cobrowsing Error', cobrowsingError)}
    {cobrowsingVideoError && renderError('Cobrowsing Video Error', cobrowsingVideoError)}
    {cobrowsingEditorError && renderError('Cobrowsing Editor Error', cobrowsingEditorError)}
    {cobrowsingEditorFormsError && renderError('Cobrowsing Editor Error', cobrowsingEditorFormsError)}
    {cobrowsingEditorInstanceError && renderError('Cobrowsing Editor Error', cobrowsingEditorInstanceError)}
    {gameError && renderError('Game Error', gameError)}
    {lobbyError && renderError('Lobby Error', lobbyError)}
    {lobbyJoinError && renderError('Lobby Join Error', lobbyJoinError)}
    {lobbysError && renderError('Lobbys Error', lobbysError)}
    {statusError && renderError('Status Error', statusError)}
    {registerError && renderError('Register Error', registerError)}
    {videoError && renderError('Video Error', videoError)}
    {userError && renderError('User Error', userError)}
    {usersError && renderError('Users Error', usersError)}
  </div>
}

const mapStateToProps = (state) => ({
  authError: state.auth.error,
  cobrowsingError: state.cobrowsing.error,
  cobrowsingVideoError: state.cobrowsing.remoteState.video.error,
  cobrowsingEditorError: state.cobrowsing.remoteState.editor.error,
  cobrowsingEditorFormsError: state.cobrowsing.remoteState.editorForms.error,
  cobrowsingEditorInstanceError: state.cobrowsing.remoteState.editorInstance.error,
  editorError: state.editor.error,
  gameError: state.game.error,
  lobbyError: state.lobby.error,
  lobbyJoinError: state.lobby.joinError,
  lobbysError: state.lobbys.error,
  statusError: state.status.error,
  registerError: state.register.error,
  videoError: state.video.error,
  userError: state.user.error,
  usersError: state.users.error,
});

export default connect(mapStateToProps, {  })(ErrorHandler);
