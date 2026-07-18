import { NextResponse } from "next/server";
import { createOffer, deleteOffer, listOffers, updateOffer } from "@/lib/offers";
import { handleApiError } from "@/lib/apiError";

export async function GET() {
  try {
    const offers = await listOffers({ includeInactive: true });
    return NextResponse.json(offers);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const offer = await createOffer(body);
    return NextResponse.json(offer, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create offer";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.id) {
      return NextResponse.json({ error: "Offer id is required" }, { status: 400 });
    }

    const offer = await updateOffer(body.id, body);
    return NextResponse.json(offer);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to update offer";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Offer id is required" }, { status: 400 });
    }

    await deleteOffer(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to delete offer";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
