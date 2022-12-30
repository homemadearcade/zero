import React from 'react';
import { connect } from 'react-redux';

import './SaveGameButton.scss';
import { editGame } from '../../../store/actions/arcadeGameActions';
import Button from '../../../ui/Button/Button';

const SaveGameButton = ({editGame, gameModel: { gameModel }}) => {
  function saveGame() {
    editGame(gameModel.id, gameModel)
  }

  return <Button> onClick={saveGame}>Save Game</Button>>
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default connect(mapStateToProps, { editGame })(SaveGameButton);