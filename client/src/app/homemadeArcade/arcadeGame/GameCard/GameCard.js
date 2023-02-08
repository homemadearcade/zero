import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '../../../../ui/Typography/Typography';

import './GameCard.scss';
import { CardActions } from '@mui/material';
import Link from '../../../../ui/Link/Link';
import { editArcadeGame, getArcadeGames } from '../../../../store/actions/arcadeGameActions';
import Button from '../../../../ui/Button/Button';
import { ADMIN_ROLE } from '../../../../game/constants';

const GameCard = ({width, game, game: { metadata }, canEdit, canRemove, canPlay, canPublish, editArcadeGame, getArcadeGames, auth: { me }}) => {
  const isEditor = me?.role === ADMIN_ROLE || me?.id === game.user?.id

  function renderPublishButton() {
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

  function renderRemoveButton() {
    if(game.isRemoved) {
      return <Button size="small" onClick={async () => {
        await editArcadeGame(game.id, {
          isRemoved: false
        })
        getArcadeGames()
      }}>
        Restore
      </Button>
    } else {
      return <Button size="small" onClick={async () => {
        await editArcadeGame(game.id, {
          isRemoved: true
        })
        getArcadeGames()
      }}>
        Remove
      </Button>
    }
  }

 return <Card className="GameCard" sx={{ width: 200 }}>
    <CardMedia
      component="img"
      image={metadata.imageUrl ? window.awsUrl + metadata.imageUrl : ""}
      alt={metadata.title}
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {metadata.title}
      </Typography>
      <Typography gutterBottom variant="subtitle2" component="div">
        {'by ' + (metadata.author ? metadata.author : game.user?.username)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
          {metadata.description}
      </Typography>
    </CardContent>
    <CardActions>
      {canPlay && <Link newTab href={`/play/${game.id}`}>
        Play
      </Link>}
      {canEdit && isEditor && < Link to={`/edit/${game.id}`}>
        Edit
      </Link>}
      {canPublish && isEditor && renderPublishButton()}
      {canRemove && isEditor && renderRemoveButton()}
    </CardActions>
  </Card>
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { editArcadeGame, getArcadeGames }))(GameCard);
