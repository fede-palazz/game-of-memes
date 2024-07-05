import { useState } from "react";
import { Card, Col, Container, Image, Row } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import pointsImg from "../assets/points.png";

import { useFetcher } from "react-router-dom";

function AvatarsModal({ show, avatars, userPoints, selectedAvatarId, onHide }) {
  const [selectedAvatar, setSelectedAvatar] = useState(selectedAvatarId);
  const fetcher = useFetcher();

  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show}>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title id="contained-modal-title-vcenter">Choose your avatar</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="overflow-y-auto" style={{ maxHeight: "500px" }}>
          <Row xs={1} sm={1} md={2} lg={3} className="g-3">
            {avatars &&
              avatars.map((avatar) => (
                <Col key={avatar.id} className="mb-1">
                  <Avatar
                    id={avatar.id}
                    url={avatar.name}
                    value={avatar.value}
                    userPoints={userPoints}
                    isSelected={avatar.id === selectedAvatar}
                    handleClick={(id) => {
                      setSelectedAvatar(id);
                    }}
                  />
                </Col>
              ))}
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            setSelectedAvatar(selectedAvatarId);
            onHide();
          }}
        >
          Cancel
        </Button>
        <Button
          className="text-white"
          onClick={() => {
            fetcher.submit({ id: selectedAvatar }, { action: "/avatar", method: "PUT" });
            onHide();
          }}
        >
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

function Avatar({ id, url, value, isSelected, userPoints, handleClick }) {
  let avatarName = url
    .split("/")
    .pop()
    .replace("-", " ")
    .replace(".png", "")
    .replace(".jpeg", "")
    .replace(".jpg", "");
  avatarName = avatarName.charAt(0).toUpperCase() + avatarName.slice(1);

  return (
    <Card
      style={{ width: "180px" }}
      border={userPoints < value ? "danger border-3" : isSelected ? "dark border-3" : ""}
      onClick={() => {
        if (userPoints >= value) {
          handleClick(id);
        }
      }}
    >
      <Card.Img variant="bottom" src={url} />
      <Card.Body>
        <Card.Title>{avatarName}</Card.Title>
        <div className="text-start">
          <span className="mx-1 fs-5 align-middle">{value}</span>
          <Image src={pointsImg} fluid height={30} width={30} />
        </div>
      </Card.Body>
    </Card>
  );
}

export default AvatarsModal;
