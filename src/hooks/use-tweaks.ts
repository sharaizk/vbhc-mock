import { useCallback, useState } from "react";

export function useTweaks<T>(defaults: T) {
  const [values, setValues] = useState(defaults);

  const setTweak = useCallback(
    (keyOrEdits: keyof T | Partial<T>, val?: any) => {
      const edits =
        typeof keyOrEdits === "object" ? keyOrEdits : { [keyOrEdits]: val };

      setValues((prev) => ({
        ...prev,
        ...edits,
      }));

      window.parent.postMessage(
        {
          type: "__edit_mode_set_keys",
          edits,
        },
        "*",
      );

      window.dispatchEvent(
        new CustomEvent("tweakchange", {
          detail: edits,
        }),
      );
    },
    [],
  );

  return [values, setTweak] as const;
}
