import React, { useState } from 'react';
import { connect } from 'react-redux';

import { copyArcadeGameToUser } from '../../../store/actions/game/arcadeGameActions';

import './GameCopyForm.scss';
import Button from '../../../ui/Button/Button';
import Typography from '../../../ui/Typography/Typography';
import SelectArcadeGame from '../../../ui/connected/SelectArcadeGame/SelectArcadeGame';
import SelectUsers from '../../../ui/connected/SelectUsers/SelectUsers';

const GameCopyForm = ({ copyArcadeGameToUser, onSubmit }) => {
  const [arcadeGameMongoId, setGameId] = useState()
  const [userMongoId, setUserMongoId] = useState()

  return (
    <div className="GameCopyForm">
      <Typography variant="h5" component="h5">Copy Game To User</Typography> 
      <SelectArcadeGame gamesSelected={arcadeGameMongoId? [arcadeGameMongoId] : []} onSelect={(games) => {
        if(games[0]) {
          setGameId(games[games.length -1].id)
        }
      }}></SelectArcadeGame>
      <SelectUsers
        onSelect={(userMongoIds) => {
          setUserMongoId(userMongoIds[userMongoIds.length -1])
        }}
        usersSelected={userMongoId ? [userMongoId] : []}
      ></SelectUsers>
      <Button disabled={!userMongoId|| !arcadeGameMongoId} onClick={() => {
        copyArcadeGameToUser({userMongoId: userMongoId, arcadeGameMongoId: arcadeGameMongoId})
        setGameId(null)
        setUserMongoId(null)
        onSubmit()
      }} type="submit" className="btn">Copy Game</Button>
    </div>
  );
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { copyArcadeGameToUser })(GameCopyForm);
