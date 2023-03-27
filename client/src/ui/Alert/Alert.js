import { Alert} from '@mui/material';

    // sx={{
    //   '& .MuiInputBase-root.MuiOutlinedInput-root': {
    //     fontSize: '1em'
    //   },
    // }}
// eslint-disable-next-line import/no-anonymous-default-export
export default function(props) {

  return <Alert
    {...props}
    sx={{
      fontSize: '.875em',
      '& .MuiAlert-icon': {
        fontSize: '1em'
      } 
    }}
    />

}