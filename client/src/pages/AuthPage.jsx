import { Button, Card, Col, Container, Nav, Row, InputGroup, Form } from "react-bootstrap";
import {
  redirect,
  useLoaderData,
  useNavigate,
  Form as RouterForm,
  useActionData,
} from "react-router-dom";
import { Person, Key } from "react-bootstrap-icons";
import Title from "../components/Title";
import { authProvider } from "../providers/authProvider";

export async function loader({ request }) {
  let mode = new URL(request.url).searchParams.get("mode");
  if (mode !== "signin" && mode !== "signup") {
    return redirect("/auth?mode=signin");
  }
  return { mode };
}

export async function action({ request }) {
  const mode = new URL(request.url).searchParams.get("mode");
  const formData = await request.formData();
  const username = formData.get("username");
  const password = formData.get("password");
  // Validate form
  let errors = {};
  if (!username) errors.username = "Username is required";
  else if (username.length < 5) errors.username = "Username is too short (min 5 characters)";
  else if (username.length > 25) errors.username = "Username is too long (max 25 characters)";
  if (!password) errors.password = "Password is required";
  else if (password.length < 5) errors.password = "Password is too short (min 5 characters)";
  else if (password.length > 25) errors.password = "Password is too long (max 25 characters)";
  // Check errors
  if (Object.keys(errors).length) {
    return errors;
  }
  // Send request
  if (mode === "signin") {
    // Login user
    try {
      const response = await authProvider.login(username, password);
      if (response) return redirect("/");
    } catch (err) {
      errors.response = err.message;
      return errors;
    }
  } else {
    // Create user account
    try {
      const response = await authProvider.createUser(username, password);
      if (!response) {
        errors.response = "An unexpected error occurred. Please, try again.";
        return errors;
      }
      return {
        created: "Account successfully created, you can now login.",
      };
    } catch (err) {
      if (err.message.includes("The username already exists")) {
        errors.response = err.message;
        return errors;
      }
      return {
        created: "Account successfully created, you can now login.",
      };
    }
  }
  return null;
}

function AuthPage() {
  const { mode } = useLoaderData();
  const navigate = useNavigate();
  const errors = useActionData();

  return (
    <Container fluid className="wrapper p-4">
      <Row className="mb-4">
        <Title />
      </Row>
      <Row>
        <Col className="d-flex justify-content-center ">
          <Card style={{ width: "450px" }}>
            <Nav
              fill
              variant="underline"
              defaultActiveKey={mode}
              onSelect={(mode) => {
                navigate(`/auth?mode=${mode}`);
              }}
            >
              <Nav.Item>
                <Nav.Link eventKey="signin">Sign in</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="signup">Sign up</Nav.Link>
              </Nav.Item>
            </Nav>
            <Card.Body>
              <Card.Title>
                {mode === "signin" && "Login to your account"}
                {mode === "signup" && "Create an account"}
              </Card.Title>
              <RouterForm method="POST" className="mt-3" id="authForm" noValidate>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="username-addon">
                    <Person size={22} />
                  </InputGroup.Text>
                  <Form.Control
                    name="username"
                    className="rounded-end"
                    placeholder="Username"
                    aria-label="Username"
                    aria-describedby="username-addon"
                    defaultValue=""
                    isInvalid={errors?.username || errors?.response?.includes("username")}
                  />
                  <Form.Control.Feedback type="invalid">{errors?.username}</Form.Control.Feedback>
                </InputGroup>
                <InputGroup className="mb-3">
                  <InputGroup.Text id="password-addon">
                    <Key size={22} />
                  </InputGroup.Text>
                  <Form.Control
                    type="password"
                    name="password"
                    className="rounded-end"
                    placeholder="Password"
                    aria-label="Password"
                    aria-describedby="password-addon"
                    defaultValue=""
                    isInvalid={errors?.password}
                  />
                  <Form.Control.Feedback type="invalid">{errors?.password}</Form.Control.Feedback>
                </InputGroup>
                <p className="text-danger">{errors?.response}</p>
                <p className="text-success">{errors?.created}</p>
                {mode === "signin" && (
                  <Button variant="primary" type="submit" className="text-white">
                    Login
                  </Button>
                )}
                {mode === "signup" && (
                  <Button variant="primary" type="submit" className="text-white">
                    Register
                  </Button>
                )}
              </RouterForm>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default AuthPage;
