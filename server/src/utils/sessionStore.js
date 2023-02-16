/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.gameRooms = new Map();
  }

  findSession(id) {
    return this.gameRooms.get(id);
  }

  saveSession(id, session) {
    this.gameRooms.set(id, session);
  }

  findAllSessions() {
    return [...this.gameRooms.values()];
  }
}

module.exports = {
  InMemorySessionStore,
};