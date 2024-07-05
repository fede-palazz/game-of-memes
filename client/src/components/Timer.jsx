import { useEffect } from "react";

function Timer({ countDown, isActive = true, handleTick, handleExpiration }) {
  useEffect(() => {
    if (!isActive) return;
    const timeoutId = setTimeout(() => {
      if (countDown > 1) {
        handleTick();
      } else {
        handleTick();
        handleExpiration();
        clearTimeout(timeoutId); // Stop the timeout when the timer expires
      }
    }, 1000);
    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
  }, [countDown, isActive]);

  return (
    <p className={`mb-0 fs-1 fw-bold ${countDown < 10 ? "text-danger" : ""}`}>
      {`00:${String(countDown).padStart(2, "0")}`}
    </p>
  );
}

export default Timer;
