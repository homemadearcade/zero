// write a react component that is a list of mui MenuItems
//

import { MenuItem } from "@mui/material";
import { connect } from "react-redux";
import { compose } from "redux";
import { 
  dataSourceIIDToDisplayName,
  dataSourceIIDToIcon
} from "../../../game/constants";
import { mapCobrowsingState } from "../../../utils";
import Checkbox from "../../Checkbox/Checkbox";
import { toggleSelectorClassInvisibility } from "../../../store/actions/game/gameSelectorActions";
import Unlockable from "../../../game/cobrowsing/Unlockable/Unlockable";
import { 
  DERIVED_AUTOGENERATION_IID,
  DERIVED_ENTITY_MODEL_IID, IS_DATA_REMOVED_IID, 
  RELATION_TAG_LIST_IID, SELECT_RELATION_TAG_IID, 
  DERIVED_DEFAULT_SYSTEM_IID, DERIVED_INTERFACE_ACTION_IID, 
  EFFECT_LIST_IID } from "../../../constants/interfaceIds";

function DataSourceVisibilityMenu({ interfaceId, gameSelector: { selectorInterfaceListInvisibility }, toggleSelectorClassInvisibility, cobrowsing: { isActivelyCobrowsing, isSubscribedCobrowsing } }) {

  function renderSelectorListCheckbox(dataSourceIID) {
    return <Checkbox key={dataSourceIID} size="small" icon={dataSourceIIDToIcon[dataSourceIID]} checked={!selectorInterfaceListInvisibility[interfaceId]?.[dataSourceIID]} onChange={() => {
      toggleSelectorClassInvisibility(interfaceId, dataSourceIID)
    }} label={dataSourceIIDToDisplayName[dataSourceIID]}></Checkbox>
  }

  function getSelectorListVisibility() {
    const menuItems = []

    // if(interfaceId !== TEXT_SCENE_IID && interfaceId !== CUTSCENE_IID) {
      menuItems.push(
        <MenuItem key={DERIVED_AUTOGENERATION_IID+interfaceId} dense>{renderSelectorListCheckbox(DERIVED_AUTOGENERATION_IID)}</MenuItem>
      )
      menuItems.push(
        <MenuItem key={DERIVED_DEFAULT_SYSTEM_IID+interfaceId} dense>{renderSelectorListCheckbox(DERIVED_DEFAULT_SYSTEM_IID)}</MenuItem>
      )

      if(interfaceId === RELATION_TAG_LIST_IID || interfaceId === SELECT_RELATION_TAG_IID) {
        menuItems.push(
          <MenuItem key={DERIVED_ENTITY_MODEL_IID+interfaceId} dense>{renderSelectorListCheckbox(DERIVED_ENTITY_MODEL_IID)}</MenuItem>
        )
      }

      if(interfaceId === EFFECT_LIST_IID) {
        menuItems.push(
          <MenuItem key={DERIVED_INTERFACE_ACTION_IID+interfaceId} dense>{renderSelectorListCheckbox(DERIVED_INTERFACE_ACTION_IID)}</MenuItem>
        )
      }

  
      menuItems.push(
        <Unlockable key={IS_DATA_REMOVED_IID} interfaceId={IS_DATA_REMOVED_IID}>
        <MenuItem key={IS_DATA_REMOVED_IID+interfaceId}  dense><Checkbox size="small" icon="faSquareMinus" checked={!selectorInterfaceListInvisibility[interfaceId]?.[IS_DATA_REMOVED_IID]} onChange={() => {
          toggleSelectorClassInvisibility(interfaceId, IS_DATA_REMOVED_IID)
        }} label="Removed"></Checkbox></MenuItem>
        </Unlockable>
      )

    return menuItems
  }
  
  return getSelectorListVisibility()
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameSelector: state.gameSelector,
  cobrowsing: state.cobrowsing
})
export default compose(
  connect(mapStateToProps, { toggleSelectorClassInvisibility }),
)(DataSourceVisibilityMenu);
