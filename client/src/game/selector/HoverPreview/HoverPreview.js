import React, { useState } from 'react';
import { connect } from 'react-redux';
import './HoverPreview.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Texture from '../../textures/Texture/Texture';
import { getLayerIdFromColorId, getLayerIdFromEraserId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../../utils/editorUtils';
import { dataSourceIIDToIcon,
   INITIAL_STAGE_RID,
   layerGroupIIDtoShortName, ON_STEP_BEGINS, PAUSED_STATE } from '../../constants';
import Icon from '../../../ui/Icon/Icon';
import ColorNameFit from '../../color/ColorNameFit/ColorNameFit';
import { interfaceIdData } from '../../../constants/interfaceIdData';
import { entityModelClassToDisplayName } from '../../constants';
import { changeSelectorList, openEntityBehaviorLiveEditor, openGameEditDialog, openStageLiveEditor } from '../../../store/actions/game/gameSelectorActions';
import Button from '../../../ui/Button/Button';
import { openEditContentDialog, openEditEntityDialog, openEditEntityGraphics, openEditRelationSystemDialog, openEffectPromptDialog } from '../../../store/actions/game/gameFormEditorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { 
  GAME_OPEN_EDIT_IID, 
  HOVER_PREVIEW_IID, 
  STAGE_OPEN_EDIT_IID,
  RELATION_SYSTEM_OPEN_EDIT_IID,
  CONTENT_OPEN_EDIT_IID,
  EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID,
  ENTITY_MODEL_OPEN_BEHAVIOR_EDIT_IID,
  ENTITY_MODEL_OPEN_EDIT_IID,
  ENTITY_MODEL_OPEN_GRAPHICS_IID
} from '../../../constants/interfaceIds';
import { openSnapshotTaker } from '../../../store/actions/game/gameViewEditorActions';
import { useWishTheme } from '../../../hooks/useWishTheme';
import useGameEditorSize from '../../../hooks/useGameEditorSize';
import { Paper } from '@mui/material';
import { enrichEffectData } from '../../../utils';

    // <Unlockable interfaceId={CONTEXT_MENU_SNAPSHOT_IID}>
    //   <MenuItem onClick={() => {
    //     openSnapshotTaker()
    //     onMenuItemClick()
    //   }}>Take Snapshot</MenuItem>
    // </Unlockable>

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

      //           {isHoveringOverPreview && <div className="HoverPreview__actions">
      //   <Unlockable interfaceId={STAGE_OPEN_BACKGROUND_COLOR_IID}>
      //     <Button size="xs" className="HoverPreview__actions-color" onClick={() => {
      //       openStageLiveEditor(LIVE_EDIT_STAGE_COLOR_TAB_IID)
      //     }} style={{borderColor: theme.primaryColor.hexString, backgroundColor: currentStage.color, height: '1.2em', width: '4em'}}/>
      //   </Unlockable>
      // </div>}
