/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectSpriteInline.scss';
import FormLabel from '../../../app/ui/FormLabel/FormLabel';
import DescriptorSprites from '../DescriptorSprites/DescriptorSprites';
import Sprite from '../Sprite/Sprite';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import CreateColorFlow from '../../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/gameActions';
import ColorSelect from '../ColorSelect/ColorSelect';
import { openCreateColorFlow } from '../../../store/actions/editorFormsActions';
import CanvasSprite from '../Sprite/Sprite';

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
  editorForms: { isCreateColorFlowOpen }
}) => {
  function renderSpriteStage() {

    if(!textureIdSelected && !tintSelected) {
      return <div className="SelectSpriteInline__sprite-missing SelectSpriteInline__sprite"></div>
    }

    return <div className="SelectSpriteInline__sprite">
      <CanvasSprite tint={tintSelected} textureId={textureIdSelected}/>
    </div>
  }

  return <>
    <div className="SelectSpriteInline">
      {formLabel && <FormLabel>
        {formLabel}
      </FormLabel>}

      {renderSpriteStage()}
      <ColorSelect 
        selectedColorHex={tintSelected} 
        colors={Object.keys(colors)} 
        onSelectColor={onSelectTint} 
        onUnselectColor={onClearTint}
        onAddColor={() => {
          openCreateColorFlow('SelectSpriteInline')
        }}
      />
      <div className="SelectSpriteInline__sprite-list">
        <DescriptorSprites onClickSprite={onSelect} descriptors={descriptors}/>
      </div>
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
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
  editorForms: state.editorForms,
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, editGameModel  }),
)(SelectSpriteInline);
