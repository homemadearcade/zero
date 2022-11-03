import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './JumboDescription.scss';
import Typography from '../../../ui/Typography/Typography';
import Icon from '../../../ui/Icon/Icon';

// <Typography component="h1" variant="h3" >Bringing people</Typography>
// <Typography component="h1" variant="h3">together through</Typography>
// <Typography component="h1" variant="h3">Immersive Theater</Typography>
// <Typography component="h1" variant="h3">and</Typography>
// <Typography component="h1" variant="h3">Multiplayer Games</Typography>

const JumboDescription = ({game}) => {
 return <div className="JumboDescription">
    <Typography component="h1" variant="h3" fontWeight={100}>Bringing us together through Immersive Theater and Multiplayer Games
    </Typography>
 </div>
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { }))(JumboDescription);
