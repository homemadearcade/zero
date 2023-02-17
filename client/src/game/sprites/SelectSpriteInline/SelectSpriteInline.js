/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectSpriteInline.scss';
import FormLabel from '../../../ui/FormLabel/FormLabel';
import DescriptorSprites from '../DescriptorSprites/DescriptorSprites';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CreateColorFlow from '../../color/CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/gameModelActions';
import ColorSelect from '../../color/ColorSelect/ColorSelect';
import { openCreateColorFlow } from '../../../store/actions/gameFormEditorActions';
import Sprite from '../Sprite/Sprite';
import Button from '../../../ui/Button/Button';
import SpriteEditor from '../SpriteEditor/SpriteEditor';
import { openSpriteEditor } from '../../../store/actions/gameSelectorActions';
import { NON_LAYER_COLOR_ID, SPRITE_EDITOR_CANVAS_ID } from '../../constants';
import MySprites from '../MySprites/MySprites';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import Icon from '../../../ui/Icon/Icon';
import { CHOOSE_SPRITES_IID, DRAW_NEW_SPRITE_IID } from '../../../constants/interfaceIds';
import { sortColorByLastSelectedDate } from '../../../utils/editorUtils';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';

const SelectSpriteInline = ({
  textureIdSelected,
  tintSelected,
  formLabel,
  descriptors,
  onSelect,
  onSelectTint,
  onClearTint,
  openCreateColorFlow,
  editGameModel,
  gameModel: { gameModel : { colors }},
  gameSelector: { isSpriteEditorOpen },
  openSpriteEditor,
  gameFormEditor: { isCreateColorFlowOpen }
}) => {
  function renderSpriteStage() {

    if(!textureIdSelected && !tintSelected) {
      return <div className="SelectSpriteInline__sprite-missing SelectSpriteInline__sprite"></div>
    }

    return <div className="SelectSpriteInline__sprite">
      <Sprite tint={tintSelected} textureId={textureIdSelected}/>
     {textureIdSelected && <div className="SelectSpriteInline__no-sprite" onClick={() => {
        onSelect(null)
      }}>
        <Icon size="lg" icon="faClose"></Icon>
      </div>}
    </div>
  }

  return <>
    <div className="SelectSpriteInline">
      {formLabel && <FormLabel>
        {formLabel}
      </FormLabel>}

      {renderSpriteStage()}

      <Unlockable interfaceId={DRAW_NEW_SPRITE_IID}><Button onClick={() => {
        openSpriteEditor(textureIdSelected)
      }}>
        Draw New Sprite
      </Button></Unlockable>
      <AggregateColorSelect
        selectedColorHex={tintSelected} 
        onSelectColor={onSelectTint} 
        onClearColor={onClearTint}
        onAddColor={() => {
          openCreateColorFlow('SelectSpriteInline')
        }}
      />
      <Unlockable interfaceId={CHOOSE_SPRITES_IID}>
        <div className="SelectSpriteInline__sprite-list">
          <DescriptorSprites onClickSprite={onSelect} descriptors={descriptors}/>
          <MySprites onClickSprite={onSelect} descriptors={descriptors}/>
        </div>
      </Unlockable>
    </div>

    {isCreateColorFlowOpen === 'SelectSpriteInline' && <CreateColorFlow
      onComplete={(color) => {
        editGameModel({
          colors: {
            [color.hex]: {
              [NON_LAYER_COLOR_ID]: Date.now()
            }
          }
        })
      }}
    />}
    {isSpriteEditorOpen && <SpriteEditor tintSelected={tintSelected} onSaveSprite={onSelect} />}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
  gameFormEditor: state.gameFormEditor,
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, editGameModel, openSpriteEditor  }),
)(SelectSpriteInline);
