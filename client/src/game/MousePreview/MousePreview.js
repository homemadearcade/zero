import React from 'react';
import { connect } from 'react-redux';
import './MousePreview.scss'
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import Typography from '../../ui/Typography/Typography';
import Sprite from '../sprites/Sprite/Sprite';
import { getThemePrimaryColor } from '../../utils/webPageUtils';
import { getCanvasIdFromColorId, getCanvasIdFromEraserId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../utils/editorUtils';
import { layerToDisplayName, PAUSED_STATE, PLAY_STATE, STOPPED_STATE } from '../constants';
import Icon from '../../ui/Icon/Icon';
import ColorNameFit from '../color/ColorNameFit/ColorNameFit';
import { interfaceIdData } from '../../constants/interfaceIdData';
import { classTypeToDisplayName } from '../defaultData/class';
import { initialStageId } from '../defaultData';

const MousePreview = ({ 
  cobrowsing: {
    mouseOverInterfaceId
  },
  gameViewEditor: { 
    brushIdHovering, 
    classIdHovering,
    instanceIdHovering,
    instanceClassIdHovering,
  },
  gameSelector: {
    brushIdSelectedBrushList,
    classIdSelectedClassList
  },
  gameModel: { 
    currentStageId,
    gameModel: { 
      metadata,
      classes,
      brushes,
      stages,
    }
  },
  gameRoom: {
    gameRoom
  },
}) => {

  let objectClass

  const classId = instanceClassIdHovering || classIdHovering || classIdSelectedClassList 
  if(classId) {
    objectClass = classes[classId]
  }
  
  let brushClass
  let hex; 
  let isEraser;

  const brushId = brushIdHovering || brushIdSelectedBrushList
  if(brushId) {
    brushClass = brushes[brushId]
    
    if(isBrushIdEraser(brushId)) {  
      isEraser = true
    } else if(isBrushIdColor(brushId)) {
      hex = getHexFromColorId(brushId)
    }
  }

  const interfaceData = interfaceIdData[mouseOverInterfaceId]

  function renderStageTitle(title) {
    return <Typography variant="div" sx={{fontSize:'.8rem'}} font="2P">{title}</Typography>
  }

  function renderStage({tint, textureId, title, spriteOverlay}) {
    return <>
      <div className="MousePreview__stage">
        <div className="MousePreview__stage-item">
          <Sprite tint={tint} textureId={textureId}>
          </Sprite>
          {spriteOverlay && <div className="MousePreview__stage-item-overlay">
            {spriteOverlay}
          </div>}
        </div>
        {renderStageTitle(title)}
      </div>
    </>
  }

  function renderClassPreview() {
    return renderStage({
      tint: objectClass.graphics.tint,
      textureId: objectClass.graphics.textureId,
      title: objectClass.name + ' - ' + classTypeToDisplayName[objectClass.type]
    })   
  }

  function renderBrushPreview() {
    return renderStage({
      tint: brushClass.tint,
      textureId: brushClass.textureId,
      title: layerToDisplayName[brushClass.canvasId]
    })
  }

  function renderColorPreview() {
    const layerName = layerToDisplayName[getCanvasIdFromColorId(brushId)]
    return renderStage({
      tint: hex,
      spriteOverlay: <ColorNameFit hex={hex}/>,
      title:<>
        {layerName && <>
          <br/>{layerName}
        </>}
      </> 
    })
  }

  function renderEraserPreview() {
    const layerName = layerToDisplayName[getCanvasIdFromEraserId(brushId)]
    return <><div className="MousePreview__stage">
        <div className="MousePreview__stage-item">
          <Icon icon="faEraser"/>
        </div>
        {renderStageTitle(layerName)}
      </div>
    </>
  }

  function renderGameTitlePreview() {
    const stageName = currentStageId === initialStageId ? null : stages[currentStageId].name

   return  <div className="MousePreview__title">
      <Typography font="2P" variant="subtitle2">{metadata.title}</Typography>
      {stageName && <Typography font="2P" variant="subtitle2" sx={{fontSize: '0.5rem'}} >{stageName}</Typography>}
    </div>
  }

  function renderBody() {
    if(interfaceData?.previewText) {
      return <div className="MousePreview__title">
        <Typography font="2P" variant="subtitle2">{interfaceData.previewText}</Typography>
      </div>
    }

    // hovering 
    if(instanceClassIdHovering) {
      return renderClassPreview()
    } else if(classIdHovering) {
      return renderClassPreview()
    } else if(brushIdHovering) {
      if(hex) return renderColorPreview()
      return renderBrushPreview()
    }
    
    // selected
    if(classIdSelectedClassList) {
      return renderClassPreview()
    } else if(brushIdSelectedBrushList) {
      if(isEraser) return renderEraserPreview()
      if(hex) return renderColorPreview()
      return renderBrushPreview()
    }

    if(gameRoom.gameState === PAUSED_STATE || gameRoom.gameState === STOPPED_STATE) {
      return renderStageTitle('Paused')
    }

    return renderGameTitlePreview()
  }

  return <div className="MousePreview">
    <div className="MousePreview__background" style={{backgroundColor: '#222', color: 'white'}}/>
    {renderBody()}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor,
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
  cobrowsing: state.cobrowsing,
  gameRoom: state.gameRoom
})

export default connect(mapStateToProps, { })(MousePreview);
