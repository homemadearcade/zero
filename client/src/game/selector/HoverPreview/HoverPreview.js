import React, { useState } from 'react';
import { connect } from 'react-redux';
import './HoverPreview.scss'
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import Typography from '../../../ui/Typography/Typography';
import Sprite from '../../images/Texture/Texture';
import { getLayerIdFromColorId, getLayerIdFromEraserId, getHexFromColorId, isBrushIdColor, isBrushIdEraser } from '../../../utils/editorUtils';
import { effectBehaviorToDisplayNames, layerToDisplayName, PAUSED_STATE, SELECTOR_ABSTRACT_LIST, SELECTOR_MAP_LIST} from '../../constants';
import Icon from '../../../ui/Icon/Icon';
import ColorNameFit from '../../color/ColorNameFit/ColorNameFit';
import { interfaceIdData } from '../../../constants/interfaceIdData';
import { classTypeToDisplayName } from '../../constants';
import { initialStageId } from '../../constants';
import { changeSelectorList, openGameMetadataModal, openSelectStageColorModal } from '../../../store/actions/gameSelectorActions';
import Button from '../../../ui/Button/Button';
import { openEditClassModal } from '../../../store/actions/gameFormEditorActions';
import Unlockable from '../../cobrowsing/Unlockable/Unlockable';
import { CHANGE_SELECTOR_TAB_IID, GAME_METADATA_IID, GAME_SNAPSHOT_IID, HOVER_PREVIEW_IID, STAGE_COLOR_IID } from '../../../constants/interfaceIds';
import { openSnapshotTaker } from '../../../store/actions/gameViewEditorActions';
import { useWishTheme } from '../../../hooks/useWishTheme';
import IconButton from '../../../ui/IconButton/IconButton';
import useGameEditorSize from '../../../hooks/useGameEditorSize';

