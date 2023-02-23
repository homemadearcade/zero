/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Chatroom.scss';
import Typography from '../../ui/Typography/Typography';
import { List, ListItem, TextField } from '@mui/material';
import Button from '../../ui/Button/Button';
import { clearLobbyMessages, sendLobbyMessage } from '../../store/actions/lobbyActions';
import LobbyUsername from '../lobby/LobbyMember/LobbyMember';
import { ADMIN_ROLE } from '../../constants';

const Chatroom = ({
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

  // const membersById = lobby.members.reduce((prev, next) => {
  //   prev[next.id] = next
  //   return prev
  // }, {})
  function getChatroomName(messageData) {
    const {user, automated} = messageData

    if(me?.role === ADMIN_ROLE) {
      return <LobbyUsername myTracks={myTracks} userTracks={userTracks} userId={messageData.user.id}></LobbyUsername>
    }

    if(automated) return user.username

    if(lobby.guideId === user.id) {
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
        {lobby.messages.map((messageData) => {
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
)(Chatroom);
