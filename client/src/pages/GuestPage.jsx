import { Container } from "react-bootstrap";
import Game from "../components/Game";
import { redirect, useLoaderData, useNavigate } from "react-router-dom";
import { gameProvider } from "../providers/gameProvider";
import { authProvider } from "../providers/authProvider";

export async function loader({ request }) {
  const player = new URL(request.url).searchParams.get("player");
  if (!player || !player.length || authProvider.isAuthenticated) {
    return redirect("/");
  }
  const game = await gameProvider.generateGame();
  return { player, game };
}

function GuestPage() {
  const { player, game } = useLoaderData();
  const avatar = gameProvider.getDefaultAvatarUrl();
  const currentRound = 1;
  const navigate = useNavigate();

  const handleGameExit = () => {
    navigate(`/?player=${player}`, { replace: true });
  };

  const handleRoundEnding = () => {
    navigate(`/?player=${player}`);
  };

  return (
    <Container fluid className="wrapper text-light py-3 px-4">
      <Game
        game={game[0]}
        player={player}
        avatar={avatar}
        round={currentRound}
        handleGameExit={handleGameExit}
        handleRoundEnding={handleRoundEnding}
      />
    </Container>
  );
}

export default GuestPage;
