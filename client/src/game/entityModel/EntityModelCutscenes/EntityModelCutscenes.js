/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { openCreateCutscene } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { RelationTagChip } from '../../tags/RelationTagChip/RelationTagChip';
import './EntityModelCutscenes.scss';
import { getCutscenesForEntityModel} from '../../../utils';
import Divider from '../../../ui/Divider/Divider';
import Button from '../../../ui/Button/Button';
import CutsceneChip from '../../cutscene/CutsceneChip/CutsceneChip';

const EntityModelCutscenes = ({ 
  gameFormEditor: { entityModel },
  gameModel: { gameModel },
  openCreateCutscene
}) => {

  const { 
    entityModelCutscenesInvolved,
    cutsceneIdsByEventType,
    cutsceneRelationTags
  } = getCutscenesForEntityModel({entityModel, gameModel})

  function renderCutscenes(cutsceneIds) {

    console.log('renderCutscenes', cutsceneIds)

    return <>
        {cutsceneIds.map(cutsceneId => {
          const cutscene = gameModel.cutscenes[cutsceneId]
          return <><CutsceneChip cutscene={cutscene} />
            <Button onClick={() => {
              openCreateCutscene(cutscene)
            }} key={cutsceneId} className="EntityModelCutscenes__cutscene">
              Edit {cutscene.name}
            </Button></>
        })}
        <Divider/>
    </>
  }

  return <div className="EntityModelCutscenes">
    {/* <SelectRelationTagFiltered
      formLabel={'Relationship Tags'}
      interfaceId={ENTITY_RELATION_TAGS_IID}
      relationTagIID={RELATION_TAG_CUTSCENE_IID}
      entityModel={entityModel}
      onChange={(relationTag) => {

      }}
    /> */}
    {/* <Divider/> */}
    <Divider>
      Relation Tags
    </Divider>

    {cutsceneRelationTags.map(({relationTag, cutsceneIds}) => {

      return <div key={relationTag.relationTagId} className="EntityModelCutscenes__relation-tag">
        <RelationTagChip relationTag={relationTag} />
        {renderCutscenes(cutsceneIds)}
      </div>
    })}

    <Divider>
      Speaking Role
    </Divider>
    {entityModelCutscenesInvolved.map(cutsceneId => {
      return renderCutscenes([cutsceneId])
    })}
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { openCreateCutscene }),
)(EntityModelCutscenes);
