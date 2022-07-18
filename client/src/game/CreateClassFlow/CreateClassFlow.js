/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import './CreateClassFlow.scss';
import CobrowsingModal from '../../components/ui/CobrowsingModal/CobrowsingModal';
import SelectChipsAuto from '../../components/ui/SelectChipsAuto/SelectChipsAuto';
import { Button } from '@mui/material';

const CreateClassFlow = ({ onComplete, onClose, game: { descriptorOptions } }) => {
  const [objectClass, setObjectClass] = useState({
    descriptors: []
  })

  return <CobrowsingModal open={true} onClose={onClose}>
    <div className="CreateClassFlow__body">
      <SelectChipsAuto 
        onChange={(event, descriptors) => {
          setObjectClass((objectClass) => {
            return {...objectClass, descriptors: descriptors.map(({value}) => value)}
          })
        }}
        title="Descriptors"
        initialValue={objectClass.descriptors}
        options={descriptorOptions}
      />
      <Button onClick={() => {
        onComplete(objectClass)
      }}>
        Create Class
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
)(CreateClassFlow);
