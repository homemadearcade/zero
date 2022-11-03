import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './Portfolio.scss';

const Portfolio = ({game}) => {
 return <div className="Portfolio">
    <div className="Portfolio__bar-of-dreams">
    
    </div>
 </div>
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, { }))(Portfolio);
