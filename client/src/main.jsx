import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/globals.scss";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import GamePage, { loader as gameLoader, action as saveGameAction } from "./pages/GamePage.jsx";
import { loader as appLoader, action as playAction } from "./App";
import { logoutAction } from "./actions/logoutAction.js";
import { checkAnswerAction } from "./actions/checkAnswerAction.js";
import GuestPage, { loader as guestLoader } from "./pages/GuestPage.jsx";
import AuthPage, { loader as authLoader, action as authAction } from "./pages/AuthPage.jsx";
import NotFound from "./components/NotFound.jsx";
import { updateAvatarAction } from "./actions/updateAvatarAction.js";
import ProfilePage, { loader as profileLoader } from "./pages/ProfilePage.jsx";

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route id="root" path="/" errorElement={<NotFound />}>
        <Route index element={<App />} loader={appLoader} action={playAction} />
        <Route
          path="play"
          element={<GamePage />}
          loader={gameLoader}
          action={saveGameAction}
          shouldRevalidate={({ currentUrl }) => {
            // revalidate only if submissions don't originate from /play
            return !currentUrl.pathname.includes("/play");
          }}
        />
        <Route
          path="play/guest"
          element={<GuestPage />}
          loader={guestLoader}
          shouldRevalidate={({ currentUrl }) => {
            // revalidate only if submissions don't originate from /play/guest
            return !currentUrl.pathname.includes("/play/guest");
          }}
        />
        <Route path="auth" element={<AuthPage />} loader={authLoader} action={authAction} />
        <Route path="profile" element={<ProfilePage />} loader={profileLoader} />
      </Route>
      <Route path="/checkAnswer" action={checkAnswerAction} />
      <Route path="/logout" action={logoutAction} />
      <Route path="/avatar" action={updateAvatarAction} />
      <Route path="*" element={<NotFound />} />
    </>
  )
);
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
