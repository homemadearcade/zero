/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './DescriptorSprites.scss';
import Sprite from '../Sprite/Sprite';

const DescriptorSprites = ({
  descriptors,
  spritesByDescriptor
}) => {

  const sprites = descriptors.reduce((prev, descriptor) => {
    if(spritesByDescriptor[descriptor]) prev.push(...spritesByDescriptor[descriptor])

    return prev
  }, [])

  return <div>
    {sprites.map((sprite) => {
      return <Sprite key={sprite.textureId} textureId={sprite.textureId} width={30} height={30}/>
    })}
  </div>
};

const mapStateToProps = (state) => ({
  spritesByDescriptor: state.game.spritesByDescriptor
});

export default compose(
  connect(mapStateToProps, {  }),
)(DescriptorSprites);
