import React from 'react';
import { connect } from 'react-redux';
import './MousePreview.scss'
import { mapCobrowsingState } from '../../utils/cobrowsingUtils';
import Typography from '../../ui/Typography/Typography';
import Sprite from '../sprites/Sprite/Sprite';
import { getThemePrimaryColor } from '../../utils/webPageUtils';
import { getCanvasIdFromColorId, getCanvasIdFromEraserId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../utils/editorUtils';
import { layerToDisplayName } from '../constants';
import Icon from '../../ui/Icon/Icon';
import ColorNameFit from '../color/ColorNameFit/ColorNameFit';

const MousePreview = ({ 
  gameViewEditor: { 
    brushIdHovering, 
    classIdHovering 
  }, 
  gameSelector: {
    brushIdSelectedBrushList,
    classIdSelectedClassList
  },
  gameModel: { 
    gameModel: { 
      classes, brushes, colors
     }
    }
  }) => {

  let objectClass 

  const classId = classIdSelectedClassList || classIdHovering
  if(classId) {
    objectClass = classes[classId]
  }
  
  let brushClass
  let hex; 
  let colorClass
  let isEraser;

  const brushId = brushIdSelectedBrushList || brushIdHovering
  if(brushId) {
    brushClass = brushes[brushId]
    
    if(isBrushIdEraser(brushId)) {  
      isEraser = true
    } else if(isBrushIdColor(brushId)) {
      hex = getHexFromColorId(brushId)
      colorClass = colors[hex]
    }
  }

  function renderStageTitle(title) {
    return <Typography variant="div" sx={{fontSize:'.8rem'}} font="2P">{title}</Typography>

  }

  function renderStage({tint, textureId, title, spriteOverlay}){
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

  function renderBody() {
    if(isEraser) {
        const layerName = layerToDisplayName[getCanvasIdFromEraserId(brushId)]
       return <><div className="MousePreview__stage">
          <div className="MousePreview__stage-item">
            <Icon icon="faEraser"/>
          </div>
        </div>
        {renderStageTitle(layerName)}
      </>
    }
    if(objectClass) {
       return renderStage({
        tint: objectClass.graphics.tint,
        textureId: objectClass.graphics.textureId,
        title: objectClass.name
      })   
    } else if(brushClass) {
      return renderStage({
        tint: brushClass.tint,
        textureId: brushClass.textureId,
        title: layerToDisplayName[brushClass.canvasId]
      })
    } else if(colorClass) {
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
  }

  return <div className="MousePreview">
    <div className="MousePreview__background" style={{backgroundColor: getThemePrimaryColor().hexString}}/>
    {renderBody()}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameViewEditor: state.gameViewEditor,
  gameModel: state.gameModel,
  gameSelector: state.gameSelector

})

export default connect(mapStateToProps, { })(MousePreview);
