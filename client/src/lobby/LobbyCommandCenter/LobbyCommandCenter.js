/* eslint-disable react-hooks/exhaustive-deps */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import './LobbyCommandCenter.scss';
import { updateArcadeGameCharacter } from '../../store/actions/arcadeGameActions';
import Button from '../../ui/Button/Button';
import { openSetupDefaultsModal } from '../../store/actions/gameEditorActions';
import { BASIC_CLASS, NPC_CLASS, PLAYER_INSTANCE_CANVAS_ID, PLAYGROUND_CANVAS_ID, PLAYTHROUGH_PLAY_STATE, PLAY_STATE } from '../../game/constants';
import BorderedGrid from '../../ui/BorderedGrid/BorderedGrid';
import Icon from '../../ui/Icon/Icon';

const LobbyCommandCenter = ({
  updateArcadeGameCharacter,
  lobby: { lobby },
}) => {
  const usersById = lobby.users.reduce((prev, next) => {
    prev[next.id] = next
    return prev
  }, {})

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
           [PLAYGROUND_CANVAS_ID+'/colorSelect']: true
        }),
        unlockThis('Playground Sprite Brush', 
          {
            ['addBrush']: true,
            [PLAYGROUND_CANVAS_ID+'/brushSelect']: true,
            ['chooseSprites']: true,
          }),
        unlockThis('Eraser', 
          {
            ['eraser']: true,
          }),
         unlockThis('Draw New Sprite', 
          {
            ['drawNewSprite']: true,
          }),
         unlockThis('Drag Sprite', 
          {
            ['contextMenu/instance/move']: true,
          }),
        unlockThis('Add Object', 
          {
            [BASIC_CLASS+'/addBasic']: true,
            ['chooseSprites']: true,
          }
        ),
        unlockThis('Add NPC', 
          {
            [NPC_CLASS+'/addNPC']: true,
            ['chooseSprites']: true,
          }
        ),
        unlockThis('Add Player', 
          {
            [PLAYER_INSTANCE_CANVAS_ID+'/addPlayer']: true,
            ['chooseSprites']: true,
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
