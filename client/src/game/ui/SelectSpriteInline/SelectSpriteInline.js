/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './SelectSpriteInline.scss';
import { FormLabel } from '@mui/material';
import DescriptorSprites from '../DescriptorSprites/DescriptorSprites';
import Sprite from '../Sprite/Sprite';

const SelectSpriteInline = ({
  textureIdSelected,
  title,
  descriptors,
  onSelect
}) => {
  
  return <div className="SelectSpriteInline">
    {title && <FormLabel>{title}</FormLabel>}
    {!textureIdSelected && <div className="SelectSpriteInline__sprite-missing SelectSpriteInline__sprite"></div>}
    {textureIdSelected && <div className="SelectSpriteInline__sprite"><Sprite textureId={textureIdSelected} width={150} height={150}/></div>}
    <div className="SelectSpriteInline__sprite-list"><DescriptorSprites onClickSprite={onSelect} descriptors={descriptors}/></div>
  </div>
};

const mapStateToProps = (state) => ({

});

export default compose(
  connect(mapStateToProps, {  }),
)(SelectSpriteInline);
