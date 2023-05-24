import { MenuItem } from "@mui/material"
import { EDIT_CUTSCENES_TAB_IID } from "../../../constants/interfaceIds"
import ButtonMenu from "../../../ui/ButtonMenu/ButtonMenu"
import { openCreateCutscene, openEditContentDialog } from "../../../store/actions/game/gameFormEditorActions"
import { mapCobrowsingState } from "../../../utils"
import { compose } from "redux"
import { connect } from "react-redux"
import Icon from "../../../ui/Icon/Icon"

const CreateCutsceneButton = ({
  openCreateCutscene,
  openEditContentDialog
 }) => {
    return <ButtonMenu 
    startIcon={<Icon icon="faScroll"/>}
    variant="outlined" text={"Text Scenes"} menu={(handleClose) => {
      return [
        <MenuItem key="text-2" 
        onClick={() => {
          openCreateCutscene({
            isTextSceneOnly: true,
          })
          handleClose()
        }}>
          {'New Text Scene'}
        </MenuItem>,
        <MenuItem key="text" onClick={() => {
          openEditContentDialog(EDIT_CUTSCENES_TAB_IID)
          handleClose()
        }}>
          {'Edit Text Scenes'}
        </MenuItem>,
      ]
  }}/>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  // gameFormEditor: state.gameFormEditor,
  // gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { openCreateCutscene, openEditContentDialog }),
)(CreateCutsceneButton);

