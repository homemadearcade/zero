/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Chatroom.scss';
import Typography from '../../ui/Typography/Typography';
import { List, ListItem, TextField } from '@mui/material';
import Button from '../../ui/Button/Button';
import { clearLobbyMessages, sendLobbyMessage } from '../../store/actions/experience/lobbyInstanceActions';
import LobbyUsername from '../lobbyInstance/LobbyMember/LobbyMember';
import { ADMIN_ROLE } from '../../constants';

const Chatroom = ({
  lobbyInstance: { lobbyInstance },
  auth: { me },
  sendLobbyMessage,
  clearLobbyMessages,
  hideAutomated,
  name,
  myTracks, userTracks,
}) => {
  const [text, setText] = useState('')

  const messagesEnd = useRef()

  function scrollToBottom() {
    //{ behavior: "smooth" }
    messagesEnd.current.scrollIntoView();
  }

  useEffect(() => {
    scrollToBottom()
  }, [lobbyInstance.messages])

  // const membersById = lobbyInstance.members.reduce((prev, next) => {
  //   prev[next.id] = next
  //   return prev
  // }, {})
  function getChatroomName(messageData) {
    const {user, automated} = messageData

    if(me?.role === ADMIN_ROLE) {
      return <LobbyUsername myTracks={myTracks} userTracks={userTracks} userMongoId={messageData.user.userMongoId}></LobbyUsername>
    }

    if(automated) return user.username

    if(lobbyInstance.guideId === user.userMongoId) {
      return <>Your Guide<br/></>
    }

    return <>
    {user.username}<br/>
    </>
  }

  return (
    <div className="Chatroom">
      {name && <Typography variant="h5">{name}</Typography>}
      <List className="Chatroom__messages">
        {lobbyInstance.messages.map((messageData) => {
          const {user, message, automated} = messageData
          if(automated && hideAutomated) return null

          return <ListItem classes={{root: 'Chatroom__message'}}>
            <Typography variant="body">{getChatroomName(messageData)}</Typography>
            <Typography variant="subtitle1">{message}</Typography>
          </ListItem>
        })}
        <div style={{ float:"left", clear: "both" }}
          ref={messagesEnd}>
        </div>
      </List>
      <div>
        <TextField value={text} onChange={(e) => {
          setText(e.target.value)
        }}></TextField>
        <Button disabled={!text} onClick={() => {
          sendLobbyMessage({message: text})
          setText('')
        }}>Send</Button>
        {me.role === ADMIN_ROLE && <Button onClick={() => {
          clearLobbyMessages(lobbyInstance.id)
        }}>Clear Log</Button>}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { sendLobbyMessage, clearLobbyMessages }),
)(Chatroom);