const HoverPreview = ({ 
  cobrowsing: {
    interfaceIdHovering
  },
  hoverPreview: { 
    brushIdHovering, 
    entityModelIdHovering,
    entityInstanceIdHovering,
    instanceDataHovering,
    effectIdHovering,
    keyboardShortcutActionIdHovering,
    relationIdHovering,
    relationTagIdHovering
  },
  gameSelector: {
    brushIdSelectedBrushList,
    entityModelIdSelectedEntityList,
    currentSelectorListInterfaceId,
  },
  gameModel: { 
    gameModel,
  },
  gameRoomInstance: {
    gameRoomInstance,
    gameRoomInstance: {
      currentStageId,
    }
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
  openEditContentDialog,
  openEditEntityGraphics, 
  openEntityBehaviorLiveEditor
}) => {
  const [isHoveringOverPreview, setIsHoveringOverPreview] = useState(false)
  const theme = useWishTheme()
  const { gameEditorHeight } = useGameEditorSize()

  if(!gameModel) return 
  
  const { 
      metadata,
      entityModels,
      brushes,
      stages,
      effects,
      layers,
      relations,
      relationTags
    } = gameModel

  const currentStage = stages[currentStageId]

  let entityModel

  const entityModelId = entityModelIdHovering || entityModelIdSelectedEntityList 
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

  const effectId = effectIdHovering || keyboardShortcutActionIdHovering

  const interfaceData = interfaceIdData[interfaceIdHovering]

  const initialStageId = INITIAL_STAGE_RID

  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  //// DISPLAY PARTS
  function renderPrimaryTitle(title, onEdit) {
    return <>
      <Typography 
        variant="div" 
        sx={{fontSize:'.7em', padding: '0 1em'}}
        font="2P">
          {title}
      </Typography>
    </>
  }

  function renderCategoryTitle(title, onEdit) {
    return <div className="HoverPreview__category-title">
      <Paper elevation={8} sx={{padding: '.4em'}}>
        <Typography 
          variant="div" 
          sx={{fontSize:'.8em'}}
          font="2P">
          {title}
        </Typography>
      </Paper>
    </div>
  }

  function renderTopRightCornerData(data, onEdit) {
    return <div className="HoverPreview__top-right-corner-data">
      {data.map((data) => {
        return <Paper key={data.text + data.icon} elevation={5} sx={{
            padding: '.4em',
            justifyContent: 'center',
            display: 'flex'
          }}>
          {data.icon && <Icon size="xs" icon={data.icon}/>}
          {data.icon && data.text && <div style={{display: 'inline-flex', width: '.2em'}}/>}
          {data.text && <Typography 
            variant="div" 
            // font="2P"
            sx={{fontSize:'.6em'}}
          >{data.text}</Typography>}
        </Paper>
      })}
    </div>
  }

  function renderTextOnlyDisplay({title, icon, subtitle, onEdit}) {
      return <div className="HoverPreview__title">
        {icon && <div className='HoverPreview__title-icon'>
          <Icon icon={icon}/>
        </div>}
        {renderPrimaryTitle(title, onEdit)}
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
        {renderPrimaryTitle(title, onEdit)}
      </div>
    </>
  }


  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  //// SPECIFIC DISPLAYS
  function renderEntityDisplay() {
    if(isHoveringOverPreview) {
      return <div className="HoverPreview__title">
        <div className="HoverPreview__actions">
        <Unlockable interfaceId={ENTITY_MODEL_OPEN_GRAPHICS_IID}>
          <Button size="xs" startIcon={<Icon icon="faImage"/>} onClick={() => {
            openEditEntityGraphics(EDIT_ENTITY_GRAPHICS_PRIMARY_DIALOG_IID, entityModel)
          }}>Edit Sprite</Button>
        </Unlockable>
        <Unlockable interfaceId={ENTITY_MODEL_OPEN_BEHAVIOR_EDIT_IID}>
          <Button startIcon={<Icon icon="faDna"/>} size="xs" onClick={() => {
            openEntityBehaviorLiveEditor(null, entityModelId)
          }}>Edit Behaviors</Button>
        </Unlockable>
        <Unlockable interfaceId={ENTITY_MODEL_OPEN_EDIT_IID}>
          <Button startIcon={<Icon icon="faChessPawn"/>} size="xs" onClick={() => {
            openEditEntityDialog(entityModel)
          }}>Edit {entityModelClassToDisplayName[entityModel.entityClassIID]}</Button>
        </Unlockable>
        </div>
      </div>
    }

    let title = entityModel.name
    if(instanceDataHovering?.isSpawned) title += ' (Spawned)'
    return <>
      {renderTopRightCornerData([
        { 
          icon: 'faLayerGroup',
          text: layerGroupIIDtoShortName[entityModel.graphics.layerGroupIID]
        },
        {
          icon: 'faTag',
          text: Object.keys(entityModel.relationTags).filter((relationTagId) => {
            return entityModel.relationTags[relationTagId]
          }).length
        },
        {
          icon: dataSourceIIDToIcon[entityModel.dataSourceIID]
        },
      ])}
      {renderCategoryTitle(entityModelClassToDisplayName[entityModel.entityClassIID])}
      {renderDisplayWithTexture({
        textureTint: entityModel.graphics.textureTint,
        textureId: entityModel.graphics.textureId,
        title,
      })}
    </>
  }

  function renderBrushDisplay() {
    const layer = layers[brushModel.layerId]
    if(!layer) return null
    return <>
      {renderTopRightCornerData([{
        icon: 'faLayerGroup',
        text: layerGroupIIDtoShortName[layer.layerGroupIID]
      }])}
      {renderCategoryTitle('Brush')}
      {renderDisplayWithTexture({
        textureTint: brushModel.textureTint,
        textureId: brushModel.textureId,
      })}
    </>
  }

  function renderColorDisplay() {
    const layer = layers[getLayerIdFromColorId(brushId)]
    if(!layer) return null
    return <>
      {renderTopRightCornerData([{
        icon: 'faLayerGroup',
        text: layerGroupIIDtoShortName[layer.layerGroupIID]
      }])}
      {renderCategoryTitle('Brush')}
      {renderDisplayWithTexture({
        textureTint: hex,
        spriteOverlay: hex,
        title: <>
          <ColorNameFit hex={hex}/>
        </> 
      })}
    </>
  }

  function renderEraserDisplay() {
    const layer = layers[getLayerIdFromEraserId(brushId)]
    if(!layer) return null
    return <><div className="HoverPreview__display">
        <div className="HoverPreview__display-item">
          <Icon icon="faEraser"/>
        </div>
        {renderPrimaryTitle(layer.name)}
      </div>
    </>
  }

  function renderGameTitleDisplay() {
    const imageBackground = metadata.imageUrl;

    if(isHoveringOverPreview) {
     return  <div className="HoverPreview__title">
        <div className="HoverPreview__actions">
          <Unlockable interfaceId={GAME_OPEN_EDIT_IID}>
            <Button size="xs" startIcon={<Icon icon="faGamepad"/>} onClick={() => {
              openGameEditDialog()
            }}>Edit Game</Button>
          </Unlockable>
          <Unlockable interfaceId={RELATION_SYSTEM_OPEN_EDIT_IID}>
            <Button startIcon={<Icon icon="faLink"/>} size="xs" onClick={() => {
              openEditRelationSystemDialog()
            }}>Edit Relationships</Button>
          </Unlockable>
          <Unlockable interfaceId={CONTENT_OPEN_EDIT_IID}>
            <Button startIcon={<Icon icon="faIcons"/>} size="xs" onClick={() => {
              openEditContentDialog()
            }}>Edit Content</Button>
          </Unlockable>
          <Unlockable interfaceId={STAGE_OPEN_EDIT_IID}>
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

}}>
      <Paper elevation={10} sx={{padding: '1em'}}>
        <Typography font="2P" variant="subtitle2">
          {metadata.title}
        </Typography>
        <Typography variant="subtitle2">
         {'by ' + (metadata.authorPseudonym ? metadata.authorPseudonym : gameModel.owner?.username)}
        </Typography>
      </Paper>
      {(gameRoomInstance.gameStatus === PAUSED_STATE) && renderPrimaryTitle('(Paused)')}
      {currentStageId === initialStageId ? null : <>
        <Typography font="2P" variant="subtitle2" sx={{fontSize: '0.5em'}} >{currentStage.name}</Typography>
      </>}
    </div>
   </>
  }

  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  ///////////------------------///////////
  //// DISPLAY CONTAINER
  function renderBody() {
    if(interfaceData?.previewText) {
      return <div className="HoverPreview__title">
        <Typography font="2P" variant="subtitle2">{interfaceData.previewText}</Typography>
      </div>
    }

    if(isBoundaryEditorOpen) {
      return <>
        {renderTextOnlyDisplay({
          icon: 'faMap',
          title: 'Editing Boundaries',
          subtitle: 'Click squares on the map to allow movement into that area',
        })}
      </>
    } 
    
    if(isSnapshotTakerOpen) {
      return <>
        {renderTextOnlyDisplay({
          icon: 'faCameraRetro',
          title: 'Taking Snapshot',
          subtitle: 'Draw a square on the map for where you want to take a photo',
        })}
      </>
    }

    // hovering 
    if(relationTagIdHovering) {
      const relationTag = relationTags[relationTagIdHovering]
      return renderDisplayWithTexture({
        title: relationTag.name,
        textureTint: relationTag.textureTint,
        textureId: relationTag.textureId,
      })
    } else if(effectId) {
      const effect = effects[effectId]
      const {
        title,
        subTitle
      } = enrichEffectData(effect, null, gameModel)

      return renderTextOnlyDisplay({
        title: title || subTitle
      })
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
      style={{height: gameEditorHeight ? gameEditorHeight * 0.2 : 0}}
      onMouseEnter={() => {
        setIsHoveringOverPreview(true)
        setTimeout(() => {
          setIsHoveringOverPreview(false)
        }, 3000)
      }} 
      onMouseLeave={() => {
        setIsHoveringOverPreview(false)
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

export default connect(mapStateToProps, { openEditContentDialog, openEditEntityGraphics, openEntityBehaviorLiveEditor, openEditRelationSystemDialog, openStageLiveEditor, openEffectPromptDialog, openGameEditDialog, openEditEntityDialog, openStageLiveEditor, openSnapshotTaker, changeSelectorList })(HoverPreview);
