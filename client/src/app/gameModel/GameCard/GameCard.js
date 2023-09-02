import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '../../../ui/Typography/Typography';

import './GameCard.scss';
import { CardActions } from '@mui/material';
import Link from '../../../ui/Link/Link';
import { editArcadeGame, getArcadeGames } from '../../../store/actions/game/arcadeGameActions';
import Button from '../../../ui/Button/Button';
import { APP_ADMIN_ROLE } from '../../../constants';

const GameCard = ({game, game: { metadata }, width, canEdit, canRemove, canPlay, canPublish, editArcadeGame, getArcadeGames, auth: { me }}) => {
  const isEditor = me?.roles[APP_ADMIN_ROLE] || me?.id === game.owner?.id

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

 return <Card className="GameCard" sx={{ width: width? width : 200 }}>
    <CardMedia
      component="img"
      image={metadata.imageUrl ? metadata.imageUrl : ""}
      alt={metadata.title}
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {metadata.title}
      </Typography>
      <Typography gutterBottom variant="subtitle2" component="div">
        {'by ' + (metadata.author ? metadata.author : game.owner?.username)}
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
      {canRemove && isEditor && renderRemoveButton()}
    </CardActions>
  </Card>
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { editArcadeGame, getArcadeGames }))(GameCard);