const HoverPreview = ({ 
  cobrowsing: {
    mouseOverInterfaceId
  },
  hoverPreview: { 
    brushIdHovering, 
    entityClassIdHovering,
    entityInstanceIdHovering,
    instanceClassIdHovering,
    instanceDataHovering,
    effectIdHovering,
    relationIdHovering,
    relationTagIdHovering
  },
  gameSelector: {
    brushIdSelectedBrushList,
    entityClassIdSelectedClassList,
    currentSelectorList,
  },
  gameModel: { 
    currentStageId,
    gameModel: { 
      metadata,
      entityClasses,
      brushes,
      stages,
      effects,
      relations,
      relationTags
    }
  },
  gameRoom: {
    gameRoom
  },
  openGameMetadataModal,
  openEditClassModal,
  openSelectStageColorModal,
  openSnapshotTaker,
  changeSelectorList,
}) => {
  const [isHoveringOverTitle, setIsHoveringOverTitle] = useState(false)
  const theme = useWishTheme()
  let entityClass

  const entityClassId = instanceClassIdHovering || entityClassIdHovering || entityClassIdSelectedClassList 
  if(entityClassId) {
    entityClass = entityClasses[entityClassId]
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
    return <Button size="xs" className="HoverPreview__editable" onClick={() => {
      onEdit()
    }}><Icon icon="faPen"></Icon></Button>
  }

  function renderDisplayTitle(title, onEdit) {
    return <>
      <Typography 
        variant="div" 
        sx={{fontSize:'.8em'}}
        font="2P">
        {title}
        {onEdit && isHoveringOverTitle && renderEditableIcon(onEdit)}
      </Typography>
    </>
  }

  function renderTextOnlyDisplay({title, subtitle, onEdit}) {
      return <div className="HoverPreview__title">
        {renderDisplayTitle(title, onEdit)}
        <Typography 
          variant="div" 
          sx={{fontSize:'.4em'}}
        >
          {subtitle}
        </Typography>
      </div>
  }

  function renderDisplayWithTexture({textureTint, textureId, title, spriteOverlay, onEdit}) {
    return <>
      <div className="HoverPreview__display">
        <div className="HoverPreview__display-item">
          <Sprite textureTint={textureTint} textureId={textureId}>
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
    let title = entityClass.name + ' - ' + classTypeToDisplayName[entityClass.classInterfaceCategory]
    if(instanceDataHovering?.isSpawned) title += ' (Spawned)'
    return renderDisplayWithTexture({
      textureTint: entityClass.graphics.textureTint,
      textureId: entityClass.graphics.textureId,
      title,
      onEdit: () => {
        openEditClassModal(entityClass)
      }
    })
  }

  function renderBrushDisplay() {
    return renderDisplayWithTexture({
      textureTint: brushClass.textureTint,
      textureId: brushClass.textureId,
      title: layerToDisplayName[brushClass.layerId]
    })
  }

  function renderColorDisplay() {
    const layerName = layerToDisplayName[getLayerIdFromColorId(brushId)]
    return renderDisplayWithTexture({
      textureTint: hex,
      spriteOverlay: <ColorNameFit hex={hex}/>,
      title:<>
        {layerName && <>
          <br/>{layerName}
        </>}
      </> 
    })
  }

  function renderEraserDisplay() {
    const layerName = layerToDisplayName[getLayerIdFromEraserId(brushId)]
    return <><div className="HoverPreview__display">
        <div className="HoverPreview__display-item">
          <Icon icon="faEraser"/>
        </div>
        {renderDisplayTitle(layerName)}
      </div>
    </>
  }

  function renderGameTitleDisplay() {
    const currentStage = stages[currentStageId]
    const imageBackground = metadata.imageUrl;

    // <Unlockable interfaceId={CONTEXT_MENU_SNAPSHOT_IID}>
    //   <MenuItem onClick={() => {
    //     openSnapshotTaker()
    //     onMenuItemClick()
    //   }}>Take Snapshot</MenuItem>
    // </Unlockable>
   return  <>
    {metadata.imageUrl && <div className="HoverPreview__image-background" style={{backgroundImage: imageBackground ? `url("${imageBackground}"` : ''}}></div>}
    <div className="HoverPreview__title" onClick={() => {
      // if(currentSelectorList === SELECTOR_MAP_LIST) changeSelectorList(SELECTOR_ABSTRACT_LIST)
    }}>
      <Typography font="2P" variant="subtitle2">
        {metadata.title}
       </Typography>
       {currentSelectorList !== SELECTOR_MAP_LIST && <div className="HoverPreview__close">
        <IconButton icon="faClose" onClick={() => {
          changeSelectorList(SELECTOR_MAP_LIST)
        }}></IconButton>
      </div>}
      {(gameRoom.gameState === PAUSED_STATE) && renderDisplayTitle('(Paused)')}
      {isHoveringOverTitle && 
        <div className="HoverPreview__actions">
          <Unlockable interfaceId={GAME_SNAPSHOT_IID}>
            <Button size="xs" onClick={() => {
              openSnapshotTaker()
            }}><Icon icon="faCameraRetro"/></Button>
          </Unlockable>
          <Unlockable interfaceId={GAME_METADATA_IID}>{renderEditableIcon(() => {
            openGameMetadataModal()
          })}</Unlockable>
          {currentSelectorList === SELECTOR_MAP_LIST && <Unlockable interfaceId={CHANGE_SELECTOR_TAB_IID}>
            <Button size="xs" onClick={() => {
              changeSelectorList(SELECTOR_ABSTRACT_LIST)
            }}><Icon icon="faTableList"/></Button>
          </Unlockable>}
      </div>}
      {currentStageId === initialStageId ? null : <>
        <Typography font="2P" variant="subtitle2" sx={{fontSize: '0.5em'}} >{currentStage.name}</Typography>
      </>}
      {isHoveringOverTitle && <div className="HoverPreview__actions">
        <Unlockable interfaceId={STAGE_COLOR_IID}>
          <Button size="xs" className="HoverPreview__actions-color" onClick={() => {
            openSelectStageColorModal()
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
        title: effectBehaviorToDisplayNames[effect.effectBehavior]
      })
    } else if(instanceClassIdHovering) {
      return renderClassDisplay()
    } else if(entityClassIdHovering) {
      return renderClassDisplay()
    } else if(brushIdHovering) {
      if(hex) return renderColorDisplay()
      return renderBrushDisplay()
    }
    
    // selected
    if(entityClassIdSelectedClassList) {
      return renderClassDisplay()
    } else if(brushIdSelectedBrushList) {
      if(isEraser) return renderEraserDisplay()
      if(hex) return renderColorDisplay()
      return renderBrushDisplay()
    }


    return renderGameTitleDisplay()
  }

    const { gameEditorHeight } = useGameEditorSize()

  return <Unlockable interfaceId={HOVER_PREVIEW_IID}>
    <div className="HoverPreview"
      style={{backgroundColor: '#222', color: 'white', height: gameEditorHeight * 0.2}}
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
  gameRoom: state.gameRoom
})

export default connect(mapStateToProps, { openGameMetadataModal, openEditClassModal, openSelectStageColorModal, openSnapshotTaker, changeSelectorList })(HoverPreview);
