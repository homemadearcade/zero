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

const GameCard = ({game, game: { metadata }, canEdit, canPlay}) => {
 return <Card sx={{ width: 200 }}>
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
      {canPlay && <Link to={`/play/${game.id}`}>
        Play
      </Link>}
      {canEdit &&<Link to={`/edit/${game.id}`}>
        Edit
      </Link>}
    </CardActions>
  </Card>
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { }))(GameCard);
