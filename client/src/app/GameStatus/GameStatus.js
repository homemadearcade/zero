import React, { } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import './GameStatus.scss';
import AccordianList from '../ui/AccordianList/AccordianList';
import Typography from '../ui/Typography/Typography';

const GameStatus = ({ lobby: { lobby: { game, isGamePoweredOn, isGamePaused } } }) => {

  if(!game) return <Typography component="div" variant="subtitle2">No Game Selected</Typography>

  return <div className={classnames("GameStatus")}>
    <AccordianList accordians={[{
      id: game.id,
      title: <span className="GameStatus__title">
        {game.metadata.name || game.user.username + "'s game"}
      </span>,
      body: <span className="GameStatus__icons">
        <span className="GameStatus__fullscreen"><span className="GameStatus__icon"><i className="fa-solid fa-pause"/></span>{(isGamePaused) ? 'Paused' : 'Not Paused'}</span>
        <span className="GameStatus__fullscreen"><span className="GameStatus__icon"><i className="fa-solid fa-power-off"/></span>{(isGamePoweredOn) ? 'Started' : 'Not Started'}</span>
      </span>
    }]}/>
  </div>
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default connect(mapStateToProps, { })(GameStatus);
