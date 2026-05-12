import { useEffect, useState } from "react";

export function useEditMode() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      const type = e?.data?.type;

      if (type === "__activate_edit_mode") {
        setOpen(true);
      }

      if (type === "__deactivate_edit_mode") {
        setOpen(false);
      }
    };

    window.addEventListener("message", onMsg);

    window.parent.postMessage({ type: "__edit_mode_available" }, "*");

    return () => {
      window.removeEventListener("message", onMsg);
    };
  }, []);

  return {
    open,
    setOpen,
  };
}
