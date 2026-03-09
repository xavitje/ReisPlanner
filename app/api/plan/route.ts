import { NextResponse } from 'next/server';

const NS_API_URL = 'https://gateway.api.ns.nl/reisinformatie-api/v3/trips';

const cleanStationName = (name: string) => {
  let cleaned = name.replace(/^Station\s+/i, '');
  return cleaned.trim();
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const rawFrom = searchParams.get('from');
  const rawTo = searchParams.get('to');

  const NS_API_KEY = process.env.NS_API_KEY;

  if (!NS_API_KEY) {
    return NextResponse.json({ error: 'Server configuratie fout: Missende API Key' }, { status: 500 });
  }

  if (!rawFrom || !rawTo) {
    return NextResponse.json({ error: 'Vul zowel een vertrekpunt als bestemming in.' }, { status: 400 });
  }

  // Hier maken we de namen "NS-proof"
  const from = cleanStationName(rawFrom);
  const to = cleanStationName(rawTo);

  try {
    const response = await fetch(
      `${NS_API_URL}?fromStation=${encodeURIComponent(from)}&toStation=${encodeURIComponent(to)}&minimalChangeTime=5`,
      {
        headers: {
          'Ocp-Apim-Subscription-Key': NS_API_KEY,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("NS API weigert request:", errorData);
      return NextResponse.json({
        error: `NS kon geen route vinden voor '${from}' naar '${to}'. Controleer of deze stations bestaan.`
      }, { status: 400 });
    }

    const data = await response.json();

    // Voorkom de 500 error: Wat als NS wel een 200 OK geeft, maar de trips array is leeg of bestaat niet?
    if (!data || !data.trips || data.trips.length === 0) {
      return NextResponse.json({ error: `Geen directe of mogelijke routes gevonden tussen ${from} en ${to}.` }, { status: 404 });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const trips = data.trips.map((trip: any) => ({
      uid: trip.ctxReis,
      departureTime: trip.legs[0]?.origin?.plannedDateTime || '',
      arrivalTime: trip.legs[trip.legs.length - 1]?.destination?.plannedDateTime || '',
      duration: trip.actualDurationInMinutes,
      transfers: trip.transfers,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      legs: trip.legs.map((leg: any) => ({
        mode: leg.type,
        origin: leg.origin?.name || '',
        destination: leg.destination?.name || '',
        departureTime: leg.origin?.plannedDateTime || undefined,
        arrivalTime: leg.destination?.plannedDateTime || undefined,
        direction: leg.direction || '',
        polyline: leg.polyline || undefined
      }))
    }));

    return NextResponse.json(trips);
  } catch (error: any) {
    console.error("Interne Server Error:", error);
    return NextResponse.json({ error: `Fout bij berekenen: ${error.message}` }, { status: 500 });
  }
}