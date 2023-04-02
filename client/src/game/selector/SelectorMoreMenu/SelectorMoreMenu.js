// write a react component that is a list of mui MenuItems
//

import { MenuItem, MenuList } from "@mui/material";
import { connect } from "react-redux";
import { compose } from "redux";
import { mapCobrowsingState } from "../../../utils";
import { toggleSelectorClassInvisibility } from "../../../store/actions/game/gameSelectorActions";
import { entityModelTypeToDisplayName } from "../../constants";
import LayerVisibility from "../../ui/LayerVisibility/LayerVisibility";
import DataSourceVisibilityMenu from "../../../ui/connected/DataSourceVisibilityMenu/DataSourceVisibilityMenu";
import Divider from "../../../ui/Divider/Divider";

function SelectorMoreMenu({  selectorClass}) {
  function getStageVisibility() {
    const menuItems = []
    if(entityModelTypeToDisplayName[selectorClass]) {
      menuItems.push(<MenuItem className="MenuIconButton__title" gutters key="visibile on stage" dense>Visible on Stage</MenuItem>)
      menuItems.push(<MenuItem key={"visible on stage" + selectorClass} dense><LayerVisibility layerId={selectorClass} /></MenuItem>)
    }

    return menuItems
  }

  return <MenuList dense={true}>
    <MenuItem className="MenuIconButton__title" gutters dense>Visible in List</MenuItem>
    <DataSourceVisibilityMenu selectorClass={selectorClass} />
    {/* {getStageVisibility()} */}
    </MenuList>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  gameViewEditor: state.gameViewEditor,
})
export default compose(
  connect(mapStateToProps, { toggleSelectorClassInvisibility }),
)(SelectorMoreMenu);
