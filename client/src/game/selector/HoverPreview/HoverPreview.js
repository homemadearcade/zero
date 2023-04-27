import React, { useState } from 'react';
import { connect } from 'react-redux';
import './HoverPreview.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Texture from '../../textures/Texture/Texture';
import { getLayerIdFromColorId, getLayerIdFromEraserId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../../utils/editorUtils';
import { effectInterfaceDatas, PAUSED_STATE } from '../../constants';
import Icon from '../../../ui/Icon/Icon';
import ColorNameFit from '../../color/ColorNameFit/ColorNameFit';
import { interfaceIdData } from '../../../constants/interfaceIdData';
import { entityModelTypeToDisplayName } from '../../constants';
import { initialStageId } from '../../constants';
import { changeSelectorList, openGameEditDialog, openStageLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import Button from '../../../ui/Button/Button';
import { openEditEntityDialog, openEditRelationSystemDialog, openEffectPromptDialog } from '../../../store/actions/game/gameFormEditorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { 
  CHANGE_SELECTOR_TABS_IID, 
  EDIT_STAGE_COLOR_TAB_IID,
  GAME_OPEN_EDIT_IID, 
  GAME_OPEN_SNAPSHOT_IID, 
  HOVER_PREVIEW_IID, 
  SELECTOR_RELATION_SYSTEM_IID, 
  SELECTOR_ENTITY_BY_INTERFACE_ID_IID, 
  STAGE_OPEN_BACKGROUND_COLOR_IID
} from '../../../constants/interfaceIds';
import { openSnapshotTaker } from '../../../store/actions/game/gameViewEditorActions';
import { useWishTheme } from '../../../hooks/useWishTheme';
import IconButton from '../../../ui/IconButton/IconButton';
import useGameEditorSize from '../../../hooks/useGameEditorSize';

          // {<Unlockable interfaceId={CHANGE_SELECTOR_TABS_IID}>
          //   <Button size="xs" onClick={() => {
          //     openEffectPromptDialog()
          //   }}><Icon icon="faTerminal"/></Button>
          // </Unlockable>}

          //           <Unlockable interfaceId={GAME_OPEN_SNAPSHOT_IID}>
          //   <Button size="xs" onClick={() => {
          //     openSnapshotTaker()
          //   }}><Icon icon="faCameraRetro"/></Button>
          // </Unlockable>
const HoverPreview = ({ 
  cobrowsing: {
    mouseOverInterfaceId
  },
  hoverPreview: { 
    brushIdHovering, 
    entityModelIdHovering,
    entityInstanceIdHovering,
    instanceEntityIdHovering,
    instanceDataHovering,
    effectIdHovering,
    relationIdHovering,
    relationTagIdHovering
  },
  gameSelector: {
    brushIdSelectedBrushList,
    entityModelIdSelectedEntityList,
    currentSelectorListInterfaceId,
  },
  gameModel: { 
    currentStageId,
    gameModel,
  },
  gameRoomInstance: {
    gameRoomInstance
  },
  gameViewEditor: {
    isBoundaryEditorOpen,
    isSnapshotTakerOpen
  },
  openGameEditDialog,
  openEditEntityDialog,
  openStageLiveEditor,
  openSnapshotTaker,
  openEditRelationSystemDialog,
  changeSelectorList,
  openEffectPromptDialog,
}) => {
  const [isHoveringOverTitle, setIsHoveringOverTitle] = useState(false)
  const theme = useWishTheme()
  const { gameEditorHeight } = useGameEditorSize()

  if(!gameModel) return 
  
  const { 
      metadata,
      entityModels,
      brushes,
      stages,
      effects,
      relations,
      relationTags
    } = gameModel

  const currentStage = stages[currentStageId]

  let entityModel

  const entityModelId = instanceEntityIdHovering || entityModelIdHovering || entityModelIdSelectedEntityList 
  if(entityModelId) {
    entityModel = entityModels[entityModelId]
  }
  
  let brushModel
  let hex; 
  let isEraser;

  const brushId = brushIdHovering || brushIdSelectedBrushList
  if(brushId) {
    brushModel = brushes[brushId]
    
    if(isBrushIdEraser(brushId)) {  
      isEraser = true
    } else if(isBrushIdColor(brushId)) {
      hex = getHexFromColorId(brushId)
    }
  }

  const interfaceData = interfaceIdData[mouseOverInterfaceId]

  function renderDisplayTitle(title, onEdit) {
    return <>
      <Typography 
        variant="div" 
        sx={{fontSize:'.8em'}}
        font="2P">
        {title}
      </Typography>
    </>
  }

  function renderTextOnlyDisplay({title, subtitle, onEdit}) {
      return <div className="HoverPreview__title">
        {renderDisplayTitle(title, onEdit)}
        <Typography 
          variant="div" 
          sx={{fontSize:'1em', marginTop: '.2em'}}
        >
          {subtitle}
        </Typography>
      </div>
  }

  function renderDisplayWithTexture({textureTint, textureId, title, spriteOverlay, onEdit}) {
    return <>
      <div className="HoverPreview__display">
        <div className="HoverPreview__display-item">
          <Texture textureTint={textureTint} textureId={textureId}>
          </Texture>
          {spriteOverlay && <div className="HoverPreview__display-item-overlay">
            {spriteOverlay}
          </div>}
        </div>
        {renderDisplayTitle(title, onEdit)}
      </div>
    </>
  }

  function renderEntityDisplay() {
    let title = entityModel.name + ' - ' + entityModelTypeToDisplayName[entityModel.entityIID]
    if(instanceDataHovering?.isSpawned) title += ' (Spawned)'
    return renderDisplayWithTexture({
      textureTint: entityModel.graphics.textureTint,
      textureId: entityModel.graphics.textureId,
      title,
    })
  }

  function renderBrushDisplay() {
    const layer = gameModel.layers[brushModel.layerId]
    if(!layer) return null
    return renderDisplayWithTexture({
      textureTint: brushModel.textureTint,
      textureId: brushModel.textureId,
      title: layer.name
    })
  }

  function renderColorDisplay() {
    const layer = gameModel.layers[getLayerIdFromColorId(brushId)]
    if(!layer) return null
    return renderDisplayWithTexture({
      textureTint: hex,
      spriteOverlay: <ColorNameFit hex={hex}/>,
      title:<>
        {layer && <>
          <br/>{layer.name}
        </>}
      </> 
    })
  }

  function renderEraserDisplay() {
    const layer = gameModel.layers[getLayerIdFromEraserId(brushId)]
    if(!layer) return null
    return <><div className="HoverPreview__display">
        <div className="HoverPreview__display-item">
          <Icon icon="faEraser"/>
        </div>
        {renderDisplayTitle(layer.name)}
      </div>
    </>
  }

  function renderGameTitleDisplay() {
    const imageBackground = metadata.imageUrl;

    // <Unlockable interfaceId={CONTEXT_MENU_SNAPSHOT_IID}>
    //   <MenuItem onClick={() => {
    //     openSnapshotTaker()
    //     onMenuItemClick()
    //   }}>Take Snapshot</MenuItem>
    // </Unlockable>
    if(isHoveringOverTitle) {
     return  <div className="HoverPreview__title">
        <div className="HoverPreview__actions">
          <Unlockable interfaceId={GAME_OPEN_EDIT_IID}>
            <Button size="xs" startIcon={<Icon icon="faGamepad"/>} onClick={() => {
              openGameEditDialog()
            }}>Edit Game</Button>
          </Unlockable>
          <Unlockable interfaceId={CHANGE_SELECTOR_TABS_IID}>
            <Button startIcon={<Icon icon="faLink"/>} size="xs" onClick={() => {
              openEditRelationSystemDialog()
            }}>Edit Relationships</Button>
          </Unlockable>
          <Unlockable interfaceId={CHANGE_SELECTOR_TABS_IID}>
            <Button startIcon={<Icon icon="faIcons"/>} size="xs" onClick={() => {
              
            }}>Edit Content</Button>
          </Unlockable>
          <Unlockable interfaceId={CHANGE_SELECTOR_TABS_IID}>
            <Button startIcon={<Icon icon="faMap"/>} size="xs" onClick={() => {
              openStageLiveEditor()
            }}>Edit Stage</Button>
          </Unlockable>
        </div>
      </div>
    }

   return  <>
    {metadata.imageUrl && <div className="HoverPreview__image-background" style={{backgroundImage: imageBackground ? `url("${imageBackground}"` : ''}}></div>}
    <div className="HoverPreview__title" onClick={() => {
      // if(currentSelectorListInterfaceId === SELECTOR_ENTITY_BY_INTERFACE_ID_IID) changeSelectorList(SELECTOR_RELATION_SYSTEM)
    }}>
      <Typography font="2P" variant="subtitle2">
        {metadata.title}
       </Typography>
       {currentSelectorListInterfaceId !== SELECTOR_ENTITY_BY_INTERFACE_ID_IID && <div className="HoverPreview__close">
        <IconButton icon="faClose" onClick={() => {
          changeSelectorList(SELECTOR_ENTITY_BY_INTERFACE_ID_IID)
        }}></IconButton>
      </div>}
      {(gameRoomInstance.gameState === PAUSED_STATE) && renderDisplayTitle('(Paused)')}
      {currentStageId === initialStageId ? null : <>
        <Typography font="2P" variant="subtitle2" sx={{fontSize: '0.5em'}} >{currentStage.name}</Typography>
      </>}
      {isHoveringOverTitle && <div className="HoverPreview__actions">
        <Unlockable interfaceId={STAGE_OPEN_BACKGROUND_COLOR_IID}>
          <Button size="xs" className="HoverPreview__actions-color" onClick={() => {
            openStageLiveEditor(EDIT_STAGE_COLOR_TAB_IID)
          }} style={{borderColor: theme.primaryColor.hexString, backgroundColor: currentStage.color, height: '1.2em', width: '4em'}}/>
        </Unlockable>
      </div>}
    </div>
   </>
  }

  function renderBody() {
    if(interfaceData?.previewText) {
      return <div className="HoverPreview__title">
        <Typography font="2P" variant="subtitle2">{interfaceData.previewText}</Typography>
      </div>
    }

    if(isBoundaryEditorOpen) {
      return renderTextOnlyDisplay({
        title: 'Editing Boundaries',
        subtitle: 'Click squares on the map to allow movement into that area',
      })
    } 
    
    if(isSnapshotTakerOpen) {
      return renderTextOnlyDisplay({
        title: 'Taking Snapshot',
        subtitle: 'Draw a square on the map for where you want to take a photo',
      })
    }

    // hovering 
    if(relationTagIdHovering) {
      const relationTag = relationTags[relationTagIdHovering]
      return renderDisplayWithTexture({
        title: relationTag.name,
        textureTint: relationTag.textureTint,
        textureId: relationTag.textureId,
      })
    } else if(effectIdHovering) {
      const effect = effects[effectIdHovering]
      return renderTextOnlyDisplay({
        title: effectInterfaceDatas[effect.effectBehavior].displayName
      })
    } else if(instanceEntityIdHovering) {
      return renderEntityDisplay()
    } else if(entityModelIdHovering) {
      return renderEntityDisplay()
    } else if(brushIdHovering) {
      if(hex) return renderColorDisplay()
      return renderBrushDisplay()
    }
    
    // selected
    if(entityModelIdSelectedEntityList) {
      return renderEntityDisplay()
    } else if(brushIdSelectedBrushList) {
      if(isEraser) return renderEraserDisplay()
      if(hex) return renderColorDisplay()
      return renderBrushDisplay()
    }


    return renderGameTitleDisplay()
  }


  return <Unlockable interfaceId={HOVER_PREVIEW_IID}>
    <div className="HoverPreview"
      style={{backgroundColor: '#222', color: 'white', height: gameEditorHeight ? gameEditorHeight * 0.2 : 0}}
      onMouseEnter={() => {
        setIsHoveringOverTitle(true)
      }} 
      onMouseLeave={() => {
        setIsHoveringOverTitle(false)
      }}
    >
      {renderBody()}
    </div>
  </Unlockable>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  hoverPreview: state.hoverPreview,
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
  cobrowsing: state.cobrowsing,
  gameRoomInstance: state.gameRoomInstance,
  gameViewEditor: state.gameViewEditor,
})

export default connect(mapStateToProps, { openEditRelationSystemDialog, openStageLiveEditor, openEffectPromptDialog, openGameEditDialog, openEditEntityDialog, openStageLiveEditor, openSnapshotTaker, changeSelectorList })(HoverPreview);
