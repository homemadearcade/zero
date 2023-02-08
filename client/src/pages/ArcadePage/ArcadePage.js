import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ArcadePage.scss';

import Layout from '../../layout/Layout';
import { getArcadeGames } from '../../store/actions/arcadeGameActions';
import Loader from '../../ui/Loader/Loader';
import GameForm from '../../app/homemadeArcade/arcadeGame/GameAddForm/GameAddForm';
import { ADMIN_ROLE } from '../../game/constants';
import PageHeader from '../../ui/PageHeader/PageHeader';
import requireAdmin from '../../hoc/requireAdmin';
import requireAuth from '../../hoc/requireAuth';
import GameCopyForm from '../../app/homemadeArcade/arcadeGame/GameCopyForm/GameCopyForm';
import GameCard from '../../app/homemadeArcade/arcadeGame/GameCard/GameCard';
import GameList from '../../app/homemadeArcade/arcadeGame/GameList/GameList';

const ArcadePage = () => {
  function getGameData(game) {
    let visible = false 

    if(game.metadata.isPublished ) {
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
          <GameList>{(game) => {
            const { visible } = getGameData(game)
            if(!visible) return
            return <GameCard game={game} canPlay canEdit></GameCard>
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
