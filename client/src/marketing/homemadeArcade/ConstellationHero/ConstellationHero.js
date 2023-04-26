import React, { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ConstellationHero.scss';
import { Fade, useMediaQuery } from '@mui/material';
import { Constellation } from '../Constellation/Constellation';
import Typography from '../../../ui/Typography/Typography';

const ConstellationHero = ({children, width, height}) => {
  const matches = useMediaQuery('(max-width:800px)');

 return <div className="ConstellationHero">
    <div className="ConstellationHero__placeholder">
    <Fade in timeout={{ enter: 3000 }}><div><Constellation width={width} height={height}>
      <Fade in timeout={{ enter: 5000 }}>
        <div>
          <Typography className="ConstellationHero__title" font="2P" component="h3" variant={matches ? 'h4' : "h2"}>Homemade<br/> Arcade</Typography>
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
