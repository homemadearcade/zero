/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ChatRoom.scss';
import Typography from '../../ui/Typography/Typography';
import { List, ListItem, TextField } from '@mui/material';
import Button from '../../ui/Button/Button';
import { clearLobbyMessages, sendLobbyMessage } from '../../store/actions/lobbyActions';
import LobbyUsername from '../LobbyMember/LobbyMember';
import { ADMIN_ROLE } from '../../constants';

const ChatRoom = ({
  lobby: { lobby },
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
  }, [lobby.messages])

  // const usersById = lobby.users.reduce((prev, next) => {
  //   prev[next.id] = next
  //   return prev
  // }, {})
  function getChatRoomName(messageData) {
    const {user, automated} = messageData

    if(me?.role === ADMIN_ROLE) {
      return <LobbyUsername myTracks={myTracks} userTracks={userTracks} userId={messageData.user.id}></LobbyUsername>
    }

    if(automated) return user.username

    if(lobby.guideId === user.id) {
      return 'Your Guide'
    }

    return user.username
  }

  return (
    <div className="ChatRoom">
      {name && <Typography variant="h5">{name}</Typography>}
      <List className="ChatRoom__messages">
        {lobby.messages.map((messageData) => {
          const {user, message, automated} = messageData
          if(automated && hideAutomated) return null

          return <ListItem classes={{root: 'ChatRoom__message'}}>
            {getChatRoomName(messageData)}
            {message}
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
          clearLobbyMessages(lobby.id)
        }}>Clear Log</Button>}
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { sendLobbyMessage, clearLobbyMessages }),
)(ChatRoom);
