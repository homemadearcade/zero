function requireSocketAuth(req, res, next) {

  const socketSessions= req.app.get('socketSessions');
  const socket = socketSessions.findSession(req.user.id);
  
  req.socket = socket;
  req.io = req.app.get('socketio');
  next()
}

export default requireSocketAuth;
