import { redirect } from "react-router-dom";
import { gameProvider } from "../providers/gameProvider";

export async function updateAvatarAction({ request }) {
  const formData = await request.formData();
  const avatarId = formData.get("id") ? Number(formData.get("id")) : null;
  if (avatarId) {
    await gameProvider.selectAvatar(avatarId);
  }
  return redirect("/");
}
