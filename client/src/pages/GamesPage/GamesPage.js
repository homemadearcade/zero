import React, { useEffect} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import './GamesPage.scss';

import Layout from '../../layout/Layout';
import { editGame, getGames } from '../../store/actions/gameActions';
import Loader from '../../app/ui/Loader/Loader';
import Link from '../../app/ui/Link/Link';
import GameForm from '../../app/game/GameForm/GameForm';
import Typography from '../../app/ui/Typography/Typography';
import { ADMIN_ROLE } from '../../constants';
import Button from '../../app/ui/Button/Button';

{/* <div>
<span className="GamesPage__label">Created at: </span>
<span className="GamesPage__info">
  {moment(game.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
</span>
</div> */}

const GamesPage = ({ getGames, editGame, game: { games, isLoading }, auth: { me }}) => {
  useEffect(() => {
    getGames();
  }, []);

  function getPublishData(game) {
    let visible = false 
    let publishable = false

    if(me?.role === ADMIN_ROLE || me?.id === game.user.id) {
      visible = true 
      publishable = true
    } else if(game.metadata.isPublished) {
      visible = true 
    }

    return {
      visible,
      publishable
    }
  }
  
  function renderPublishButton(game) {
    if(game.metadata.isPublished) {
      return <Button size="small" onClick={async () => {
        await editGame(game.id, {
          metadata: {
            isPublished: false
          }
        })
        getGames()
      }}>
        Unpublish
      </Button>
    } else {
      return <Button size="small" onClick={async () => {
        await editGame(game.id, {
          metadata: {
            isPublished: true
          }
        })
        getGames()
      }}>
        Publish
      </Button>
    }
  }

  return (
    <Layout>
      <div className="GamesPage">
        <Typography component="h1" variant="h1">Games page</Typography>
          This is the Games page. Here are listed all of the games. Click the play link to play the game.
        <div className="GamesPage__list">
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {games.map((game) => {
                const { user } = game

                const { visible, publishable } = getPublishData(game)

                if(!visible) return null
                
                return (
                  <div key={game.id} className="GamesPage__game">
                    <span className="GamesPage__info">{game.metadata.title}</span>
                    <span className="GamesPage__info">{game.metadata.description}</span>
                    {game.metadata.imageUrl && <img alt={game.metadata.title + ' featured image'} src={game.metadata.imageUrl}/>}
                    <span className="GamesPage__info">By: {game.metadata.authorPseudonym || user.username}</span>
                    {publishable && renderPublishButton(game)}
                    <Link to={`/play/${game.id}`} className="info bold profile-link">
                      Play
                    </Link>
                    {game.user.id === me?.id && <Link to={`/edit/${game.id}`} className="info bold profile-link">
                      Edit
                    </Link>}
                  </div>
                );
              })}
               {me?.id && <GameForm onSubmit={() => {
                getGames()
              }}/>}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { getGames, editGame }))(GamesPage);
