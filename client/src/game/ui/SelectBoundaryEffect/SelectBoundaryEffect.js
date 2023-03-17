/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectBoundaryEffect.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { } from '../../constants';
import { getBoundaryRelationLabel, boundaryRelationsDisplayNames } from '../../constants';

const SelectBoundaryEffect = ({ classId, onChange, value, formLabel, disabled, gameModel: { gameModel } }) => {
  const objectClass = gameModel.classes[classId]

  const mapEffectsToOption = (relation) => {
    return {
      label: boundaryRelationsDisplayNames[relation],
      value: relation
    }
  }

  const options = Object.keys(boundaryRelationsDisplayNames).map(mapEffectsToOption)

  return <SelectChipsAuto 
    disabled={disabled}
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    options={options}
  />
}

const mapStateToProps = (state) => ({
  gameModel: state.gameModel,
});

export default compose(
  connect(mapStateToProps, { }),
)(SelectBoundaryEffect);
