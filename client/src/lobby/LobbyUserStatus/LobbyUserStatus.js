import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './LobbyUserStatus.scss';
import Link from '../../ui/Link/Link';
import AccordianList from '../../ui/AccordianList/AccordianList';
import Dialog from '../../ui/Dialog/Dialog';
import UnlockableInterfaceTree from '../../ui/connected/UnlockableInterfaceTree/UnlockableInterfaceTree';
import AgoraVolumeMeter from '../agora/AgoraVolumeMeter/AgoraVolumeMeter';
import { Paper } from '@mui/material';
import Icon from '../../ui/Icon/Icon';
import { ADMIN_ROLE, ARCADE_EXPERIENCE_ID } from '../../game/constants';
import Button from '../../ui/Button/Button';
import { closeInterfaceTree, openInterfaceTree } from '../../store/actions/userActions';

const LobbyUserStatus = ({ closeInterfaceTree, openInterfaceTree, user: { userIdInterfaceTree }, myTracks, userTracks, titleOnly, hasJoinLink, hasUIButton, titleChildren, userId, key, lobby: { lobby }, status : { lobbyUserStatuses, cobrowsingMouses }, cobrowsing: { cobrowsingUser }, auth: {me},  }) => {
  const userStatus = lobbyUserStatuses[userId];
  const userCobrowsingStatus = cobrowsingMouses[userId]
  const user = lobby.users.filter(({id}) => {
    if(userId === id) {
      return true
    }
    return false;
  })[0]

  if(!user) {
    return null
  }

  let userTracksById = {}
  
  if(myTracks && userTracks) {
    userTracksById = [{ uid: me.id, videoTrack: myTracks[1], audioTrack: myTracks[0] }, ...userTracks].reduce((prev, next) => {
      prev[next.uid] = next
      return prev
    }, {})
  }
  
  const isMe = me?.id === userId

  function renderTitle() {
    return <div className="LobbyUserStatus__title">
      <div className="LobbyUserStatus__username">{user.username}{isMe && ' (me)'}</div>
      <div className={classnames("LobbyUserStatus__connection", {'LobbyUserStatus__connection--bad' : userStatus?.pingDelta && userStatus.pingDelta > 150, 'LobbyUserStatus__connection--none': !user.connected})}/>
      <div className="LobbyUserStatus__ping">{userStatus?.pingDelta > -1 ? userStatus?.pingDelta : 0}</div>
      {user.role === ADMIN_ROLE && <div className="LobbyUserStatus__admin"><Icon icon="faCrown"/></div>}
      {(hasJoinLink) && <Link to={`/lobby/${lobby.id}/join/${user.id}`}>
        {isMe ? 'Play' : 'Join'}
      </Link>}
      {(hasUIButton) && <Button onClick={() => {
        openInterfaceTree(user.id)
      }}>
        View Tree
      </Button>}
      {titleChildren}
    </div>
  }

  if(titleOnly) return <Paper variant="outlined"><div className="LobbyUserStatus LobbyUserStatus--title-only">{renderTitle()}</div></Paper>

  return <><div key={key} className={classnames("LobbyUserStatus", {'LobbyUserStatus--left' : !user.joined, 'LobbyUserStatus--cobrowser': cobrowsingUser.id === userId})}>
    {userTracksById && userTracksById[user.id] && <AgoraVolumeMeter audioTrack={userTracksById[user.id].audioTrack}/>}
    <AccordianList accordians={[{
      id: user.id,
      title: renderTitle(),
      body: <div className="LobbyUserStatus__icons">
        <div className="LobbyUserStatus__fullscreen"><div className="LobbyUserStatus__icon"><Icon icon="faWindowMaximize"/></div>{(userStatus?.isFullscreen) ? 'Fullscreen' : 'Windowed'}</div>
        <div className="LobbyUserStatus__focus"><div className="LobbyUserStatus__icon"><Icon icon="faEye"/></div>{(!userStatus || userStatus?.isFocused) ? 'On Tab' : 'Away'}</div>
        <div className="LobbyUserStatus__cobrowsing"><div className="LobbyUserStatus__icon"><Icon icon="faArrowPointer"/></div>{userCobrowsingStatus ? <span>{((Date.now() - userCobrowsingStatus.lastPing)/1000).toFixed(0)}s ago</span> : 'Never'}</div>
        <div className="LobbyUserStatus__upload"><div className="LobbyUserStatus__icon"><Icon icon="faUpload"/></div>{(user.internetSpeedTestResults?.uploadSpeed) ? user.internetSpeedTestResults?.uploadSpeed : 'Not Tested'}</div>
        <div className="LobbyUserStatus__download"><div className="LobbyUserStatus__icon"><Icon icon="faDownload"/></div>{(user.internetSpeedTestResults?.downloadSpeed) ? user.internetSpeedTestResults?.downloadSpeed : 'Not Tested'}</div>
        <div className="LobbyUserStatus__video-call"><div className="LobbyUserStatus__icon"><Icon icon="faVideo"/></div>{userTracksById && userTracksById[user.id] ? 'Connected' : 'Not Connected'}</div></div>
    }]}/>
  </div>
  {userIdInterfaceTree === user.id && <Dialog open onClose={() => {
    closeInterfaceTree()
  }}>
    <UnlockableInterfaceTree experienceId={ARCADE_EXPERIENCE_ID} userId={userId}></UnlockableInterfaceTree>
  </Dialog>}
  </>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  status: state.status,
  auth: state.auth,
  user: state.user,
  cobrowsing: state.cobrowsing,
});

export default connect(mapStateToProps, { openInterfaceTree, closeInterfaceTree })(LobbyUserStatus);
