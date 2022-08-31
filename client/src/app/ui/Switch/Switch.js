import { Switch } from "@mui/material"


export default function({checked, onChange}) {
  return <Switch
  size="small"
  onChange={onChange ? onChange : null}
  checked={checked === undefined ? false : checked}
  />
}