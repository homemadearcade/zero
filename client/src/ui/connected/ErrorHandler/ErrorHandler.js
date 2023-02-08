import React from 'react';
import { connect } from 'react-redux';

import './ErrorHandler.scss';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { clearError } from '../../../store/actions/errorsActions';
import { Snackbar } from '@mui/material';

const ErrorHandler = ({ 
  errors: { errors },
  clearError
 }) => {  

  function renderSnackbar() {
    const error = errors[errors.length-1]
    function handleClose() {
      clearError(error.id)
    }
    return <Snackbar
      open
      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
      autoHideDuration={12000}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="error">
      <AlertTitle>{error.type}</AlertTitle>
      {error.message?.toString()}
      </Alert>
    </Snackbar>
  }

  return <div className="ErrorHandler">
    {errors.length > 0 && renderSnackbar()}
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  errors: state.errors
});

export default connect(mapStateToProps, { clearError })(ErrorHandler);
