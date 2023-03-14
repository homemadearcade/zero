/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectClassType.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { classTypeToDisplayName } from '../../constants';

const SelectClassType = ({ onChange, value, formLabel }) => {
  const mapClassTypeToOption = (classType) => {

    return {
      label: classTypeToDisplayName[classType],
      value: classType
    }
  }

  const options = Object.keys(classTypeToDisplayName).map(mapClassTypeToOption)

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
)(SelectClassType);
