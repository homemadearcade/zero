/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './CreateTexture.scss';
import FormLabel from '../../../ui/FormLabel/FormLabel';
import DescriptorTextures from '../DescriptorTextures/DescriptorTextures';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CreateColorFlow from '../../color/CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/gameModelActions';
import { openCreateColorFlow } from '../../../store/actions/gameFormEditorActions';
import Texture from '../Texture/Texture';
import Button from '../../../ui/Button/Button';
import CanvasImageModal from '../CanvasImageModal/CanvasImageModal';
import { openCanvasImageModal } from '../../../store/actions/gameSelectorActions';
import { NON_LAYER_COLOR_ID } from '../../constants';
import MyImages from '../MyImages/MyImages';
import Unlockable from '../../../game/cobrowsing/Unlockable/Unlockable';
import Icon from '../../../ui/Icon/Icon';
import { CHOOSE_TEXTURES_IID, DRAW_NEW_TEXTURE_IID } from '../../../constants/interfaceIds';
import AggregateColorSelect from '../../color/AggregateColorSelect/AggregateColorSelect';
import TextureStage from '../TextureStage/TextureStage';

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
  gameSelector: { isCanvasImageModalOpen },
  openCanvasImageModal,
  gameFormEditor: { isCreateColorFlowOpen }
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

      <Unlockable interfaceId={DRAW_NEW_TEXTURE_IID}>
        { !isCanvasImageModalOpen && <Button onClick={() => {
          openCanvasImageModal(textureIdSelected)
        }}>
          Draw New Texture
        </Button>}
      </Unlockable>
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
          <MyImages onClickTexture={onSelect} visualTags={visualTags}/>
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
    {isCanvasImageModalOpen && <CanvasImageModal textureTintSelected={textureTintSelected} onSaveCanvasImage={onSelect} />}
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameModel: state.gameModel,
  gameSelector: state.gameSelector,
  gameFormEditor: state.gameFormEditor,
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, editGameModel, openCanvasImageModal  }),
)(CreateTexture);
