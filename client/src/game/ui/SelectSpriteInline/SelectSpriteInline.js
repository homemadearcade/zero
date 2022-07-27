/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectSpriteInline.scss';
import FormLabel from '../../../app/ui/FormLabel/FormLabel';
import DescriptorSprites from '../DescriptorSprites/DescriptorSprites';
import Sprite from '../Sprite/Sprite';
import { mapCobrowsingState } from '../../../utils/cobrowsing';
import CreateColorFlow from '../../CreateColorFlow/CreateColorFlow';
import { editGameModel } from '../../../store/actions/gameActions';
import ColorSelect from '../ColorSelect/ColorSelect';
import { openCreateColorFlow } from '../../../store/actions/editorFormsActions';
import CanvasSprite from '../CanvasSprite/CanvasSprite';

const SelectSpriteInline = ({
  textureIdSelected,
  tintSelected,
  formLabel,
  descriptors,
  onSelect,
  onSelectTint,
  openCreateColorFlow,
  editGameModel,
  game: { gameModel : { colors }},
  editorForms: { isCreateColorFlowOpen }
}) => {
  return <>
    <div className="SelectSpriteInline">
      {formLabel && <FormLabel>
        {formLabel}
      </FormLabel>}

      {!textureIdSelected && !tintSelected && 
        <div className="SelectSpriteInline__sprite-missing SelectSpriteInline__sprite"></div>
      }

      <div className="SelectSpriteInline__sprite">
        <CanvasSprite tint={tintSelected} textureId={textureIdSelected} width={150} height={150}/>
      </div>

      <div className="SelectSpriteInline__sprite-list">
        <DescriptorSprites onClickSprite={onSelect} descriptors={descriptors}/>
      </div>

      <ColorSelect selectedColorHex={tintSelected} colors={Object.keys(colors)} onSelectColor={onSelectTint} onAddColor={openCreateColorFlow}/>
    </div>

    {isCreateColorFlowOpen && <CreateColorFlow
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
