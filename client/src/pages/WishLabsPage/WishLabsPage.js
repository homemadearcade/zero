import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Link from '../../ui/Link/Link';

import './WishLabsPage.scss';
import ShootingStarSky from '../../app/wishLabs/ShootingStarSky/ShootingStarSky';

const WishLabsPage = ({ }) => {
  return <div className="WishLabsPage">
    <ShootingStarSky/>
    <div className="WishLabsPage__footer">
      <div className="WishLabsPage__brandname">Wish Labs</div>
      <div className="WishLabsPage__links">
        <Link to="/">Work</Link>
        <Link to="/">Press</Link>
        <Link to="/">Careers</Link>
      </div>
    </div>
  </div>
};

const mapStateToProps = (state) => ({

});

export default compose(connect(mapStateToProps, { }))(WishLabsPage);
