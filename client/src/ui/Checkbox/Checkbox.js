import * as React from 'react';
import { Checkbox as MuiCheckbox } from '@mui/material';
import { FormControlLabel } from '@mui/material';
import Icon from '../Icon/Icon';
import { connect } from 'react-redux';
import { compose } from 'redux';

function Checkbox({checked, onChange, label, icon, theme, size}) {
  return <FormControlLabel control={<>
    <MuiCheckbox
      size={size}
      checked={checked}
      onChange={(e) => {
        onChange(e.target.checked)
      }}
      icon={icon && <Icon size="sm" icon={icon}/>}
      checkedIcon={icon && <Icon size="sm" color={theme.primaryColor} icon={icon}/>}
      inputProps={{ 'aria-label': 'controlled' }}
    />
  </>} label={label} />
}

const mapStateToProps = (state) => {
  return {
    theme: state.theme,
  }
};

export default compose(
  connect(mapStateToProps, { }),
)(Checkbox);