/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectSpriteInline.scss';
import FormLabel from '../../../app/ui/FormLabel/FormLabel';
import DescriptorSprites from '../DescriptorSprites/DescriptorSprites';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CreateColorFlow from '../../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/gameActions';
import ColorSelect from '../ColorSelect/ColorSelect';
import { openCreateColorFlow } from '../../../store/actions/gameFormEditorActions';
import Sprite from '../Sprite/Sprite';
import Button from '../../../app/ui/Button/Button';
import SpriteEditor from '../../SpriteEditor/SpriteEditor';
import { openSpriteEditor } from '../../../store/actions/editorActions';
import { DEFAULT_CLEAR_TEXTURE_ID } from '../../../constants';
import MySprites from '../MySprites/MySprites';
import Unlockable from '../../../app/cobrowsing/Unlockable/Unlockable';

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
  game: { gameModel : { colors }},
  editor: { spriteEditorTextureId },
  openSpriteEditor,
  gameFormEditor: { isCreateColorFlowOpen }
}) => {
  function renderSpriteStage() {

    if(!textureIdSelected && !tintSelected) {
      return <div className="SelectSpriteInline__sprite-missing SelectSpriteInline__sprite"></div>
    }

    return <div className="SelectSpriteInline__sprite">
      <Sprite tint={tintSelected} textureId={textureIdSelected}/>
    </div>
  }

  return <>
    <div className="SelectSpriteInline">
      {formLabel && <FormLabel>
        {formLabel}
      </FormLabel>}

      {renderSpriteStage()}

      <Unlockable interfaceId="drawNewSprite"><Button onClick={() => {
        openSpriteEditor(textureIdSelected || DEFAULT_CLEAR_TEXTURE_ID)
      }}>
        Draw New Sprite
      </Button></Unlockable>

      <ColorSelect
        maxColors={50}
        selectedColorHex={tintSelected} 
        colors={Object.keys(colors)} 
        onSelectColor={onSelectTint} 
        onUnselectColor={onClearTint}
        onAddColor={() => {
          openCreateColorFlow('SelectSpriteInline')
        }}
      />
      <Unlockable interfaceId="chooseSprites"><div className="SelectSpriteInline__sprite-list">
        <DescriptorSprites onClickSprite={onSelect} descriptors={descriptors}/>
        <MySprites onClickSprite={onSelect} descriptors={descriptors}/>
      </div></Unlockable>
    </div>

    {isCreateColorFlowOpen === 'SelectSpriteInline' && <CreateColorFlow
      onComplete={(color) => {
        editGameModel({
          colors: {
            [color.hex]: {
              ['common']: true
            }
          }
        })
      }}
    />}
    {spriteEditorTextureId && <SpriteEditor onSaveSprite={onSelect} />}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editor: state.editor,
  gameFormEditor: state.gameFormEditor,
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, editGameModel, openSpriteEditor  }),
)(SelectSpriteInline);
