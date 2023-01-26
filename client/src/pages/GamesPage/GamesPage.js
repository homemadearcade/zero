import React, { useEffect, useState} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamesPage.scss';

import Layout from '../../layout/Layout';
import { editArcadeGame, getArcadeGames } from '../../store/actions/arcadeGameActions';
import Loader from '../../ui/Loader/Loader';
import Link from '../../ui/Link/Link';
import GameForm from '../../app/homemadeArcade/arcadeGame/GameForm/GameForm';
import Typography from '../../ui/Typography/Typography';
import { ADMIN_ROLE } from '../../game/constants';
import Button from '../../ui/Button/Button';
import { TextField } from '@mui/material';
import PageHeader from '../../ui/PageHeader/PageHeader';

{/* <div>
<span className="GamesPage__label">Created at: </span>
<span className="GamesPage__info">
  {moment(game.createdAt).format('dddd, MMMM Do YYYY, H:mm:ss')}
</span>
</div> */}

const GamesPage = ({ getArcadeGames, editArcadeGame, arcadeGames: { arcadeGames, isLoading }, auth: { me }}) => {
  useEffect(() => {
    getArcadeGames();
  }, [getArcadeGames]);

  const [searchTerm, setSearchTerm] = useState("")
  const [gamesList, setGamesList] = useState(arcadeGames)

  useEffect(() => {
    if(searchTerm) {
      setGamesList(arcadeGames.filter((game) => {
        if(game.metadata.title?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(game.user?.username.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(game.metadata.description?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        if(game.metadata.authorPseudonym?.toLowerCase().indexOf(searchTerm.toLowerCase()) >= 0) return true
        return false
      }))
    } else {
      setGamesList(arcadeGames)
    }
  }, [searchTerm, arcadeGames])

  function getPublishData(game) {
    let visible = false 
    let publishable = false

    if(me?.role === ADMIN_ROLE || me?.id === game.user?.id) {
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
        await editArcadeGame(game.id, {
          metadata: {
            isPublished: false
          }
        })
        getArcadeGames()
      }}>
        Unpublish
      </Button>
    } else {
      return <Button size="small" onClick={async () => {
        await editArcadeGame(game.id, {
          metadata: {
            isPublished: true
          }
        })
        getArcadeGames()
      }}>
        Publish
      </Button>
    }
  }

  function handleSearchChange(e) {
    setSearchTerm(e.target.value)
  }

  return (
    <Layout>
      <div className="GamesPage">
        <PageHeader 
          title="Games page"
          description="This is the Games page. Here are listed all of the games. Click the play link to play the game."
        ></PageHeader>
        <div className="GamesPage__list">
          <TextField onChange={handleSearchChange} value={searchTerm} label={"Search"} />
          {isLoading ? (
            <Loader />
          ) : (
            <>
              {gamesList.map((game) => {
                const { user } = game

                const { visible, publishable } = getPublishData(game)

                if(!visible) return null
                
                return (
                  <div key={game.id} className="GamesPage__game">
                    <span className="GamesPage__info">{game.metadata.title}</span>
                    <span className="GamesPage__info">{game.metadata.description}</span>
                    {game.metadata.imageUrl && <img alt={game.metadata.title + ' featured image'} src={game.metadata.imageUrl}/>}
                    <span className="GamesPage__info">By: {game.metadata.authorPseudonym || user?.username}</span>
                    {publishable && renderPublishButton(game)}
                    <Link to={`/play/${game.id}`} className="info bold profile-link">
                      Play
                    </Link>
                    {(game.user?.id === me?.id || me.role === ADMIN_ROLE) && <Link to={`/edit/${game.id}`} className="info bold profile-link">
                      Edit
                    </Link>}
                  </div>
                );
              })}
               {me?.id && <GameForm onSubmit={() => {
                getArcadeGames()
              }}/>}
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

const mapStateToProps = (state) => ({
  arcadeGames: state.arcadeGames,
  auth: state.auth,
});

export default compose(
  connect(mapStateToProps, { getArcadeGames, editArcadeGame }))(GamesPage);
