import { AlertTitle } from "@mui/material";
import Alert from "../../../ui/Alert/Alert";

export default function({text}) {
return <Alert severity='warning'>
  <AlertTitle>{text}</AlertTitle>
    </Alert>
}