import React, { useState } from 'react';
import { connect } from 'react-redux';

import { copyArcadeGameToUser } from '../../../store/actions/arcadeGameActions';

import './GameCopyForm.scss';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import SelectArcadeGame from '../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';

const GameCopyForm = ({ copyArcadeGameToUser, onSubmit }) => {
  const [gameId, setGameId] = useState()
  const [userId, setUserId] = useState()

  return (
    <div className="GameCopyForm">
      <Typography variant="h5" component="h5">Copy Game To User</Typography> 
      <SelectArcadeGame gamesSelected={gameId? [gameId] : []} onSelect={(games) => {
        setGameId(games[games.length -1])
      }}></SelectArcadeGame>
      <SelectUsers
        onSelect={(users) => {
          setUserId(users[users.length -1])
        }}
        usersSelected={userId ? [userId] : []}
      ></SelectUsers>
      <Button disabled={!userId|| !gameId} onClick={() => {
        copyArcadeGameToUser({userId: userId, gameId: gameId})
        setGameId(null)
        setUserId(null)
        onSubmit()
      }} type="submit" className="btn">Copy Game</Button>
    </div>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { copyArcadeGameToUser })(GameCopyForm);
