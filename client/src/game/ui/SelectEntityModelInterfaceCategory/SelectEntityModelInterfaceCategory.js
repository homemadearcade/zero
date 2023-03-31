/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEntityModelInterfaceCategory.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { entityModelTypeToDisplayName } from '../../constants';

const SelectEntityModelInterfaceCategory = ({ onChange, value, formLabel }) => {
  const mapEntityTypeToOption = (entityModelType) => {

    return {
      label: entityModelTypeToDisplayName[entityModelType],
      value: entityModelType
    }
  }

  const options = Object.keys(entityModelTypeToDisplayName).map(mapEntityTypeToOption)

  return <SelectChipsAuto 
    onChange={onChange}
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
)(SelectEntityModelInterfaceCategory);
