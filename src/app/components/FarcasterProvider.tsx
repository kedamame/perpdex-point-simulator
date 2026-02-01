"use client";

import { useEffect } from "react";
import sdk from "@farcaster/frame-sdk";

export default function FarcasterProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const init = async () => {
      try {
        // Hide splash screen and signal that app is ready
        await sdk.actions.ready();
      } catch (error) {
        // Not in Farcaster context, ignore
        console.log("Not in Farcaster context");
      }
    };

    init();
  }, []);

  return <>{children}</>;
}
