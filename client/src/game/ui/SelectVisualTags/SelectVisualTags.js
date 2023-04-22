/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectVisualTags.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { shuffleArray } from '../../../utils/arrayUtils';

const SelectVisualTags = ({ onChange, value, formLabel, visualTagOptions}) => {
  const [options, setOptions] = useState()

  useEffect(() => {
    setOptions(shuffleArray(visualTagOptions))
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
    visualTagOptions: state.gameModel.visualTagOptions,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectVisualTags);
