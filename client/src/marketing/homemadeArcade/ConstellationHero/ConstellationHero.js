import React, { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ConstellationHero.scss';
import { Fade, useMediaQuery } from '@mui/material';
import { Constellation } from '../Constellation/Constellation';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';

const ConstellationHero = ({children}) => {
  const matches = useMediaQuery('(max-width:800px)');

 return <div className="ConstellationHero">
    <div className="ConstellationHero__placeholder">
    <Fade in timeout={{ enter: 3000 }}><div><Constellation>
      <Fade in timeout={{ enter: 5000 }}>
        <div>
          <Typography className="ConstellationHero__title" font="2P" component="h3" variant={matches ? 'h4' : "h1"}>Homemade<br/> Arcade</Typography>
          {children}
        </div>
      </Fade>
    </Constellation></div></Fade>
    </div>
 </div>
};

const mapStateToProps = (state) => ({});

export default compose(
  connect(mapStateToProps, { }))(ConstellationHero);
