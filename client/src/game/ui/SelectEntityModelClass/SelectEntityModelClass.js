/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './SelectEntityModelClass.scss';
import SelectChipsAuto from '../../../ui/SelectChipsAuto/SelectChipsAuto';
import { entityModelClassToDisplayName } from '../../constants';

const SelectEntityModelClass = ({ onChange, value, formLabel }) => {
  const mapEntityTypeToOption = (entityModelClass) => {

    return {
      title: entityModelClassToDisplayName[entityModelClass],
      value: entityModelClass
    }
  }

  const options = Object.keys(entityModelClassToDisplayName).map(mapEntityTypeToOption)

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
)(SelectEntityModelClass);
