/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectDescriptors.scss';
import SelectChipsAuto from '../../../app/ui/SelectChipsAuto/SelectChipsAuto';

const SelectDescriptors = ({ onChange, value, title, descriptorOptions}) => {
  return <SelectChipsAuto 
    onChange={(event, descriptors) => {
      onChange(event,  descriptors.map(({value}) => value) )
    }}
    title={title}
    value={value}
    options={descriptorOptions}
  />
}

const mapStateToProps = (state) => {
  return {
    descriptorOptions: state.game.descriptorOptions,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(SelectDescriptors);
