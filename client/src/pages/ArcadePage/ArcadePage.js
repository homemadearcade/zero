import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ArcadePage.scss';

import Layout from '../../layout/Layout';
import { getArcadeGames } from '../../store/actions/game/arcadeGameActions';
import GameCard from '../../app/gameModel/GameCard/GameCard';
import GameList from '../../app/gameModel/GameList/GameList';
import { PLAY_GAME_SCOPE_ARCADE, PLAY_GAME_SCOPE_FEATURED } from '../../game/constants';

const ArcadePage = () => {
  function getGameData(game) {
    let visible = false 

    if(!game.isRemoved && (game.playScope === PLAY_GAME_SCOPE_FEATURED || game.playScope === PLAY_GAME_SCOPE_ARCADE) ) {
      visible = true 
    }

    return {
      visible,
    }
  }

  return (
    <Layout>
      <div className="ArcadePage">
        <div className="ArcadePage__list">
          <GameList customFilter={(game) => {
            const { visible } = getGameData(game)
            if(!visible) return false 
            return true
          }}>{(game) => {
            return <GameCard id={game.id} game={game} canPlay canEdit></GameCard>
          }}</GameList>
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { getArcadeGames }))(ArcadePage);
