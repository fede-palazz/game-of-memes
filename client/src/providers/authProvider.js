const baseURL = "http://localhost:3001";
const API = `${baseURL}/api`;

export const authProvider = {
  isAuthenticated: false,
  username: null,
  points: null,
  avatar: null,

  async createUser(username, password) {
    const response = await fetch(`${API}/users`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error);
    }
    return true;
  },

  getUser() {
    const user = {
      isAuthenticated: authProvider.isAuthenticated,
      username: authProvider.username,
      points: authProvider.points,
      avatar: authProvider.avatar,
    };
    return user;
  },

  async login(username, password) {
    const response = await fetch(`${API}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ username: username, password: password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message);
    }
    authProvider.isAuthenticated = true;
    authProvider.username = data.username;
    authProvider.points = data.points;
    authProvider.avatar = data.avatar;
    return true;
  },

  async logout() {
    const response = await fetch(`${API}/sessions/current`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (!response.ok) {
      return false;
    }
    authProvider.isAuthenticated = false;
    authProvider.username = null;
    authProvider.points = null;
    authProvider.avatar = null;
    return true;
  },

  async fetchUserInfo() {
    const response = await fetch(`${API}/sessions/current`, {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      authProvider.isAuthenticated = false;
      authProvider.username = null;
      authProvider.points = null;
      authProvider.avatar = null;
    } else {
      authProvider.isAuthenticated = true;
      authProvider.username = data.username;
      authProvider.points = data.points;
      authProvider.avatar = data.avatar;
    }
    return {
      isAuthenticated: authProvider.isAuthenticated,
      username: authProvider.username,
      points: authProvider.points,
      avatar: authProvider.avatar,
    };
  },
};
