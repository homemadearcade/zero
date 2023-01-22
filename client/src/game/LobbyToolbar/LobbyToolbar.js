import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './LobbyToolbar.scss';
import { lobbyUndo } from '../../store/actions/lobbyActions';
import { toggleGridView } from '../../store/actions/gameViewEditorActions'
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import { changeGameState } from '../../store/actions/gameContextActions';
import { onInstanceUndo } from '../../store/actions/lobbyActions';
import Icon from '../../ui/Icon/Icon';
import AgoraVolumeMeter from '../../lobby/agora/AgoraVolumeMeter/AgoraVolumeMeter';

const LobbyToolbar = ({ tracks }) => {
  const videoTrack = tracks[1]
  const audioTrack = tracks[0]

  const [trackState, setTrackState] = useState({ video: true, audio: true });
  const muteVideo = async () => {
    try {
      await videoTrack.setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    } catch(e) {
      console.error(e)
    }
  };
  const muteAudio = async () => {
    try{
      await audioTrack.setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } catch(e) {
      console.error(e)
    }
  };

  function Controls() {    
     return <>
      {trackState.audio ? <div className="LobbyToolbar__control" onClick={muteAudio}>
          <Icon size="lg" icon="faMicrophone"/>
        </div> : 
        <div className="LobbyToolbar__control" onClick={muteAudio}>
           <Icon  size="lg" icon="faMicrophoneSlash"/>
        </div>
      }
      {trackState.video ? <div className="LobbyToolbar__control" onClick={muteVideo}>
          <Icon size="lg" icon="faVideo"/>
        </div> : 
        <div className="LobbyToolbar__control" onClick={muteVideo}>
          <Icon size="lg" icon="faVideoSlash"/>
        </div>
      }
    </>
  }

 return <>
  <div className="LobbyToolbar">
    <Controls></Controls>
  </div>
  <AgoraVolumeMeter audioTrack={audioTrack}/>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
  gameContext: state.gameContext
}, { forceViewCobrowsing: true });

export default compose(
  connect(mapStateToProps, { lobbyUndo, toggleGridView, changeGameState, onInstanceUndo }))(LobbyToolbar);
