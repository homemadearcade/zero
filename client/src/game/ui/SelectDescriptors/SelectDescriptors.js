/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectDescriptors.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { shuffleArray } from '../../../utils/arrayUtils';

const SelectDescriptors = ({ onChange, value, formLabel, descriptorOptions}) => {

  const options = shuffleArray(descriptorOptions)

  // options.unshift({
  //   label: value,
  //   value
  // })


  return <SelectChipsAuto 
    onChange={onChange}
    formLabel={formLabel}
    value={value}
    freeSolo
    options={options}
  />
}

const mapStateToProps = (state) => {
  return {
    descriptorOptions: state.gameModel.descriptorOptions,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectDescriptors);
