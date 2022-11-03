import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './UndoButton.scss';
import ToolbarIcon from '../../../ui/ToolbarIcon/ToolbarIcon';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import LoadingIcon from '../../../ui/LoadingIcon/LoadingIcon';

const UndoButton = ({ onClick, lobby : { isUndoing }}) => {

  if(isUndoing) {
    return <LoadingIcon
      size="lg"
    />
  }

  return <ToolbarIcon
    size="lg"
    icon="faRotateLeft"
    onClick={onClick}
  />
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { }))(UndoButton);
