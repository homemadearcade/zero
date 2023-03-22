/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './DescriptorTextures.scss';
import Texture from '../../images/Texture/Texture';

const DescriptorTextures = ({
  visualTags,
  spritesByDescriptor,
  onClickTexture
}) => {

  const sprites = visualTags.reduce((prev, visualTag) => {
    if(spritesByDescriptor[visualTag]) prev.push(...spritesByDescriptor[visualTag])

    return prev
  }, [])

  return <div className="DescriptorTextures">
    {sprites.map((sprite) => {
      return <Texture onClick={onClickTexture} textureId={sprite.textureId}/>
    })}
  </div>
};

const mapStateToProps = (state) => ({
  spritesByDescriptor: state.gameModel.spritesByDescriptor
});

export default compose(
  connect(mapStateToProps, {  }),
)(DescriptorTextures);
