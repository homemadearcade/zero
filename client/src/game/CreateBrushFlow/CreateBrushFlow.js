/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateBrushFlow.scss';
import CobrowsingModal from '../../components/ui/CobrowsingModal/CobrowsingModal';
import SelectChipsAuto from '../../components/ui/SelectChipsAuto/SelectChipsAuto';
import { Button } from '@mui/material';
import RadioGroupColumn from '../../components/ui/RadioGroupColumn/RadioGroupColumn';

const CreateBrushFlow = ({ onComplete, onClose, game: { descriptorOptions } }) => {
  const [brush, setBrush] = useState({
    layer: null,
    descriptors: [],
  })

  return <CobrowsingModal open={true} onClose={onClose}>
    <div className="CreateBrushFlow__body">
      <RadioGroupColumn
        value={brush.layer}
        title="Layer"
        onChange={(event, value) => {
          setBrush((brush) => {
            return {...brush, layer: value}
          })
        }}
        options={[{
          label: 'Background',
          value: -1,
        },{
          label: 'Play Area',
          value: 0,
        },
        {
          label: 'Overhead',
          value: 1,
        }]}
      />
      <SelectChipsAuto 
        onChange={(event, descriptors) => {
          setBrush((brush) => {
            return {...brush, descriptors: descriptors.map(({value}) => value)}
          })
        }}
        title="Descriptors"
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
