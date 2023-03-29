/* eslint-disable no-useless-computed-key */
/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyCommandCenter.scss';
import { updateArcadeGameCharacter } from '../../../store/actions/arcadeGameActions';
import Button from '../../../ui/Button/Button';
import BorderedGrid from '../../../ui/BorderedGrid/BorderedGrid';
import Icon from '../../../ui/Icon/Icon';
import { ADD_BRUSH_IID, BASIC_CLASS_ADD_IID, CHOOSE_TEXTURES_IID, CONTEXT_MENU_INSTANCE_MOVE_IID, DRAW_NEW_TEXTURE_IID, ERASER_IID, NPC_CLASS_ADD_IID, PLAYER_CLASS_ADD_IID } from '../../../constants/interfaceIds';

const LobbyCommandCenter = ({
  updateArcadeGameCharacter,
  lobbyInstance: { lobbyInstance },
}) => {
  function CommandItem({id, title, onClick, icon }) {
    return <div className="CommandItem">
      <Icon icon={icon}></Icon>
      <Button key={id} onClick={onClick}>
        {title}
      </Button>
    </div>
  }

  function unlockThis(title, interfaceIds) {
    return <CommandItem
    id={title}
    title={title}
    icon={'faLockOpen'}
    onClick={() => {
      updateArcadeGameCharacter({
        userId: lobbyInstance.participantId,
        unlockableInterfaceIds: interfaceIds,
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
        unlockThis('Eraser', 
          {
            [ERASER_IID]: true,
          }),
         unlockThis('Draw New Sprite', 
          {
            [DRAW_NEW_TEXTURE_IID]: true,
          }),
         unlockThis('Drag Sprite', 
          {
            [CONTEXT_MENU_INSTANCE_MOVE_IID]: true,
          }),
        unlockThis('Add Object', 
          {
            [BASIC_CLASS_ADD_IID]: true,
            [CHOOSE_TEXTURES_IID]: true,
          }
        ),
        unlockThis('Add NPC', 
          {
            [NPC_CLASS_ADD_IID]: true,
            [CHOOSE_TEXTURES_IID]: true,
          }
        ),
        unlockThis('Add Player', 
          {
            [PLAYER_CLASS_ADD_IID]: true,
            [CHOOSE_TEXTURES_IID]: true,
          }
        )
      ]}
      />
    </div>
  );
};

const mapStateToProps = (state) => ({
  lobbyInstance: state.lobbyInstance,
});

export default compose(
  connect(mapStateToProps, { updateArcadeGameCharacter }),
)(LobbyCommandCenter);
