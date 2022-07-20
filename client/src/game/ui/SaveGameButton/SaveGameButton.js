import React from 'react';
import { connect } from 'react-redux';

import './SaveGameButton.scss';
import { editGame } from '../../../store/actions/gameActions';
import Button from '../../../app/ui/Button/Button';

const SaveGameButton = ({editGame, game: { gameModel }}) => {
  function saveGame() {
    editGame(gameModel.id, gameModel)
  }

  return <Button> onClick={saveGame}
  
  >Save Game</Button>>
};

const mapStateToProps = (state) => ({
  game: state.game
});

export default connect(mapStateToProps, { editGame })(SaveGameButton);