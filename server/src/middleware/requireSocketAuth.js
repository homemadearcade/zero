import { SOCKET_IO_STORE, SOCKET_SESSIONS_STORE } from "../constants";

function requireSocketAuth(req, res, next) {

  const socketSessions= req.app.get(SOCKET_SESSIONS_STORE);
  const socket = socketSessions.findSession(req.user.id);
  req.socket = socket;
  req.io = req.app.get(SOCKET_IO_STORE);
  next()
}

export default requireSocketAuth;
