import { Container } from "react-bootstrap";
import { gameProvider } from "../providers/gameProvider";
import Game from "../components/Game";
import {
  redirect,
  useFetcher,
  useLoaderData,
  useNavigate,
  useRouteLoaderData,
} from "react-router-dom";
import { useState } from "react";
import { authProvider } from "../providers/authProvider";
import GameReview from "../components/GameReview";

export async function loader({ request }) {
  const category = new URL(request.url).searchParams.get("category") || "";
  const user = authProvider.getUser();
  if (!user.isAuthenticated) {
    return redirect("/");
  }
  const game = await gameProvider.generateGame(category);
  return { game, user };
}

export async function action({ request }) {
  const formData = await request.formData();
  const fields = Object.fromEntries(formData);
  const { meme1, meme2, meme3, score1, score2, score3 } = fields;
  const data = [
    { memeId: meme1, score: score1 },
    { memeId: meme2, score: score2 },
    { memeId: meme3, score: score3 },
  ];
  const response = await gameProvider.saveGame(data);
  return response;
}

function GamePage() {
  const { game, user } = useLoaderData();
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const gameFinished = fetcher.data ?? false;
  const [currentRound, setCurrentRound] = useState(1);

  const handleGameExit = () => {
    navigate("/", { replace: true });
  };

  const handleRoundEnding = (selectedCaptionText, points) => {
    setCurrentRound((prevRound) => {
      // Save current round stats
      game[prevRound - 1].selectedCaption = selectedCaptionText;
      game[prevRound - 1].points = points;
      game[prevRound - 1].round = prevRound;
      // Switch to next round or end game
      if (prevRound === game.length) {
        // All the rounds are finished, submit data to server
        fetcher.submit(
          {
            meme1: game[0].memeId,
            score1: game[0].points,
            meme2: game[1].memeId,
            score2: game[1].points,
            meme3: game[2].memeId,
            score3: game[2].points,
          },
          { method: "POST", action: "/play?index" }
        );
        return prevRound;
      } else {
        // Start new round
        return prevRound + 1;
      }
    });
  };

  return (
    <Container fluid className="wrapper text-light py-3 px-4">
      {!gameFinished && (
        <Game
          game={game[currentRound - 1]}
          player={user.username}
          avatar={gameProvider.getAvatarUrl(user.avatar.name)}
          round={currentRound}
          handleGameExit={handleGameExit}
          handleRoundEnding={handleRoundEnding}
        />
      )}
      {gameFinished && <GameReview game={game} />}
    </Container>
  );
}

export default GamePage;
