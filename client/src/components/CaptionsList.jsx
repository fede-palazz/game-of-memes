import { Stack } from "react-bootstrap";
import Caption from "./Caption";

function CaptionsList({ captions, disabled = false, selectedCaption, handleChangeCaption }) {
  return (
    <Stack gap={3}>
      {captions.map((caption) => (
        <Caption
          key={caption.id}
          id={caption.id}
          text={caption.text}
          disabled={disabled}
          variant={selectedCaption == caption.id ? "dark" : "light"}
          name="captionRadio"
          isChecked={selectedCaption == caption.id}
          handleChange={(captionId) => handleChangeCaption(captionId)}
        />
      ))}
    </Stack>
  );
}

export default CaptionsList;
