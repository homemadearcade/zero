/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './TaggedTextures.scss';
import Texture from '../Texture/Texture';

const TaggedTextures = ({
  visualTags,
  spritesByDescriptor,
  onClickTexture
}) => {

  const sprites = visualTags.reduce((prev, visualTag) => {
    if(spritesByDescriptor[visualTag]) prev.push(...spritesByDescriptor[visualTag])

    return prev
  }, [])

  return <div className="TaggedTextures">
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
)(TaggedTextures);
