import { Button, Col, Container, Image, InputGroup, Row } from "react-bootstrap";
import {
  Form as RouterForm,
  redirect,
  useActionData,
  useLoaderData,
  useNavigate,
  useSubmit,
} from "react-router-dom";
import { Form } from "react-bootstrap";
import Title from "./components/Title";
import "./App.css";
import { authProvider } from "./providers/authProvider";
import AvatarsModal from "./components/AvatarsModal";
import { useState } from "react";
import { gameProvider } from "./providers/gameProvider.js";
import pointsImg from "./assets/points.png";
import playImg from "./assets/play-icon.png";
import profileIcon from "./assets/profile-icon.png";
import logoutIcon from "./assets/logout-icon.png";
import CategoryModal from "./components/CategoryModal.jsx";

export async function loader({ request }) {
  let player = new URL(request.url).searchParams.get("player") || "";
  let avatars = null;
  const user = await authProvider.fetchUserInfo();
  if (user.isAuthenticated) {
    avatars = await gameProvider.getAvatars();
  }
  return { player, user, avatars };
}

export async function action({ request }) {
  const formData = await request.formData();
  const playerName = formData.get("player");
  // Validate player name
  if (!playerName || !playerName.length)
    return { player: "You should give yourself a proper name..." };
  if (playerName.length < 5) return { player: "Good one, but it's too short..." };
  if (playerName.length > 20) return { player: "Good one, but it's too long..." };
  return redirect(`/play/guest?player=${playerName}`);
}

function App() {
  const { player, user, avatars } = useLoaderData();
  const navigate = useNavigate();
  const submit = useSubmit();
  const errors = useActionData();
  const [showAvatars, setShowAvatars] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  return (
    <div className="min-vh-100 d-flex flex-column text-light wrapper">
      <AvatarsModal
        show={showAvatars}
        avatars={avatars}
        userPoints={user.points}
        selectedAvatarId={user?.avatar?.id}
        onHide={() => {
          setShowAvatars(false);
        }}
      />
      <CategoryModal
        show={showCategories}
        onHide={() => {
          setShowCategories(false);
        }}
      />
      <Container>
        <Row className="mt-4 mb-4">
          <Col>
            <Title />
          </Col>
        </Row>
        <Row className="mb-4">
          <div
            className="img-wrapper mx-auto mb-2"
            onClick={() => {
              if (user.isAuthenticated) {
                setShowAvatars(true);
              }
            }}
          >
            <Image
              src={
                user.isAuthenticated
                  ? gameProvider.getAvatarUrl(user.avatar.name)
                  : gameProvider.getDefaultAvatarUrl()
              }
              fluid
              roundedCircle
              className="border border-3 border-light"
            />
          </div>
          {user?.isAuthenticated && (
            <>
              <div className="text-center mb-3">
                <span className="mx-1 fs-5 align-middle">{user.points}</span>
                <Image src={pointsImg} fluid height={30} width={30} />
              </div>
              <p className="text-center fs-4">Welcome back, {user.username}!</p>
            </>
          )}
        </Row>
        <Row>
          {!user?.isAuthenticated && <QuickPlay player={player} errors={errors} />}

          {user?.isAuthenticated && (
            <Col className="text-center">
              <Button
                variant="light"
                className="mx-2"
                onClick={() => {
                  setShowCategories(true);
                }}
              >
                <Image src={playImg} fluid height={30} width={30} />
                <span className="mx-2 fs-5 align-middle">Play</span>
              </Button>
              <Button
                className="mx-2"
                variant="secondary"
                onClick={() => {
                  navigate("/profile");
                }}
              >
                <Image src={profileIcon} fluid height={30} width={30} />
                <span className="mx-2 fs-5 align-middle">Profile</span>
              </Button>
              <Button
                className="mx-2"
                variant="dark"
                onClick={() => {
                  submit(null, { action: "/logout", method: "POST" });
                }}
              >
                <Image src={logoutIcon} fluid height={30} width={30} />
                <span className="mx-2 fs-5 align-middle">Logout</span>
              </Button>
            </Col>
          )}
        </Row>
        {!user?.isAuthenticated && (
          <Row className="text-center mt-4">
            <Col>
              <Button
                className="text-light mx-2"
                size="lg"
                onClick={() => {
                  navigate("/auth?mode=signin");
                }}
              >
                Sign in
              </Button>
              <Button
                variant="secondary"
                className="text-light mx-2"
                size="lg"
                onClick={() => {
                  navigate("/auth?mode=signup");
                }}
              >
                Sign up
              </Button>
            </Col>
          </Row>
        )}
      </Container>
    </div>
  );
}

function QuickPlay({ player, errors }) {
  return (
    <RouterForm className="mx-auto" method="POST" id="playForm" noValidate>
      <InputGroup>
        <Form.Control
          type="text"
          size="lg"
          name="player"
          defaultValue={player}
          placeholder="Player's name"
          aria-label="Player's username"
          maxLength="20"
        />
        <Button variant="success" type="submit" size="lg" id="playBtn" className="text-light">
          <span>Quick play &#x1F579;</span>
        </Button>
      </InputGroup>
      {errors?.player && (
        <p className="error-description mt-2 align-self-start">{errors?.player}</p>
      )}
    </RouterForm>
  );
}

export default App;
