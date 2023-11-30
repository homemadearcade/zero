import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { joinLobbyByMongoId, leaveLobbyByMongoId, getLobbyByMongoId, enterLobbyInstanceLine, leaveLobbyInstanceLine, addLobbyMemberStorage } from '../store/actions/experience/lobbyInstanceActions';
import Loader from '../ui/Loader/Loader';
import { withRouter } from 'react-router-dom';
import { leaveAgoraVideoCall } from '../store/actions/experience/videoActions';
import LinearIndeterminateLoader from '../ui/LinearIndeterminateLoader/LinearIndeterminateLoader';
import LocalGameRoomContext from './LocalGameRoomContext';
import GameView from '../game/view/GameView/GameView';
import { PLAYTHROUGH_START_STATE } from '../game/constants';
import { getExperienceModelByMongoId } from '../store/actions/experience/experienceModelActions';
import IconButton from '../ui/IconButton/IconButton';

// eslint-disable-next-line import/no-anonymous-default-export
export default (ChildComponent) => {
  class LobbyInstanceContext extends Component {
    state = {
      arcadeGamePlayingMongoId: null
    }

    componentWillMount() {
      const { match } = this.props
      const matchId = match.params.lobbyInstanceMongoId;

      this.startLobbyJoiningProcess(matchId)
    }

    async startLobbyJoiningProcess(lobbyInstanceMongoId) {
      const { getLobbyByMongoId, getExperienceModelByMongoId } = this.props

      try {
        const lobbyInstance = await getLobbyByMongoId(lobbyInstanceMongoId);   
        await getExperienceModelByMongoId(lobbyInstance.experienceModelMongoId)     

        setTimeout(() => {
          this.joinLobbyOrEnterLine()
        })
      } catch(error) {
        console.log(error)
      }
    }

    async joinLobbyOrEnterLine() {
      const { joinLobbyByMongoId, experienceModel: { experienceModel }, enterLobbyInstanceLine, lobbyInstance: { lobbyInstance} } = this.props

      const arcadeGamePlayingMongoId = experienceModel.lobbys[lobbyInstance.lobbyId].introArcadeGameMongoId
      if(arcadeGamePlayingMongoId) {
        this.setState({
          arcadeGamePlayingMongoId
        })
      }

      if(lobbyInstance.usersMustWaitInLine) {
        await enterLobbyInstanceLine(lobbyInstance.id)
      } else {
        await joinLobbyByMongoId({ lobbyInstanceMongoId: lobbyInstance.id })
      }
    }

    componentWillUnmount() {
      this.lobbyInstanceContextCleaup()
    }

    lobbyInstanceContextCleaup() {
      const { auth: { me }, leaveLobbyByMongoId, leaveLobbyInstanceLine, lobbyInstance: { lobbyInstance, isWaitingInLine }, leaveAgoraVideoCall } = this.props

      leaveAgoraVideoCall()
      leaveLobbyByMongoId({lobbyInstanceMongoId: lobbyInstance.id, userMongoId: me?.id})
      if(isWaitingInLine) {
        leaveLobbyInstanceLine(lobbyInstance.id, me?.id)
      }
    }

    render() {
      const { lobbyInstance: { isLoading, isJoining, isJoined, lobbyInstance, isWaitingInLine }, auth: { me }, addLobbyMemberStorage } = this.props;

      if(this.state.arcadeGamePlayingMongoId) {
        return<LocalGameRoomContext room={{gameStatus: PLAYTHROUGH_START_STATE, arcadeGameMongoId: this.state.arcadeGamePlayingMongoId }}>
          <div style={{position: 'fixed', right: 0, top: 0, zIndex: 10}}>
            <IconButton icon="faClose" size="sm" color="black" onClick={() => {
              this.setState({
                arcadeGamePlayingMongoId: null
              })
            }}/>
          </div>
          <GameView 
            onFinishGame={async ({ choices, entityModels, textures }) => {
              addLobbyMemberStorage({
                lobbyInstanceMongoId: lobbyInstance.id,
                userMongoId: me?.id, 
                memberStorage: {
                  [me.id]: {
                    choices, entityModels, textures 
                  }
                }
              })

              this.setState({
                arcadeGamePlayingMongoId: null
              })
            }}
          />
        </LocalGameRoomContext>
      }
      
      if(isWaitingInLine) {
        return <Loader text="You are in line..."/>
      }

      if(isLoading) {
        return <LinearIndeterminateLoader/>
        // return <Loader text="Loading Lobby..."/>
      }
    
      if(isJoining || !lobbyInstance.id) {
        return <LinearIndeterminateLoader/>
        // return <Loader text="Joining Lobby..."/>
      }

      if(isJoined) {
        return <ChildComponent {...this.props} />
      }
    }
  }

  const mapStateToProps = (state) => ({
    auth: state.auth,
    lobbyInstance: state.lobbyInstance,
    // cobrowsing: state.cobrowsing
    experienceModel: state.experienceModel
  });

  return compose(
    withRouter, 
    connect(mapStateToProps, { 
      getExperienceModelByMongoId,
      joinLobbyByMongoId,
      getLobbyByMongoId,
      leaveLobbyByMongoId,
      enterLobbyInstanceLine,
      leaveAgoraVideoCall,
      leaveLobbyInstanceLine,
      addLobbyMemberStorage
     })
  )(LobbyInstanceContext)
};
