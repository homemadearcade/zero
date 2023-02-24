/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectDescriptors.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { shuffleArray } from '../../../utils/arrayUtils';

const SelectDescriptors = ({ onChange, value, formLabel, descriptorOptions}) => {
  const [options, setOptions] = useState()

  useEffect(() => {
    setOptions(shuffleArray(descriptorOptions))
  }, [])

  if(!options) return

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
