import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Onboarding.scss';
import { updateLobbyUser, updateOnboardingStep } from '../../../store/actions/lobbyActions';

import Loader from '../../ui/Loader/Loader';
import { testInternetSpeed } from '../../../utils/network';
import { requestFullscreen } from '../../../utils/browser';
import Button from '../../ui/Button/Button';
import { withCobrowsingState } from '../../../utils/cobrowsing';

const Onboarding = ({ requestFullscreen, updateOnboardingStep, updateLobbyUser, lobby: { lobby }, lobbyState, cobrowsing: { cobrowsingUser }}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

  async function onTestInternetSpeedClick() {
    updateOnboardingStep('testing_speed')

    const [downloadSpeed, uploadSpeed] = await testInternetSpeed()
    
    updateLobbyUser({
      lobbyId: lobby.id,
      userId: cobrowsingUser.id, 
      user: {
        internetSpeedTestResults: {
          downloadSpeed,
          uploadSpeed
        }
      }
    })

    updateOnboardingStep('internet_speed_test')
  }

  function renderSpeedTest() {
    const user = usersById[cobrowsingUser.id]
    if(user.internetSpeedTestResults) {
      return <div>
        <div>Upload Speed: {user.internetSpeedTestResults.uploadSpeed}</div>
        <div>Download Speed: {user.internetSpeedTestResults.downloadSpeed}</div>
        <Button onClick={onTestInternetSpeedClick}>Test your internet again</Button>
        <Button onClick={async () => {
          updateOnboardingStep('computer_environment')
        }}>Next Step</Button>
      </div>
    }

   return  <Button onClick={onTestInternetSpeedClick}>Test your internet</Button>
  }

  if(lobbyState.onboardingStep === 'testing_speed') {
    return <Loader text="Testing your internet upload and download speed.."/>
  }

  if(lobbyState.onboardingStep === 'internet_speed_test') {
    return <div>
      Step 2
      {renderSpeedTest()}
    </div>
  }

  if(lobbyState.onboardingStep === 'computer_environment') {
    return <div>
      Step 3
      <div>
        Please close out all other tabs on this browser and close other intensive programs like editing software, spotify, other browsers, games, etc.
      </div>
      <Button onClick={() => {
        requestFullscreen(document.body)
        updateOnboardingStep('choose_game')
      }}>Enter fullscreen mode</Button>
      {cobrowsingUser.role === 'ADMIN' && <Button onClick={() => {
        updateOnboardingStep('choose_game')
      }}>Skip</Button>}
    </div>
  }

  if(lobbyState.onboardingStep === 'choose_game' && !lobby.isGameStarted) {
    if(cobrowsingUser.role === 'ADMIN') {
      return <div>
        Return to the lobby page - assign all roles, select game, review checklist, start game
      </div>
    } else {
      return <Loader text="Waiting for game to start.."/>
    }
  }
};

const mapStateToProps = (state) => withCobrowsingState(state, {
  lobby: state.lobby,
  cobrowsing: state.cobrowsing,
  lobbyState: state.lobby.lobbyState,
});

export default compose(
  connect(mapStateToProps, { updateLobbyUser, requestFullscreen, updateOnboardingStep }),
)(Onboarding);

