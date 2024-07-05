import { Link } from "react-router-dom";
import "./Title.css";

function Title() {
  return (
    <Link className="title text-primary text-center user-select-none text-decoration-none" to="/">
      <h1>The Game of</h1>
      <h1>Memes</h1>
    </Link>
  );
}

export default Title;
