import { TextField } from '@mui/material';

// eslint-disable-next-line import/no-anonymous-default-export
export default function(props) {

  return <TextField
    sx={{
      '& .MuiInputBase-root.MuiOutlinedInput-root': {
        fontSize: '1em'
      },
    }}
    {...props}
    />

}