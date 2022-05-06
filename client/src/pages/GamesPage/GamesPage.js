import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import './GamesPage.scss';

import requireAdmin from '../../hoc/requireAdmin';
import requireAuth from '../../hoc/requireAuth';

import Layout from '../../layout/Layout';
import { getGames } from '../../store/actions/gameActions';
import Loader from '../../components/Loader/Loader';
import { Link } from 'react-router-dom';
import GameForm from '../../components/GameForm/GameForm';

const GamesPage = ({ getGames, game: { games, isLoading }}) => {
  useEffect(() => {
    getGames();
  }, []);

  return (
    <Layout>
      <div className="GamesPage">
        <h1>Games page</h1>
        <p>
          This is the Games page. Here are listed all of the games of the app. Click the game link to play the game.
        </p>
        <div className="list">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {games.map((game, index) => {
                const { user } = game
                
                return (
                  <div key={index} className="profile">
                    <div className="info-container">
                      <div>
                        <span className="label">Created by: </span>
                        <span className="info">{user.username}</span>
                      </div>
                      <div>
                        <span className="label">Created by (email): </span>
                        <span className="info">{user.email}</span>
                      </div>
                      <Link to={`/play/${game.id}`} className="info bold profile-link">
                        Play!
                      </Link>
                      <div>
                        <span className="label">Created: </span>
                        <span className="info">
                          {moment(game.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
               <GameForm onSubmit={() => {
                getGames()
              }}/>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default compose(
  requireAuth,
  requireAdmin,
  connect(mapStateToProps, { getGames }))(GamesPage);
