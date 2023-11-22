import React from 'react';
import { connect } from 'react-redux';

import { editGameModel } from '../../../store/actions/game/gameModelActions';

import './CameraEditor.scss'
import SliderNotched from '../../../ui/SliderNotched/SliderNotched';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CAMERA_LERP_X_IID, CAMERA_LERP_Y_IID, CAMERA_ZOOM_IID } from '../../../constants/interfaceIds';
import Button from '../../../ui/Button/Button';
import { setResizingEntityInstance, toggleGridView } from '../../../store/actions/game/gameViewEditorActions';
import Typography from '../../../ui/Typography/Typography';
import { CAMERA_ZONE_INSTANCE_IVID } from '../../constants';

const CameraEditor = ({ 
  entityModelId, 
  gameModel: { gameModel },
  gameViewEditor: {
    resizingEntityInstanceId
  },
  gameRoomInstance: {
    gameRoomInstance: {
      currentStageId
    }
  },
  editGameModel,
  setResizingEntityInstance,
  toggleGridView
  }) => {
  const entitySelected = gameModel.entityModels[entityModelId]

  if(!entitySelected?.camera) {
    console.error('opened camera editor on a class with no camera')
    return null
  }

  const boundaries = gameModel.stages[currentStageId].boundaries
  const minZoomWidth = Math.floor((boundaries.width/boundaries.maxWidth) * 3)
  const minZoomHeight = Math.floor((boundaries.height/boundaries.maxHeight) * 3)

  const minZoomIndex = minZoomHeight < minZoomWidth ? minZoomHeight : minZoomWidth

  const zooms = [
    minZoomIndex === 3 && 1,
    minZoomIndex >= 2 && 1.5, 
    // 2.2,
    // 2.4,
    // 2.6,
    // 2.8,
     3, 
     4, 
     5,
     6,
     7,
     8,
     9, 
     10
  ].filter((num) => {
    return !!num
  })

  const initialCameraZoneInstanceId = gameModel.importantValues[CAMERA_ZONE_INSTANCE_IVID].value

  if(initialCameraZoneInstanceId === resizingEntityInstanceId) {
    return <div className="CameraEditor">
      <Typography variant="h6">Put your cursor on the map to resize the Players Camera</Typography>
      <Button onClick={() => {
        setResizingEntityInstance(null)
      }}>Cancel</Button>
    </div>
  }

  return (
    <div className="CameraEditor">
      {false && <Unlockable isSlider interfaceId={CAMERA_ZOOM_IID}>
        <SliderNotched
          formLabel="Zoom -/+"
          options={zooms}
          step={0.2}
          onChangeCommitted={(value) => {
            editGameModel({ entityModels: { [entityModelId]: { camera: { zoom: value }  }}})        
          }}
          value={entitySelected.camera.zoom}
      />
      </Unlockable>}
      <Unlockable isSlider interfaceId={CAMERA_LERP_X_IID}>
        <SliderNotched
          formLabel="Lerp ⇆"
          options={[0, 0.09, 0.2, 0.4, 0.7, 1]}
          step={0.01}
          onChangeCommitted={(value) => {
            editGameModel({ entityModels: { [entityModelId]: { camera: { lerpX: value }  }}})        
          }}
          value={entitySelected.camera.lerpX}
      />
      </Unlockable>
      <Unlockable isSlider interfaceId={CAMERA_LERP_Y_IID}>
        <SliderNotched
          formLabel="Lerp ⇵"
          step={0.01}
          options={[0, 0.09, 0.2, 0.4, 0.7, 1]}
          onChangeCommitted={(value) => {
            editGameModel({ entityModels: { [entityModelId]: { camera: { lerpY: value }  }}})        
          }}
          value={entitySelected.camera.lerpY}
      />
      </Unlockable>
      <Button onClick={() => {
        setResizingEntityInstance(initialCameraZoneInstanceId, null, true)
        toggleGridView(true)
      }}>Resize Player Camera</Button>
    </div>
  );
};

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
  gameViewEditor: state.gameViewEditor,
  gameRoomInstance: state.gameRoomInstance
});

export default connect(mapStateToProps, { editGameModel, toggleGridView, setResizingEntityInstance })(CameraEditor);
