import Typography from "../Typography/Typography"

import './PageHeader.scss'

const PageHeader = ({ title, description }) => {
  return (
    <div className="PageHeader">
    <Typography component="h4" variant="h4">{title}</Typography>
    {description}
  </div>)
}

export default PageHeader