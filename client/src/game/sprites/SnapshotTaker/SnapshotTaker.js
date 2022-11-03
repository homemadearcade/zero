import _ from 'lodash';
import React, { } from 'react';
import { connect } from 'react-redux';
import Button from '../../../ui/Button/Button';
import { closeSnapshotTaker } from '../../../store/actions/gameViewEditorActions';

import './SnapshotTaker.scss'

const SnapshotTaker = ({closeSnapshotTaker }) => {
  return (
    <div className="SnapshotTaker">
      <div className="SnapshotTaker__controls">
        <Button
          onClick={() => {
            closeSnapshotTaker()
          }}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps, { closeSnapshotTaker })(SnapshotTaker);