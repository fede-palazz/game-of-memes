import { redirect } from "react-router-dom";
import { authProvider } from "../providers/authProvider";

export async function logoutAction() {
  await authProvider.logout();
  return redirect("/");
}
