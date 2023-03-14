/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectProjectileStyle.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { PROJECTILE_DOWN, PROJECTILE_UP, PROJECTILE_LEFT, PROJECTILE_RIGHT, PROJECTILE_RANDOM_DIRECTION, PROJECTILE_TARGET_CLASS, PROJECTILE_TARGET_PLAYER, PROJECTILE_NONE, PROJECTILE_RANDOM_ANGLE } from '../../constants';
// import { defaultProjectile } from '../../constants';

// const projectileValues = {
//   [PROJECTILE_DOWN]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, style: PROJECTILE_DOWN } },
//   [PROJECTILE_UP]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, style: PROJECTILE_UP } },
//   [PROJECTILE_LEFT]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, style: PROJECTILE_LEFT } },
//   [PROJECTILE_RIGHT]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, style: PROJECTILE_RIGHT } },
//   [PROJECTILE_RANDOM_DIRECTION]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, style: PROJECTILE_RANDOM_DIRECTION } },
//   [PROJECTILE_TARGET_CLASS]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, style: PROJECTILE_TARGET_CLASS } },
//   [PROJECTILE_TARGET_PLAYER]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, style: PROJECTILE_TARGET_PLAYER } },
//   [PROJECTILE_NONE]: {...defaultProjectile },
// }

const projectileValueToLabel = {
  [PROJECTILE_DOWN]: 'Eject Down',
  [PROJECTILE_UP]: 'Eject Up',
  [PROJECTILE_LEFT]: 'Eject Left',
  [PROJECTILE_RIGHT]: 'Eject Right',
  [PROJECTILE_RANDOM_DIRECTION]: 'Eject Random Direction',
  [PROJECTILE_RANDOM_ANGLE]: 'Eject Random Angle',
  [PROJECTILE_TARGET_CLASS]: 'Eject at Class',
  [PROJECTILE_TARGET_PLAYER]: 'Eject at Player',
  [PROJECTILE_NONE]: 'Does not eject'
}

const SelectProjectileStyle = ({ onChange, value, formLabel }) => {
  const mapControlsToOption = (projectile) => {
    return {
      label: projectileValueToLabel[projectile],
      value: projectile
    }
  }

  console.log(value)

  const options = Object.keys(projectileValueToLabel).map(mapControlsToOption)

  return <SelectChipsAuto 
    onChange={(event, descriptors) => {
      onChange(event, descriptors.map((pattern) => {
        return pattern
      }))
    }}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    // gameModel: state.gameModel.gameModel,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectProjectileStyle);
