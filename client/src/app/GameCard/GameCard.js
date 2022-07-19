import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import moment from 'moment';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '../ui/Typography/Typography';

import './GameCard.scss';

const GameCard = ({game}) => {
 return <Card sx={{ maxWidth: 345 }}>
    <CardMedia
      component="img"
      height="140"
      image="/static/images/cards/contemplative-reptile.jpg"
      alt="green iguana"
    />
    <CardContent>
      <Typography gutterBottom variant="h5" component="div">
        {game?.user.username + 's game'}
      </Typography>
      <Typography variant="body2" color="text.secondary">
          Description of game
      </Typography>
    </CardContent>
  </Card>
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { }))(GameCard);
