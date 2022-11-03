import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CobrowsingStatus.scss';
import UserStatus from '../../UserStatus/UserStatus';
import Link from '../../../ui/Link/Link';

const CobrowsingStatus = ({ auth: {me}, cobrowsingUser, lobby: { lobby } }) => {
  if(cobrowsingUser.id === me.id) {
    return (
      <div className="CobrowsingStatus">
        <Link to={`/lobby/${lobby.id}`}>leave game</Link>
      </div>
    );
  }

  return (
    <div className="CobrowsingStatus">
      <UserStatus userId={cobrowsingUser.id}/>
      <Link to={`/lobby/${lobby.id}`}>leave game</Link>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
  cobrowsingUser: state.cobrowsing.cobrowsingUser,
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, {}),
)(CobrowsingStatus);
