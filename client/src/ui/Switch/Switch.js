import { Switch } from "@mui/material"
import FormLabel from "../FormLabel/FormLabel"
import './Switch.scss'

export default function({checked, onChange, labels, disabled}) {
  const switchEl = <Switch
    disabled={disabled}
    size="small"
    onChange={onChange ? onChange : null}
    checked={checked === undefined ? false : checked}
    />


  if(labels) {
    return <div className="Switch">
      <FormLabel>{labels[0]}</FormLabel>
      {switchEl}
      <FormLabel>{labels[1]}</FormLabel>
    </div>
  }

  return switchEl


}