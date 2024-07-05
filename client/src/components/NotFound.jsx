import { Button, Container, Image, Row } from "react-bootstrap";
import notFoundImg from "../assets/not-found.webp";
import { Link } from "react-router-dom";

function NotFound() {
  return (
    <Container
      fluid
      className="min-vh-100 d-flex flex-column text-light wrapper align-items-center justify-content-center gap-4"
    >
      <Row>
        <Image src={notFoundImg} />
      </Row>
      <Row>
        <Link to={"/"}>
          <Button variant="secondary">Go home</Button>
        </Link>
      </Row>
    </Container>
  );
}

export default NotFound;
