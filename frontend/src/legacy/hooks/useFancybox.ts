import { useEffect } from "react";
import { Fancybox } from "@fancyapps/ui";

export const useFancybox = (selector = "[data-fancybox]") => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    Fancybox.bind(selector, {
      dragToClose: false,
      animated: true,
      hideScrollbar: true,
      Thumbs: false,
      Toolbar: {
        display: ["close"],
      },
    });

    return () => {
      Fancybox.unbind(selector);
      Fancybox.close();
    };
  }, [selector]);
};
