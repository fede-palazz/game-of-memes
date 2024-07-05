import { Button, Col, Container, Image, Modal, Row } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import randomIcon from "../assets/random.png";
import { gameProvider } from "../providers/gameProvider";

function CategoryModal({ show, onHide }) {
  const navigate = useNavigate();
  return (
    <Modal size="lg" aria-labelledby="contained-modal-title-vcenter" centered show={show}>
      <Modal.Header className="bg-primary text-white">
        <Modal.Title id="contained-modal-title-vcenter">Choose a category</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container className="overflow-y-auto" style={{ maxHeight: "500px" }}>
          <Row className="g-2">
            <Col className="mb-1">
              <Link to={"/play?category=simpson"}>
                <Image
                  src={gameProvider.getCoverImageUrl("simpson")}
                  className="shadow"
                  rounded
                  width={360}
                />
              </Link>
            </Col>
            <Col>
              <Link to={"/play?category=griffin"}>
                <Image
                  src={gameProvider.getCoverImageUrl("griffin")}
                  className="shadow"
                  rounded
                  width={360}
                  height={180}
                />
              </Link>
            </Col>
          </Row>
          <Row>
            <Col className="text-center fs-5">The Simpsons</Col>
            <Col className="text-center fs-5">Family guy</Col>
          </Row>
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            onHide();
          }}
        >
          <span className="mx-2 fs-5 align-middle">Cancel</span>
        </Button>
        <Button
          variant="primary"
          className="mx-2"
          onClick={() => {
            navigate("/play");
          }}
        >
          <Image src={randomIcon} fluid height={30} width={30} />
          <span className="mx-2 fs-5 align-middle text-white">Random</span>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default CategoryModal;
