import { NextResponse } from 'next/server';

const NS_API_URL = 'https://gateway.api.ns.nl/reisinformatie-api/v3/trips';
const NS_API_KEY = '07cb688327d24f25a8fd7101ffd95474';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get('from');
  const to = searchParams.get('to');

  if (!from || !to) {
    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });
  }

  try {
    const response = await fetch(
      `${NS_API_URL}?fromStation=${from}&toStation=${to}&minimalChangeTime=5`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': NS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`NS API reageerde met status: ${response.status}`);
    }

    const data = await response.json();

    const trips = data.trips.map((trip: any) => ({
      uid: trip.ctxReis,
      departureTime: trip.legs[0]?.origin?.plannedDateTime || '',
      arrivalTime: trip.legs[trip.legs.length - 1]?.destination?.plannedDateTime || '',
      duration: trip.actualDurationInMinutes,
      transfers: trip.transfers,
      legs: trip.legs.map((leg: any) => ({
        mode: leg.type,
        origin: leg.origin?.name || '',
        destination: leg.destination?.name || '',
        departureTime: leg.origin?.plannedDateTime || '',
        arrivalTime: leg.destination?.plannedDateTime || '',
        direction: leg.direction || '',
        polyline: leg.polyline || undefined
      }))
    }));

    return NextResponse.json(trips);
  } catch (error) {
    console.error("NS API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch from NS' }, { status: 500 });
  }
}