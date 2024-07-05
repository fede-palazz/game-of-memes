import { ToggleButton } from "react-bootstrap";
import { XCircle, CheckCircle } from "react-bootstrap-icons";

function Caption({
  id = 0,
  text = "",
  name = "",
  variant = "light",
  isChecked = false,
  disabled = false,
  handleChange,
}) {
  return (
    <ToggleButton
      id={`caption-${id}`}
      type="radio"
      variant={variant}
      name={name}
      value={id}
      className={`shadow py-2 w-100 d-flex justify-content-center align-items-center ${
        variant !== "light" ? "text-light" : ""
      }`}
      checked={isChecked}
      onChange={() => {
        if (!disabled && handleChange) handleChange(id);
      }}
    >
      {variant === "success" && <CheckCircle size={24} style={{ minWidth: "24px" }} />}
      {variant === "danger" && <XCircle size={24} style={{ minWidth: "24px" }} />}
      <span className="fs-6 mx-2">{text}</span>
    </ToggleButton>
  );
}

export default Caption;
