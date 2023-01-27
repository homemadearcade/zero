import React, { } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './GamePreview.scss';

const GamePreview = ({lobby: { lobby }}) => {
  return (
    <div className="GamePreview">
      <iframe title="gamepreview" height="100%" width="100%'" src={window.location.origin + '/lobby/' + lobby.id + '/join/' + lobby.participantId}></iframe>
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { })
)(GamePreview);
