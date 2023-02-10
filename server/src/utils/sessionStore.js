/* abstract */ class SessionStore {
  findSession(id) {}
  saveSession(id, session) {}
  findAllSessions() {}
}

class InMemorySessionStore extends SessionStore {
  constructor() {
    super();
    this.gameSessions = new Map();
  }

  findSession(id) {
    return this.gameSessions.get(id);
  }

  saveSession(id, session) {
    this.gameSessions.set(id, session);
  }

  findAllSessions() {
    return [...this.gameSessions.values()];
  }
}

module.exports = {
  InMemorySessionStore,
};