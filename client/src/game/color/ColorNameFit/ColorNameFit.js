import React from 'react';
import { connect } from 'react-redux';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { findColorNameByHex } from '../../../utils/colorUtils';
import useFitText from 'use-fit-text';

const ColorNameFit = ({ 
  hex
}) => {
  const { fontSize, ref } = useFitText()
  const name = findColorNameByHex(hex)

  return <div style={{fontSize}} ref={ref} className="ColorNameFit">
    {name}
  </div>
};

const mapStateToProps = (state) => mapCobrowsingState(state, {

})

export default connect(mapStateToProps, { })(ColorNameFit);
