/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateColorFlow.scss';
import { toggleEyeDropper } from '../../../store/actions/game/gameFormEditorActions';
import CobrowsingDialog from '../../../game/cobrowsing/CobrowsingDialog/CobrowsingDialog';
import { closeCreateColorFlow } from '../../../store/actions/game/gameFormEditorActions';
import Typography from '../../../ui/Typography/Typography';
import Button from '../../../ui/Button/Button';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import ColorGrid from '../ColorGrid/ColorGrid';
import Icon from '../../../ui/Icon/Icon';
import tinycolor from 'tinycolor2';

const CreateColorFlow = ({ onComplete, closeCreateColorFlow, toggleEyeDropper, gameFormEditor: { color, isEyeDropping }}) => {
  function handleClose() {
    closeCreateColorFlow()
  }

  return <CobrowsingDialog open={!isEyeDropping} onClose={handleClose}>
    <div className="CreateColorFlow">
      <Icon icon="faEyeDropper" onClick={() => {
        const eyeDropper = new window.EyeDropper();
        eyeDropper.open().then((result) => {
          toggleEyeDropper()
          const hex = '#' + tinycolor(result.sRGBHex).toHex()
          onComplete({ layerId: color.layerId, hex })
          handleClose()
        }).catch((e) => {
          console.error(e)
          toggleEyeDropper()
          handleClose()
        });

        toggleEyeDropper()
      }}/>
      <ColorGrid onClick={(hex) => {
          onComplete({ layerId: color.layerId, hex})
          handleClose()
      }}/>
      <div className="CreateColorFlow__buttons">

        <Button onClick={handleClose}>
          Cancel
        </Button>
      </div>
    </div>
  </CobrowsingDialog>
}

{/* <Button onClick={() => {
}}>
  Add Color
</Button> */}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
})

export default compose(
  connect(mapStateToProps, { toggleEyeDropper, closeCreateColorFlow }),
)(CreateColorFlow);
