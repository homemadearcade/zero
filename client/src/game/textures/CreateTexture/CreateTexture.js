/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CreateTexture.scss';
import FormLabel from '../../../ui/FormLabel/FormLabel';
import TaggedTextures from '../TaggedTextures/TaggedTextures';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Button from '../../../ui/Button/Button';
import GameTextures from '../GameTextures/GameTextures';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import Icon from '../../../ui/Icon/Icon';
import { CHOOSE_GAME_TEXTURES_IID, CHOOSE_SYSTEM_TEXTURES_IID, TEXTURE_EDITOR_OPEN_IID, TEXTURES_TAGGED_TAB_IID, TEXTURES_USER_TAB_IID } from '../../../constants/interfaceIds';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import TextureStage from '../TextureStage/TextureStage';
import { openCreateCanvasImageDialog, openCreateColorFlow } from '../../../store/actions/game/gameFormEditorActions';
import Tabs from '../../../ui/Tabs/Tabs';

const CreateTexture = ({
  textureIdSelected,
  textureTintSelected,
  formLabel,
  visualTags,
  onSelect,
  onSelectTint,
  onClearTint,
  openCreateCanvasImageDialog,
  gameFormEditor: { isCanvasImageDialogOpen, entityModel }
}) => {
  return <>
    <div className="CreateTexture">
      {formLabel && <FormLabel>
        {formLabel}
      </FormLabel>}

      <div className="CreateTexture__stage"><TextureStage textureId={textureIdSelected} textureTint={textureTintSelected}>
        {textureIdSelected && <div className="CreateTexture__no-sprite" onClick={() => {
          onSelect(null)
        }}>
          <Icon size="lg" icon="faClose"></Icon>
        </div>}
        </TextureStage>
      </div>

      {!isCanvasImageDialogOpen && <Unlockable interfaceId={TEXTURE_EDITOR_OPEN_IID}>
        <Button onClick={() => {
          openCreateCanvasImageDialog(entityModel.entityModelId, textureIdSelected, textureTintSelected)
        }}>
          Draw New Sprite
        </Button>
      </Unlockable>}
      <FormLabel>
        {entityModel.graphics.textureId ? 'Tint' : 'Color'}
      </FormLabel>
      <AggregateColorSelect
        selectedColor={textureTintSelected} 
        onSelectColor={onSelectTint} 
        onUnselectColor={onClearTint}
      />
        <div className="CreateTexture__texture-list">
           <Tabs tabs={[
            {
              interfaceId: TEXTURES_TAGGED_TAB_IID,
              label: 'Recommended',
              body: <TaggedTextures 
                  onClickTexture={onSelect}
                  visualTags={visualTags}
                />
            },
            {
              interfaceId: TEXTURES_USER_TAB_IID,
              label: 'My Sprites',
              body: <GameTextures 
                onClickTexture={onSelect}
                visualTags={visualTags}
              />
            }
           ]}/>
        </div>
    </div>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
});

export default compose(
  connect(mapStateToProps, { editGameModel, openCreateCanvasImageDialog  }),
)(CreateTexture);
