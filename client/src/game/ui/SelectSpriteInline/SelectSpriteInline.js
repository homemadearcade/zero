/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectSpriteInline.scss';
import FormLabel from '../../../app/ui/FormLabel/FormLabel';
import DescriptorSprites from '../DescriptorSprites/DescriptorSprites';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
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
        onAddColor={async () => {
          const color = await openCreateColorFlow()
          editGameModel({
            colors: {
              [color.hex]: {
                ['common']: true
              }
            }
          })
        }}
      />
      <div className="SelectSpriteInline__sprite-list">
        <DescriptorSprites onClickSprite={onSelect} descriptors={descriptors}/>
      </div>
    </div>
  </>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {
  game: state.game,
});

export default compose(
  connect(mapStateToProps, { openCreateColorFlow, editGameModel  }),
)(SelectSpriteInline);
