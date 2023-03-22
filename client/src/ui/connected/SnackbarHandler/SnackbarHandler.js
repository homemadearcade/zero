import React from 'react';
import { connect } from 'react-redux';

import './SnackbarHandler.scss';

import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { Snackbar, SnackbarContent } from '@mui/material';
import { clearSnackbar } from '../../../store/actions/snackbarActions';
import IconButton from '../../IconButton/IconButton';

const SnackbarHandler= ({ 
  snackbar: { snackbars },
  clearSnackbar
 }) => {  
  function renderSnackbar() {
    const snackbar = snackbars[snackbars.length-1]
    function handleClose() {
      clearSnackbar(snackbar.id)
    }

    const action = (<>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
        icon="faClose"
      ></IconButton>
    </>)

    return <Snackbar
      open
      autoHideDuration={8000}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      onClose={handleClose}
      action={action}>
        <SnackbarContent 
          message={<div>
            {snackbar.imageUrl && <img alt={snackbar.message} src={snackbar.imageUrl} width="100px"/>}
            {snackbar.message}
            {action}
          </div>}
        />
    </Snackbar>
  }

  return <div className="SnackbarHandler">
    {snackbars.length > 0 && renderSnackbar()}
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  snackbar: state.snackbar
});

export default connect(mapStateToProps, { clearSnackbar })(SnackbarHandler);
