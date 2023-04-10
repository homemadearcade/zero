import { Paper } from "@mui/material"
import { connect } from "react-redux"
import Typography from "../../../../ui/Typography/Typography"
import { RoleChip } from "../../role/RoleChip/RoleChip"
import './StepPrompt.scss'

const StepPrompt = ({  
  experienceModel: { experienceModel }, 
  prompt,
  children
}) => {
  const role = experienceModel.roles[prompt.roleId]
  return <div className="StepPrompt" style={{
      border: '1px solid' + role.color
      }}>
      <Paper key={prompt.promptId} elevation={1}>
        {children}
        <RoleChip role={role} />
        <Typography className="StepPrompt__text" variant="body1">{prompt.text}</Typography>
      </Paper>
  </div>
}

const mapStateToProps = (state) => ({
  experienceModel: state.experienceModel,
});

export default connect(mapStateToProps, { })(StepPrompt);
