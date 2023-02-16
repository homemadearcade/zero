/* eslint-disable no-useless-computed-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyCommandCenter.scss';
import { updateArcadeGameCharacter } from '../../store/actions/arcadeGameActions';
import Button from '../../ui/Button/Button';
import { openSetupDefaultsModal } from '../../store/actions/gameSelectorActions';
import BorderedGrid from '../../ui/BorderedGrid/BorderedGrid';
import Icon from '../../ui/Icon/Icon';
import { ADD_BRUSH_IID, BASIC_CLASS_ADD_IID, CHOOSE_SPRITES_IID, CONTEXT_MENU_INSTANCE_MOVE_IID, DRAW_NEW_SPRITE_IID, ERASER_IID, NPC_CLASS_ADD_IID, PLAYER_CLASS_ADD_IID, PLAYGROUND_CANVAS_BRUSH_SELECT_IID, PLAYGROUND_CANVAS_COLOR_SELECT_IID } from '../../constants/interfaceIds';

const LobbyCommandCenter = ({
  updateArcadeGameCharacter,
  lobby: { lobby },
}) => {
  function CommandItem({id, title, onClick, icon }) {
    return <div className="CommandItem">
      <Icon icon={icon}></Icon>
      <Button key={id} onClick={onClick}>
        {title}
      </Button>
    </div>
  }

  function unlockThis(title, ids) {
    return <CommandItem
    id={title}
    title={title}
    icon={'faLockOpen'}
    onClick={() => {
      updateArcadeGameCharacter({
        userId: lobby.participantId,
        unlockableInterfaceIds: ids,
        merge: true
      })
    }}/>
  }

  return (
    <div className="LobbyCommandCenter">
        <BorderedGrid
        maxItems={50} 
        height="100px"
        width="120px"
        items={[
        unlockThis('Add Color', {
          addColor: true
        }),
        unlockThis('Playground Color Brush', {
           [PLAYGROUND_CANVAS_COLOR_SELECT_IID]: true
        }),
        unlockThis('Playground Sprite Brush', 
          {
            [ADD_BRUSH_IID]: true,
            [PLAYGROUND_CANVAS_BRUSH_SELECT_IID]: true,
            [CHOOSE_SPRITES_IID]: true,
          }),
        unlockThis('Eraser', 
          {
            [ERASER_IID]: true,
          }),
         unlockThis('Draw New Sprite', 
          {
            [DRAW_NEW_SPRITE_IID]: true,
          }),
         unlockThis('Drag Sprite', 
          {
            [CONTEXT_MENU_INSTANCE_MOVE_IID]: true,
          }),
        unlockThis('Add Object', 
          {
            [BASIC_CLASS_ADD_IID]: true,
            [CHOOSE_SPRITES_IID]: true,
          }
        ),
        unlockThis('Add NPC', 
          {
            [NPC_CLASS_ADD_IID]: true,
            [CHOOSE_SPRITES_IID]: true,
          }
        ),
        unlockThis('Add Player', 
          {
            [PLAYER_CLASS_ADD_IID]: true,
            [CHOOSE_SPRITES_IID]: true,
          }
        )
      ]}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobby: state.lobby,
});

export default compose(
  connect(mapStateToProps, { openSetupDefaultsModal, updateArcadeGameCharacter }),
)(LobbyCommandCenter);
