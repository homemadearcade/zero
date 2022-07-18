import React from 'react';
import { connect } from 'react-redux';

import './SaveGameButton.scss';
import { editGame } from '../../../store/actions/gameActions';

const SaveGameButton = ({editGame, game: { gameModel }}) => {
  function saveGame() {
    editGame(gameModel.id, gameModel)
  }

  return <button onClick={saveGame}
  
  >Save Game</button>
};

const mapStateToProps = (state) => ({
  game: state.game
});

export default connect(mapStateToProps, { editGame })(SaveGameButton);