function MemeResponse(meme) {
  const response = {
    memeId: meme.id,
    memeURL: `/memes/${meme.category}/${meme.name}`,
    captions: meme.captions,
  };
  return response;
}

export default MemeResponse;
