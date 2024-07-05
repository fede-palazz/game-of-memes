const baseURL = "http://localhost:3001";
const API = `${baseURL}/api`;

export const gameProvider = {
  async generateGame(category = "") {
    const url = category ? `${API}/games/new?category=${category}` : `${API}/games/new`;
    const response = await fetch(url, { credentials: "include" });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const game = await response.json();
    // Assign full path to memes' pictures
    game.map((round) => {
      round.memeURL = baseURL + round.memeURL;
      return round;
    });
    return game;
  },

  async checkAnswer(memeId, captionsIds, answerId) {
    const response = await fetch(`${API}/games/validate`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        memeId,
        captionsIds,
        answerId,
      }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  },

  async saveGame(rounds) {
    const response = await fetch(`${API}/games`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ rounds: rounds }),
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  },

  async getPastGames() {
    const response = await fetch(`${API}/games`, { credentials: "include" });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const games = await response.json();
    // Assign full path to memes' pictures
    games.map((game) => {
      game.memes.map((meme) => {
        meme.name = `${baseURL}/memes/${meme.category}/${meme.name}`;
        return meme;
      });
    });
    return games;
  },

  async getAvatars() {
    const response = await fetch(`${API}/avatars`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const avatars = await response.json();
    avatars.map((avatar) => {
      avatar.name = `${baseURL}/avatars/${avatar.name}`;
      return avatar;
    });
    return avatars;
  },

  async selectAvatar(avatarId) {
    const response = await fetch(`${API}/avatars/${avatarId}`, {
      method: "PUT",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  },

  getAvatarUrl(avatarName) {
    return `${baseURL}/avatars/${avatarName}`;
  },

  getDefaultAvatarUrl() {
    return `${baseURL}/avatars/akward-look-monkey.jpg`;
  },

  getCoverImageUrl(category) {
    if (category === "simpson") return `${baseURL}/memes/simpson/cover.webp`;
    if (category === "griffin") return `${baseURL}/memes/griffin/cover.jpg`;
    return null;
  },
};
