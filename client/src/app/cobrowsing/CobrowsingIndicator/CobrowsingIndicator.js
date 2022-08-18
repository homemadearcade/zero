/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Icon from '../../ui/Icon/Icon';
import { toggleActiveCobrowsing } from '../../../store/actions/cobrowsingActions';
import { Switch } from '@mui/material';

import './CobrowsingIndicator.scss'

const CobrowsingIndicator = ({
  cobrowsing: { isCurrentlyCobrowsing },
  toggleActiveCobrowsing,
}) => {
  return <div
    className="CobrowsingIndicator"
    onClick={() => {
      toggleActiveCobrowsing()
    }}
  > 
    <Icon icon="faMask"/>
    <Switch
      checked={isCurrentlyCobrowsing}
      />
  </div>
};

const mapStateToProps = (state) => ({
  cobrowsing: state.cobrowsing,
});

export default compose(
  connect(mapStateToProps, { toggleActiveCobrowsing }),
)(CobrowsingIndicator);
