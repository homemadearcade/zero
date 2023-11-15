import React, { useEffect, useRef } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ConstellationHero.scss';
import { Fade, useMediaQuery } from '@mui/material';
import { Constellation } from '../Constellation/Constellation';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';

const ConstellationHero = ({children, width, height}) => {
  const matches = useMediaQuery('(max-width:800px)');

 return <div className="ConstellationHero">
    <div className="ConstellationHero__placeholder">
    <Fade in timeout={{ enter: 3000 }}><div><Constellation width={width} height={window.innerHeight/1.4}>
      <Fade in timeout={{ enter: 5000 }}>
        <div className="ConstellationHero__sections">
          <div className="ConstellationHero__title">
            <Typography  font="2P" component="h3" variant={matches ? 'h4' : "h2"}>Homemade<br/> Arcade</Typography>
            <Typography variant={"h5"}>Make your own game as the<br/> arcade cabinet comes to life</Typography>
            <Button 
              href="https://www.spencerwilliams.work/homemade-arcade"
              variant="contained" size="large" style={{marginTop: '1em', width: '200px'}} onClick={() => {

            }}>Buy Tickets</Button> 
          </div>
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
