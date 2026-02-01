import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Log the webhook payload for debugging
    console.log("Farcaster webhook received:", JSON.stringify(body, null, 2));

    // Handle different event types
    const { event } = body;

    if (event === "frame_added") {
      // User added the frame/miniapp
      console.log("Frame added by user");
    } else if (event === "frame_removed") {
      // User removed the frame/miniapp
      console.log("Frame removed by user");
    } else if (event === "notifications_enabled") {
      // User enabled notifications
      console.log("Notifications enabled");
    } else if (event === "notifications_disabled") {
      // User disabled notifications
      console.log("Notifications disabled");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ status: "Webhook endpoint active" });
}
