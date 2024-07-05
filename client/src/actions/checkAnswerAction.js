import { gameProvider } from "../providers/gameProvider";

export async function checkAnswerAction({ request }) {
  const formData = await request.formData();
  const captionsIds = formData.get("captions").split(",").map(Number);
  const answerId = formData.get("selectedCaption") ? Number(formData.get("selectedCaption")) : 0;
  const memeId = Number(formData.get("meme"));

  const response = await gameProvider.checkAnswer(memeId, captionsIds, answerId);
  return { response };
}
