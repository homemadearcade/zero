/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateBrushFlow.scss';
import CobrowsingModal from '../../components/ui/CobrowsingModal/CobrowsingModal';
import SelectChipsAuto from '../../components/ui/SelectChipsAuto/SelectChipsAuto';
import { Button } from '@mui/material';

const CreateBrushFlow = ({ onComplete, onClose, game: { descriptorOptions } }) => {
  const [brush, setBrush] = useState({
    layer: null,
    descriptors: [],
  })

  return <CobrowsingModal open={true} onClose={onClose}>
    <div className="CreateBrushFlow__body">
      <SelectChipsAuto 
        onChange={(event, descriptors) => {
          setBrush((brush) => {
            return {...brush, descriptors: descriptors.map(({value}) => value)}
          })
        }}
        label="Descriptors"
        initialValue={brush.descriptors}
        options={descriptorOptions}
      />
      <Button onClick={() => {
        onComplete(brush)
      }}>
        Create Brush
      </Button>
      <Button onClick={onClose}>
        Cancel
      </Button>
    </div>

  </CobrowsingModal>
}

const mapStateToProps = (state) => ({
  game: state.game,
});

export default compose(
  connect(mapStateToProps, { }),
)(CreateBrushFlow);
