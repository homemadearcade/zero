//mapping for every property on graphics to an object with a displayName, a description,   EditorInterfaceRules, SecurityRules, DataValidationRules, GamePlayRules,  NetworkingRules, and onUpdateRulesupdateRules
export const graphicsPropertys = {
  textureId: {
    displayName: 'Texture Id',
    description: 'The id of the texture to use for this class',
  },
  width: {
    displayName: 'Width',
    description: 'The width of this class',
  },
  height: {
    displayName: 'Height',
    description: 'The height of this class',
  },
  textureTint: {
    displayName: 'Texture Tint',
    description: 'The tint of the texture to use for this class',
  },
  invisible: {
    displayName: 'Invisible',
    description: 'Whether this class is invisible',
  },
  glowing: {
    displayName: 'Glowing',
    description: 'Whether this class is glowing',
  },
  layerId: {
    displayName: 'Layer Id',
    description: 'The id of the layer to use for this class',
  },
  depthModifier: {
    displayName: 'Depth Modifier',
    description: 'The depth modifier of this class',
  },
}
