import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Button from '../../../ui/Button/Button';
import { closeSnapshotTaker } from '../../../store/actions/gameViewEditorActions';

import './SnapshotTaker.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { getCurrentGameScene } from '../../../utils/editorUtils';
import store from '../../../store';

const SnapshotTaker = ({closeSnapshotTaker}) => {
  const [isSnapshotSquareFinalized, setIsSnapshotSquareFinalized] = useState(false)

  useEffect(() => {
    
    const snapshotInterval = setInterval(() => {
      if(getCurrentGameScene(store.getState().webPage.gameInstance).snapshotSquare?.finalized) {
        setIsSnapshotSquareFinalized(true)
      }
    }, 100)

    return () => {
      clearInterval(snapshotInterval)
    }
  }, [])

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
        <Button
          disabled={!isSnapshotSquareFinalized}
          onClick={() => {
            getCurrentGameScene(store.getState().webPage.gameInstance).takeSnapshotWithSquare()
          }}
        >
          Take Snapshot
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor
});

export default connect(mapStateToProps, { closeSnapshotTaker })(SnapshotTaker);