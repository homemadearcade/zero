/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { openCreateRelation } from '../../../store/actions/game/gameFormEditorActions';
import { mapCobrowsingState } from '../../../utils/cobrowsingUtils';
import { RelationTagChip } from '../../tags/RelationTagChip/RelationTagChip';
import EventShorthand from '../../event/EventShorthand/EventShorthand';
import EffectShorthand from '../../effect/EffectShorthand/EffectShorthand';
import './EntityModelRelations.scss';
import CobrowsingAccordianList from '../../cobrowsing/CobrowsingAccordianList/CobrowsingAccordianList';
import { getRelationsForEntityModel } from '../../../utils';
import Divider from '../../../ui/Divider/Divider';
import CreateRelationForRelationTagButton from '../../relations/CreateRelationForRelationTagButton/CreateRelationForRelationTagButton';
import { DERIVED_AUTOGENERATION_IID, DERIVED_ENTITY_MODEL_IID } from '../../../constants/interfaceIds';
import Typography from '../../../ui/Typography/Typography';

const EntityModelRelations = ({ 
  gameFormEditor: { entityModel },
  gameModel: { gameModel },
  openCreateRelation
}) => {
  const relationsForEachTag = getRelationsForEntityModel({entityModel, gameModel})

  function getRelationAccordianList({ relations, relationTag }) {
    const title = <>
      <div className='EntityModelRelations__relation-title'>
        <RelationTagChip relationTag={relationTag} />
        {`(${relations.length})`}
      </div>
    </>

    const body = <div className="EntityModelRelations__relations">
      {relationTag.dataSourceIID !== DERIVED_AUTOGENERATION_IID && relationTag.dataSourceIID !== DERIVED_ENTITY_MODEL_IID && <CreateRelationForRelationTagButton
        entityModel={entityModel}
        relationTag={relationTag}
      />}
      {relations.map(relation => {
        const event = gameModel.events[relation.eventId]
        const effects = relation.effectIds.map(effectId => {
          return gameModel.effects[effectId]
        })

        const relationTagA = gameModel.relationTags[relation.relationTagIdA]
        const relationTagB = gameModel.relationTags[relation.relationTagIdB]

        return <div key={relation.relationId} onClick={() => {
          openCreateRelation(relation)
        }} className="EntityModelRelations__relation">
          {relationTagA && <RelationTagChip relationTag={relationTagA} />}
          {relationTagB && <RelationTagChip relationTag={relationTagB} />}
          <div className="EntityModelRelations__relation-event">
            <EventShorthand event={event} />
          </div>
          {effects.map(effect => {
            return <div key={effect.effectId} className="EntityModelRelations__relation-effect">
              <EffectShorthand effect={effect} />
            </div>
          })}
          <Divider/>
        </div>
      })}
    </div>

    return {
      interfaceId: relationTag.relationTagId,
      title,
      body
    }
  }
  
  const entityModelRelationTag = gameModel.relationTags[entityModel.entityModelId]

  return <div className="EntityModelRelations">
    {entityModelRelationTag && <><Divider>
      Add New Relationship
    </Divider>
    <CreateRelationForRelationTagButton
      entityModel={entityModel}
      relationTag={entityModelRelationTag}
    /></>}
    <Divider>
      Relationships by Tag
    </Divider>
    <CobrowsingAccordianList interfaceGroupId="EntityModelRelations" accordians={relationsForEachTag.map(getRelationAccordianList)} />
  </div>
}

const mapStateToProps = (state) => mapCobrowsingState(state, {
  gameFormEditor: state.gameFormEditor,
  gameModel: state.gameModel,
})

export default compose(
  connect(mapStateToProps, { openCreateRelation }),
)(EntityModelRelations);
