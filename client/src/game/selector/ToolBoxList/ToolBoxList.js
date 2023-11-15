/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './ToolBoxList.scss';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CobrowsingAccordianList from '../../cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import { EFFECT_INTERFACE_ACTION, ON_STEP_BEGINS } from '../../constants';
import Typography from '../../../ui/Typography/Typography';
import { updateOpenInterfaceId } from '../../../store/actions/game/gameSelectorActions';
import Icon from '../../../ui/Icon/Icon';
import Texture from '../../textures/Texture/Texture';
import { getEffectData } from '../../../utils';
import ButtonMenu from '../../../ui/ButtonMenu/ButtonMenu';
import { MenuItem } from '@mui/material';
import { keyIdToInterfaceData } from '../../../constants/keyboard/keyIds';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Button from '../../../ui/Button/Button';

const ToolBoxList = ({
  updateOpenInterfaceId,
  onSelectTool,
  gameModel: { gameModel} ,
  gameRoomInstance: { gameRoomInstance: { currentStageId } },
  editGameModel
}) => {
  const [accordians, setAccordians] = useState()

  const effectList = Object.keys(gameModel.effects).map((effectId) => {
    return gameModel.effects[effectId]
  })

  const currentStage = gameModel.stages[currentStageId]
  const keyboardShortcuts = currentStage.keyboardShortcuts

  function renderBody(effectList) {
    return <div 
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {effectList.map((effectData, i) => {
        const {
          title,
          subTitle,
          icon,
          subIcon,
          textureId,
          textureTint
        } = effectData

        const keyboardShortcuts = gameModel.stages[currentStageId].keyboardShortcuts
        const setToShortcutKey = Object.keys(keyboardShortcuts).find((keyId) => {
          return keyboardShortcuts[keyId]?.effectId === effectData.effectId
        })

        return <div key={i} style={{
          display: 'flex',
          position: 'relative',
          flexDirection: 'column',
          alignItems: 'center',
          borderBottom: '1px solid #333',
          border: setToShortcutKey ? '1px solid #333' : 'none',
          padding: '1em 0em',
        }}>
            {setToShortcutKey && <Typography font="2P" sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              padding: '.2em',
              fontSize: '.5em',
              backgroundColor: '#333',
              color: '#aaa',
              zIndex: 1,
            }}>
              {keyIdToInterfaceData[setToShortcutKey]?.name}
            </Typography>}
            <div 
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
            <div 
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '.5em',
                border: '1px solid #333',
              }}
            >
              <Icon icon={icon} />
              {subIcon && <Icon icon={subIcon} />}
            </div>
            <Typography component="div" variant="subtitle1">{title}</Typography>
          </div>
          <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '.5em'
          }}>
            {(textureId || textureTint) && <div style={{
              width: '1em',
              height: '1em',
            }}>  
              <Texture textureId={textureId} textureTint={textureTint} />
            </div>}
            {subTitle && <Typography component="div" variant="subtitle2">{subTitle}</Typography>}
          </div>

          <ButtonMenu variant="outlined" text="Set To Shortcut" menu={(handleClose) => {
            return [Object.keys(keyIdToInterfaceData).map((keyId) => {
              const key = keyIdToInterfaceData[keyId]
              if(!key.isShortcutKey) return null
              
              
              return <MenuItem key={keyId} onClick={() => {
                handleClose()
                editGameModel({
                  stages: {
                    [currentStageId]: {
                      keyboardShortcuts: {
                        [keyId]: {
                          effectId: effectData.effectId
                        }
                      }
                    }
                  }
                })
              }}>
                {'Set to ' + key.name + ' key'}
              </MenuItem>

            })]
          }}/>
        </div>
      })}
    </div>
  }

  useEffect(() => {
    const accordians = []
    const renderAccordian = (effectList, effectGroupName) => {
            // matchingEffects.push(<Unlockable interfaceId={PLAYER_ENTITY_ADD_IID}>
      //   <Button size="fit" 
      //     onClick={() => {
      //       openEditEntityGraphics(addDefaultValuesToPlayerEntity({...defaultPlayerEntity}))
      //     }}>
      //     +
      //   </Button>
      // </Unlockable>)

      let icon = effectList[0]?.icon
      if(effectGroupName === 'Game') icon = 'faGamepad'

      accordians.push({
        interfaceId: effectGroupName,
        // interfaceId: PLAYER_ENTITY_CONTAINER_IID,
        // sx: layerInvisibility[PLAYER_ENTITY_IID] ? {opacity: hiddenOpacity} : {},
        title: <div style={{display: 'flex', alignItems: 'center', gap: '1em'}}>
          {icon && <Icon icon={icon} />}
          <Typography component="div" variant="subtitle1">{effectGroupName} {`(${effectList.length})`}</Typography>
        </div>,
        body: renderBody(effectList)
      })
    }

    const effectGroups = effectList.reduce((acc, effect) => {
      const { 
        title, 
        icon, 
        subTitle,
        group,
        isRemoved,
        subIcon, 
        textureId,
        textureTint
      } = getEffectData(effect, ON_STEP_BEGINS, gameModel)

      let wrongLayer = false
      if(effect.layerId) {
        const layer = gameModel.layers[effect.layerId]
        if(layer.stageId !== currentStageId) {
          wrongLayer = true
        }
      }

      if(!isRemoved && !wrongLayer) {
        if(!acc[group]) {   
          acc[group] = {
            list: []
          }
        }
        acc[group].list.push({
          title,
          icon,
          subTitle,
          subIcon,
          textureId,
          textureTint,
          effectId: effect.effectId,
          effectBehavior: effect.effectBehavior
        })
      }

      return acc
    }, {})

    Object.keys(effectGroups).forEach((effectGroupName) => {
      const effectList = effectGroups[effectGroupName].list
      renderAccordian(effectList, effectGroupName)
    })

    setAccordians(accordians.filter((accordian) => !!accordian))
  }, [keyboardShortcuts])

  if(!accordians) return null

  const commonlyUsedEffects = effectList.map((effect) => {
    const effectData = getEffectData(effect, ON_STEP_BEGINS, gameModel)
    effectData.effectId = effect.effectId
    effectData.effectBehavior = effect.effectBehavior
    if(!effectData.isCommonlyUsed || effectData.isRemoved) return null
    return effectData
  }).filter((effectData) => !!effectData)

  return <div className="ToolBoxList">
    {renderBody(commonlyUsedEffects)}
    <CobrowsingAccordianList
      interfaceGroupId="ToolBoxList"
      accordians={accordians}
    />
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameRoomInstance: state.gameRoomInstance,
})

export default compose(
  connect(mapStateToProps, { updateOpenInterfaceId, editGameModel }),
)(ToolBoxList);
