import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Event from "@/models/Event";

export async function POST(request: NextRequest) {
  try {
    // Connect to MongoDB
    await connectDB();

    // Parse the request body
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "eventName",
      "clubName",
      "category",
      "dateOfEvent",
      "timeOfEvent",
      "venue",
      "description",
      "image",
      "organizerName",
      "organizerPhone",
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Create new event
    const event = await Event.create({
      eventName: body.eventName,
      clubName: body.clubName,
      category: body.category,
      dateOfEvent: new Date(body.dateOfEvent),
      timeOfEvent: body.timeOfEvent,
      timestamp: body.timestamp ? new Date(body.timestamp) : new Date(),
      venue: body.venue,
      description: body.description,
      image: body.image, // base64 encoded image
      organizerName: body.organizerName,
      organizerPhone: body.organizerPhone,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Event created successfully",
        data: event,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating event:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      return NextResponse.json(
        {
          success: false,
          error: "Validation error",
          details: error.message,
        },
        { status: 400 }
      );
    }

    // Handle other errors
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// Optional: Add GET endpoint to retrieve events
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const clubName = searchParams.get("clubName");

    // Build query
    const query: any = {};
    if (category) query.category = category;
    if (clubName) query.clubName = clubName;

    // Retrieve events, sorted by date (newest first)
    const events = await Event.find(query).sort({ dateOfEvent: -1 });

    return NextResponse.json(
      {
        success: true,
        count: events.length,
        data: events,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error retrieving events:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
