const connectedUsers = new Map();
const connectedExperts = new Map();

const addSocketToMap = (map, key, socketId) => {
  if (!key || !socketId) return;
  if (!map.has(key)) {
    map.set(key, new Set());
  }
  map.get(key).add(socketId);
};

const removeSocketFromMap = (map, key, socketId) => {
  if (!key || !socketId || !map.has(key)) return;
  const socketIds = map.get(key);
  socketIds.delete(socketId);
  if (socketIds.size === 0) {
    map.delete(key);
  }
};

const registerSocket = ({ role, userId, socketId }) => {
  if (!userId || !socketId) return;

  addSocketToMap(connectedUsers, userId, socketId);

  if (role === "legalExpert") {
    addSocketToMap(connectedExperts, userId, socketId);
  }
};

const unregisterSocket = ({ role, userId, socketId }) => {
  if (!userId || !socketId) return;

  removeSocketFromMap(connectedUsers, userId, socketId);

  if (role === "legalExpert") {
    removeSocketFromMap(connectedExperts, userId, socketId);
  }
};

module.exports = {
  connectedUsers,
  connectedExperts,
  registerSocket,
  unregisterSocket,
};
