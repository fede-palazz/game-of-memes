import { Accordion, Button, Card, Col, Image, Row } from "react-bootstrap";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { authProvider } from "../providers/authProvider";
import { gameProvider } from "../providers/gameProvider";
import { House } from "react-bootstrap-icons";

export async function loader() {
  const user = authProvider.getUser();
  if (!user.isAuthenticated) {
    return redirect("/");
  }
  const games = await gameProvider.getPastGames();
  return { games, user };
}

function ProfilePage() {
  const navigate = useNavigate();
  const { games, user } = useLoaderData();

  return (
    <div className="min-vh-100 d-flex flex-column text-light wrapper align-items-center">
      <Card className="border-0 my-auto" style={{ maxWidth: "90%", minWidth: "900px" }}>
        <Card.Header className="bg-primary text-white">
          <Card.Title className="mb-1 mt-1">My profile</Card.Title>
        </Card.Header>
        <Card.Body>
          <Card.Title>Account</Card.Title>
          <Row>
            <Col className="d-flex align-items-center">
              <strong>Username:&nbsp;</strong> {user.username}
            </Col>
            <Col className="text-end">
              <span className="mx-2">Avatar</span>
              <Image
                src={gameProvider.getAvatarUrl(user.avatar.name)}
                fluid
                roundedCircle
                className="border border-2 border-light"
                width={50}
                height={50}
              />
            </Col>
          </Row>
          <Card.Title className="mt-4">Scoreboard</Card.Title>
          <div
            className="overflow-y-auto overflow-x-hidden mt-3 px-2"
            style={{ maxHeight: "400px" }}
          >
            {games.map((game, index) => (
              <Row key={index}>
                <Accordion>
                  <Accordion.Item eventKey={index} className="mb-4">
                    <Accordion.Header>
                      {game.date} - Total score:{" "}
                      {game.scores.reduce((acc, score) => acc + score, 0)}
                    </Accordion.Header>
                    <Accordion.Body>
                      <Row className="d-flex align-items-center mb-2">
                        {game.memes.map((meme) => (
                          <Col key={meme.id} className="text-center">
                            <Image
                              src={meme.name}
                              rounded
                              fluid
                              style={{ maxWidth: "200px", maxHeight: "180px" }}
                              className="shadow"
                            />
                          </Col>
                        ))}
                      </Row>
                      <Row className="d-flex align-items-center">
                        {game.scores.map((score, index) => (
                          <Col
                            key={index}
                            className={`text-center ${score === 0 ? "text-danger" : ""}`}
                          >
                            <p>{score} points</p>
                          </Col>
                        ))}
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
              </Row>
            ))}
            {games.length === 0 && <p>You have not played any games yet...</p>}
          </div>
        </Card.Body>
        <Card.Footer className="text-center bg-white border-0 mb-1">
          <Button
            className="text-white"
            onClick={() => {
              navigate("/");
            }}
          >
            <House size={20} />
            <span className="mx-2 align-middle">Go home</span>
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
}

export default ProfilePage;
