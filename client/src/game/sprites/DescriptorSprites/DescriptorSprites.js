/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './DescriptorSprites.scss';
import Sprite from '../../sprites/Sprite/Sprite';

const DescriptorSprites = ({
  descriptors,
  spritesByDescriptor,
  onClickSprite
}) => {

  const sprites = descriptors.reduce((prev, descriptor) => {
    if(spritesByDescriptor[descriptor]) prev.push(...spritesByDescriptor[descriptor])

    return prev
  }, [])

  return <div className="DescriptorSprites">
    {sprites.map((sprite) => {
      return <Sprite onClick={onClickSprite} key={sprite.textureId} textureId={sprite.textureId}/>
    })}
  </div>
};

const mapStateToProps = (state) => ({
  spritesByDescriptor: state.gameModel.spritesByDescriptor
});

export default compose(
  connect(mapStateToProps, {  }),
)(DescriptorSprites);
