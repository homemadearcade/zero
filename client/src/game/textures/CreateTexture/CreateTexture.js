/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CreateTexture.scss';
import FormLabel from '../../../ui/FormLabel/FormLabel';
import DescriptorTextures from '../DescriptorTextures/DescriptorTextures';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CreateColorFlow from '../../color/CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/game/gameModelActions';
import Texture from '../Texture/Texture';
import Button from '../../../ui/Button/Button';
import CanvasImageDialog from '../CanvasImageDialog/CanvasImageDialog';
import { NON_LAYER_COLOR_ID } from '../../constants';
import GameTextures from '../GameTextures/GameTextures';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import Icon from '../../../ui/Icon/Icon';
import { CHOOSE_TEXTURES_IID, TEXTURE_EDITOR_OPEN_IID } from '../../../constants/interfaceIds';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import TextureStage from '../TextureStage/TextureStage';
import { openCreateCanvasImageDialog, openCreateColorFlow } from '../../../store/actions/game/gameFormEditorActions';

const CreateTexture = ({
  textureIdSelected,
  textureTintSelected,
  formLabel,
  visualTags,
  onSelect,
  onSelectTint,
  onClearTint,
  openCreateColorFlow,
  editGameModel,
  gameModel: { gameModel : { colors }},
  openCreateCanvasImageDialog,
  gameFormEditor: { isCreateColorFlowOpen, isCanvasImageDialogOpen }
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
      </TextureStage></div>

      { !isCanvasImageDialogOpen && <Unlockable interfaceId={TEXTURE_EDITOR_OPEN_IID}>
        <Button onClick={() => {
          openCreateCanvasImageDialog(textureIdSelected)
        }}>
          Draw New Texture
        </Button>
      </Unlockable>}
      <AggregateColorSelect
        selectedColor={textureTintSelected} 
        onSelectColor={onSelectTint} 
        onUnselectColor={onClearTint}
        onAddColor={() => {
          openCreateColorFlow('CreateTexture')
        }}
      />
      <Unlockable interfaceId={CHOOSE_TEXTURES_IID}>
        <div className="CreateTexture__texture-list">
          <DescriptorTextures onClickTexture={onSelect} visualTags={visualTags}/>
          <GameTextures onClickTexture={onSelect} visualTags={visualTags}/>
        </div>
      </Unlockable>
    </div>

    {isCreateColorFlowOpen === 'CreateTexture' && <CreateColorFlow
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
    {isCanvasImageDialogOpen && <CanvasImageDialog textureTintSelected={textureTintSelected} onSaveCanvasImage={onSelect} />}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameFormEditor: state.gameFormEditor,
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, editGameModel, openCreateCanvasImageDialog  }),
)(CreateTexture);
