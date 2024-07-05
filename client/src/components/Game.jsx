import { Button, Col, Image, ProgressBar, Row } from "react-bootstrap";
import { BoxArrowLeft, Send, ArrowRightCircle } from "react-bootstrap-icons";
import { useEffect, useState } from "react";
import Timer from "./Timer";
import { useFetcher } from "react-router-dom";
import Caption from "./Caption";
import CaptionsList from "./CaptionsList";

function Game({ game, player, avatar, round, handleRoundEnding, handleGameExit }) {
  const noCaptionMessage = "You didn't submit any answer.";
  const [isTimerActive, setIsTimerActive] = useState(true);
  const [selectedCaptionId, setSelectedCaptionId] = useState(null);
  const fetcher = useFetcher();
  const [response, setResponse] = useState(null);
  const selectedCaption = game.captions.find((caption) => caption.id === selectedCaptionId);

  useEffect(() => {
    setIsTimerActive(true);
  }, [round]);

  useEffect(() => {
    if (fetcher.data?.response) {
      setResponse(fetcher.data.response);
    }
  }, [fetcher.data]);
  /**
   * Convert an array of captions into a string of captions ids separated by commas.
   *
   * @returns {string}
   */
  const serializeCaptions = () => {
    return game.captions.map((caption) => caption.id).join(",");
  };

  const handleTimerExpiration = () => {
    setIsTimerActive(false);
    setSelectedCaptionId(null);
    fetcher.submit(
      {
        meme: `${game.memeId}`,
        captions: serializeCaptions(),
        selectedCaption: "",
      },
      { action: "/checkAnswer", method: "POST" }
    );
  };

  return (
    <>
      <InfoBar
        round={round}
        player={player}
        avatar={avatar}
        isTimerActive={isTimerActive}
        handleTimerExpiration={() => handleTimerExpiration()}
      />

      <Row className="w-100 mb-4 my-md-auto">
        <Col className="mb-4 text-sm-center text-md-start" md={6} lg={5}>
          <Image
            src={game.memeURL}
            alt="Random meme"
            className="shadow"
            fluid
            rounded
            style={{ maxHeight: "350px" }}
          />
          {!response && <p className="fs-5 my-3">Select the right caption for this meme.</p>}
        </Col>
        {/* CAPTIONS */}
        {!response && (
          <Col>
            <CaptionsList
              captions={game.captions}
              selectedCaption={selectedCaptionId}
              handleChangeCaption={setSelectedCaptionId}
            />
          </Col>
        )}
        {response && (
          <Col>
            <div>
              <p>Correct answers:</p>
              <CaptionsList captions={response.validCaptions} disabled={true} />
            </div>
            <div className="mt-3">
              <p>Your answer:</p>
              <Caption
                text={selectedCaption ? selectedCaption.text : noCaptionMessage}
                disabled={true}
                variant={response.isValid ? "success" : "danger"}
              />
            </div>
          </Col>
        )}
      </Row>
      {response && (
        <Row className="w-100 text-center my-md-auto my-2">
          <span className="fs-3">You scored {response.points} points!</span>
        </Row>
      )}
      <Row className="w-100 my-4 mb-4 flex-column-reverse flex-md-row align-items-center">
        <Col md={6} lg={5} className="text-start my-3">
          <Button variant="secondary" size="lg" className="text-light" onClick={handleGameExit}>
            <BoxArrowLeft size={24} />
            <span className="mx-2">Exit game</span>
          </Button>
        </Col>
        <Col>
          {!response && (
            <Button
              size="lg"
              disabled={!selectedCaptionId}
              className="text-light"
              onClick={() => {
                setIsTimerActive(false);
                fetcher.submit(
                  {
                    meme: `${game.memeId}`,
                    captions: serializeCaptions(),
                    selectedCaption: `${selectedCaptionId ? selectedCaptionId : ""}`,
                  },
                  { action: "/checkAnswer", method: "POST" }
                );
              }}
            >
              <span className="mx-2">Submit answer</span>
              <Send size={24} />
            </Button>
          )}
          {response && (
            <Button
              size="lg"
              className="text-light"
              onClick={() => {
                if (round !== 3) setResponse(null);
                handleRoundEnding(selectedCaption, response?.points);
              }}
            >
              <span className="mx-2">Continue</span>
              <ArrowRightCircle size={24} />
            </Button>
          )}
        </Col>
      </Row>
    </>
  );
}

function InfoBar({ round, player, avatar, isTimerActive, handleTimerExpiration }) {
  const initialCount = 30;
  const [countDown, setCountDown] = useState(initialCount);

  useEffect(() => {
    setCountDown(initialCount);
  }, [round]);

  return (
    <>
      <Row className="w-100 align-items-center">
        <Col>
          {/* <div> */}
          <span className="fs-5">Round {round}</span>
          {/* </div> */}
        </Col>
        <Col className="text-center align-middle">
          <Timer
            countDown={countDown}
            isActive={isTimerActive}
            handleTick={() => setCountDown((prevCount) => prevCount - 1)}
            handleExpiration={handleTimerExpiration}
          />
        </Col>
        <Col>
          <div className="d-flex align-items-center justify-content-end">
            <span className="fs-5 mx-2">{player}</span>
            <Image src={avatar} roundedCircle height={48} />
          </div>
        </Col>
      </Row>
      {/* Progress Bar */}
      <Row className="w-100 mb-4">
        <Col>
          <ProgressBar
            animated
            variant={countDown < 10 ? "danger" : "primary"}
            now={Math.floor((countDown * 100) / initialCount)}
            className="mt-2"
          />
        </Col>
      </Row>
    </>
  );
}

export default Game;
