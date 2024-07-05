import { Button, Card, Image } from "react-bootstrap";
import Caption from "./Caption";
import badGameImg from "../assets/bad-game.jpg";
import { useNavigate } from "react-router-dom";
import { House } from "react-bootstrap-icons";

function GameReview({ game }) {
  const navigate = useNavigate();
  const validRounds = game.filter((round) => round.points > 0);
  return (
    <Card className="border-0 my-auto">
      <Card.Header className="bg-secondary text-white">
        <Card.Title className="mb-1 mt-1">Game Review</Card.Title>
      </Card.Header>
      <Card.Body>
        <Card.Title>
          Total score: {validRounds.reduce((acc, round) => acc + round.points, 0)}
        </Card.Title>
        {validRounds.length > 0 && (
          <div className="overflow-y-auto mt-3" style={{ maxHeight: "500px" }}>
            {validRounds.map((round) => (
              <div
                className="d-flex flex-row gap-2 mb-3 align-items-center justify-content-between px-2"
                key={round.memeId}
              >
                <p className="text-center">Round {round.round}</p>
                <Image
                  src={round.memeURL}
                  rounded
                  fluid
                  style={{ maxWidth: "200px", maxHeight: "180px" }}
                  className="shadow"
                />
                <div style={{ maxWidth: "400px", minWidth: "400px" }}>
                  {round.selectedCaption ? (
                    <Caption id={round.selectedCaption.id} text={round.selectedCaption.text} />
                  ) : (
                    <Caption text={`You didn't submit any answer.`} />
                  )}
                </div>

                {/* <p>Points: {round.points}</p> */}
              </div>
            ))}
          </div>
        )}
        {validRounds.length === 0 && (
          <div className="text-center my-2">
            <Image
              src={badGameImg}
              fluid
              rounded
              className="shadow"
              style={{ maxHeight: "350px" }}
            />
          </div>
        )}
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
  );
}

export default GameReview;
