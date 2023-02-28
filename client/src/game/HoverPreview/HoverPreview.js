import React, { useState } from 'react';
import { connect } from 'react-redux';
import './HoverPreview.scss'
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import Typography from '../../ui/Typography/Typography';
import Sprite from '../sprites/Sprite/Sprite';
import { getCanvasIdFromColorId, getCanvasIdFromEraserId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../utils/editorUtils';
import { layerToDisplayName, PAUSED_STATE, STOPPED_STATE } from '../constants';
import Icon from '../../ui/Icon/Icon';
import ColorNameFit from '../color/ColorNameFit/ColorNameFit';
import { interfaceIdData } from '../../constants/interfaceIdData';
import { classTypeToDisplayName } from '../defaultData/class';
import { initialStageId } from '../defaultData';
import { openClassNameModal, openGameMetadataModal } from '../../store/actions/gameSelectorActions';

const HoverPreview = ({ 
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

  openGameMetadataModal,
  openClassNameModal
}) => {
  const [isHoveringOverTitle, setIsHoveringOverTitle] = useState(false)

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


  function renderEditableIcon(onEdit) {
    return isHoveringOverTitle && <div onClick={onEdit}><Icon icon="faPen"></Icon></div>
  }

  function renderDisplayTitle(title, onEdit) {
    if(onEdit) {
      return <Typography 
        variant="div" 
        sx={{fontSize:'.8rem'}}
        font="2P">
        {title}
        {renderEditableIcon()}
      </Typography>
    }
    return <Typography 
      variant="div" 
      sx={{fontSize:'.8rem'}}
      font="2P">
       {title}
    </Typography>
  }

  function renderDisplay({tint, textureId, title, spriteOverlay, onEdit}) {
    return <>
      <div className="HoverPreview__display">
        <div className="HoverPreview__display-item">
          <Sprite tint={tint} textureId={textureId}>
          </Sprite>
          {spriteOverlay && <div className="HoverPreview__display-item-overlay">
            {spriteOverlay}
          </div>}
        </div>
        {renderDisplayTitle(title, onEdit)}
      </div>
    </>
  }

  function renderClassDisplay() {
    return renderDisplay({
      tint: objectClass.graphics.tint,
      textureId: objectClass.graphics.textureId,
      title: objectClass.name + ' - ' + classTypeToDisplayName[objectClass.type],
      onEdit: () => {
        openClassNameModal(objectClass.id)
      }
    })   
  }

  function renderBrushDisplay() {
    return renderDisplay({
      tint: brushClass.tint,
      textureId: brushClass.textureId,
      title: layerToDisplayName[brushClass.canvasId]
    })
  }

  function renderColorDisplay() {
    const layerName = layerToDisplayName[getCanvasIdFromColorId(brushId)]
    return renderDisplay({
      tint: hex,
      spriteOverlay: <ColorNameFit hex={hex}/>,
      title:<>
        {layerName && <>
          <br/>{layerName}
        </>}
      </> 
    })
  }

  function renderEraserDisplay() {
    const layerName = layerToDisplayName[getCanvasIdFromEraserId(brushId)]
    return <><div className="HoverPreview__display">
        <div className="HoverPreview__display-item">
          <Icon icon="faEraser"/>
        </div>
        {renderDisplayTitle(layerName)}
      </div>
    </>
  }

  function renderGameTitleDisplay() {
    const stageName = currentStageId === initialStageId ? null : stages[currentStageId].name

   return  <div className="HoverPreview__title">
      <Typography font="2P" variant="subtitle2">
        {metadata.title}
      </Typography>
      {stageName && <Typography font="2P" variant="subtitle2" sx={{fontSize: '0.5rem'}} >{stageName}</Typography>}
    </div>
  }

  function renderBody() {
    if(interfaceData?.previewText) {
      return <div className="HoverPreview__title">
        <Typography font="2P" variant="subtitle2">{interfaceData.previewText}</Typography>
      </div>
    }

    // hovering 
    if(instanceClassIdHovering) {
      return renderClassDisplay()
    } else if(classIdHovering) {
      return renderClassDisplay()
    } else if(brushIdHovering) {
      if(hex) return renderColorDisplay()
      return renderBrushDisplay()
    }
    
    // selected
    if(classIdSelectedClassList) {
      return renderClassDisplay()
    } else if(brushIdSelectedBrushList) {
      if(isEraser) return renderEraserDisplay()
      if(hex) return renderColorDisplay()
      return renderBrushDisplay()
    }

    if(gameRoom.gameState === PAUSED_STATE || gameRoom.gameState === STOPPED_STATE) {
      return renderDisplayTitle('Paused')
    }

    return renderGameTitleDisplay()
  }

  return <div className="HoverPreview"
    onMouseEnter={() => {
      setIsHoveringOverTitle(true)
    }} 
    onMouseLeave={() => {
      setIsHoveringOverTitle(false)
    }}
  >
    <div className="HoverPreview__background" style={{backgroundColor: '#222', color: 'white'}}/>
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

export default connect(mapStateToProps, { openGameMetadataModal, openClassNameModal })(HoverPreview);
