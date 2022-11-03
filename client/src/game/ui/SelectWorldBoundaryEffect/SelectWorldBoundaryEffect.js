/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectWorldBoundaryEffect.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { } from '../../defaultData/relationship';
import { getWorldBoundaryRelationLabel, worldBoundaryRelationsDisplayNames } from '../../defaultData/world';

const SelectWorldBoundaryEffect = ({ classId, onChange, value, formLabel, disabled, game: { gameModel } }) => {
  const objectClass = gameModel.classes[classId]


  const mapEffectsToOption = (relation) => {
    return {
      label: getWorldBoundaryRelationLabel(relation, objectClass),
      value: relation
    }
  }

  const options = Object.keys(worldBoundaryRelationsDisplayNames).map(mapEffectsToOption)

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => ({
  game: state.game
});

export default compose(
  connect(mapStateToProps, { }),
)(SelectWorldBoundaryEffect);
