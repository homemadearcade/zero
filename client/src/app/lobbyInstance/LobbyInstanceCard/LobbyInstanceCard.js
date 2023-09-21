import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '../../../ui/Typography/Typography';

import './LobbyInstanceCard.scss';
import { CardActions } from '@mui/material';
import Link from '../../../ui/Link/Link';
import Button from '../../../ui/Button/Button';
import { APP_ADMIN_ROLE } from '../../../constants';
import { getLobbys } from '../../../store/actions/experience/lobbyInstancesActions';
import { deleteLobby } from '../../../store/actions/experience/lobbyInstanceActions';

const LobbyInstanceCard = ({lobbyInstance, width, getLobbys, deleteLobby, canDelete, auth: { me }}) => {
  // const isEditor = me?.roles[APP_ADMIN_ROLE] || me?.id === lobbyInstance.owner?.id

  // function renderRemoveButton() {
  //   if(lobbyInstance.isRemoved) {
  //     return <Button size="small" onClick={async () => {
  //       await editArcadeGame(lobbyInstance.id, {
  //         isRemoved: false
  //       })
  //       getArcadeGames()
  //     }}>
  //       Restore
  //     </Button>
  //   } else {
  //     return <Button size="small" onClick={async () => {
  //       await editArcadeGame(lobbyInstance.id, {
  //         isRemoved: true
  //       })
  //       getArcadeGames()
  //     }}>
  //       Remove
  //     </Button>
  //   }
  // }

  function renderDeleteButton() {
    return <Button size="small" onClick={async () => {
      await deleteLobby(lobbyInstance.id)
      getLobbys()
    }}>
      Delete
    </Button>
  }

  return <Card className="LobbyInstanceCard" sx={{ width: width? width : 200 }}>
    {lobbyInstance.imageUrl && <CardMedia
      component="img"
      image={lobbyInstance.imageUrl ? lobbyInstance.imageUrl : ""}
      alt={lobbyInstance.title}
    />}
    {!lobbyInstance.imageUrl && <div style={{backgroundColor: '#111'}} >
      <minidenticon-svg username={lobbyInstance.id}></minidenticon-svg>
    </div>}
    <CardContent>

       <Typography utterBottom variant="h5" component="div">{lobbyInstance.invitedUsers[0]?.username}'s Lobby</Typography>
                      {/* <div>
                        <span className="LobbyListPage__label">Lobby ID: </span>
                        <span className="LobbyListPage__info">{lobbyInstance.id}</span>
                      </div>
                      <div>
                        <span className="LobbyListPage__label">Participants Email: </span>
                        <span className="LobbyListPage__info">{lobbyInstance.invitedUsers[0]?.email}</span>
                      </div>
                      <div>
                        <span className="LobbyListPage__label">Participants Username: </span>
                        <span className="LobbyListPage__info">{lobbyInstance.invitedUsers[0]?.username}</span>
                      </div>
                      <div>
                        <span className="LobbyListPage__label">Start Time: </span>
                        <span className="LobbyListPage__info">{lobbyInstance.startTime}</span>
                      </div> */}
      {/* <Typography gutterBottom variant="subtitle2" component="div">
        {'by ' + (metadata.author ? metadata.author : lobbyInstance.owner?.username)}
      </Typography>
      <Typography variant="body2" color="text.secondary">
          {metadata.description}
      </Typography> */}
    </CardContent>
    <CardActions>
      <Link href={`/lobby/${lobbyInstance.id}`}>
        Join
      </Link>
      {/* {canRemove && isEditor && renderRemoveButton()} */}
      {canDelete && renderDeleteButton()}
    </CardActions>
  </Card>
};

const mapStateToProps = (state) => ({
  auth: state.auth
});

export default compose(
  connect(mapStateToProps, { getLobbys, deleteLobby }))(LobbyInstanceCard);
