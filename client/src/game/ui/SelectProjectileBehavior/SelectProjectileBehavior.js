/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectProjectileBehavior.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { PROJECTILE_DOWN, PROJECTILE_UP, PROJECTILE_LEFT, PROJECTILE_RIGHT, PROJECTILE_RANDOM_DIRECTION, PROJECTILE_TARGET_ENTITY_MODEL, PROJECTILE_TARGET_PLAYER, PROJECTILE_NONE, PROJECTILE_RANDOM_ANGLE } from '../../constants';
// import { defaultProjectile } from '../../constants';

// const projectileValues = {
//   [PROJECTILE_DOWN]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, projectileBehavior: PROJECTILE_DOWN } },
//   [PROJECTILE_UP]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, projectileBehavior: PROJECTILE_UP } },
//   [PROJECTILE_LEFT]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, projectileBehavior: PROJECTILE_LEFT } },
//   [PROJECTILE_RIGHT]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, projectileBehavior: PROJECTILE_RIGHT } },
//   [PROJECTILE_RANDOM_DIRECTION]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, projectileBehavior: PROJECTILE_RANDOM_DIRECTION } },
//   [PROJECTILE_TARGET_ENTITY_MODEL]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, projectileBehavior: PROJECTILE_TARGET_ENTITY_MODEL } },
//   [PROJECTILE_TARGET_PLAYER]: {...defaultProjectile, projectile: { ...defaultProjectile.projectile, projectileBehavior: PROJECTILE_TARGET_PLAYER } },
//   [PROJECTILE_NONE]: {...defaultProjectile },
// }

const projectileValueToLabel = {
  [PROJECTILE_DOWN]: 'Eject Down',
  [PROJECTILE_UP]: 'Eject Up',
  [PROJECTILE_LEFT]: 'Eject Left',
  [PROJECTILE_RIGHT]: 'Eject Right',
  [PROJECTILE_RANDOM_DIRECTION]: 'Eject Random Direction',
  [PROJECTILE_RANDOM_ANGLE]: 'Eject Random Angle',
  [PROJECTILE_TARGET_ENTITY_MODEL]: 'Eject at Entity',
  [PROJECTILE_TARGET_PLAYER]: 'Eject at Player',
  [PROJECTILE_NONE]: 'Does not eject'
}

const SelectProjectileBehavior = ({ onChange, value, formLabel }) => {
  const mapControlsToOption = (projectileBehavior) => {
    return {
      title: projectileValueToLabel[projectileBehavior],
      value: projectileBehavior
    }
  }

  const options = Object.keys(projectileValueToLabel).map(mapControlsToOption)

  return <SelectChipsAuto 
    onChange={(event, visualTags) => {
      onChange(event, visualTags.map((projectileBehavior) => {
        return projectileBehavior
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
)(SelectProjectileBehavior);
