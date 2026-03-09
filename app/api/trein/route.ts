import { NextResponse } from 'next/server';

const NS_JOURNEY_API_URL = 'https://gateway.apiportal.ns.nl/reisinformatie-api/api/v2/journeys';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id'); // Het treinnummer
  const date = searchParams.get('date');

  const NS_API_KEY = process.env.NS_API_KEY;

  if (!NS_API_KEY) {
    return NextResponse.json({ error: 'Missende API Key' }, { status: 500 });
  }

  if (!id) {
    return NextResponse.json({ error: 'Geen treinnummer opgegeven' }, { status: 400 });
  }

  try {
    // We proberen de rit op te halen met of zonder specifieke datum
    const url = date
      ? `${NS_JOURNEY_API_URL}?trainNumber=${id}&dateTime=${date}T12:00:00`
      : `${NS_JOURNEY_API_URL}?trainNumber=${id}`;

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Ocp-Apim-Subscription-Key': NS_API_KEY,
        'User-Agent': 'OVReisPlanner/1.0',
        'Accept': 'application/json'
      },
    });

    if (!response.ok) {
      return NextResponse.json({ error: `Rit niet gevonden (Status: ${response.status})` }, { status: 404 });
    }

    const data = await response.json();
    const payload = data.payload;

    if (!payload) {
      return NextResponse.json({ error: 'Geen data gevonden voor deze rit.' }, { status: 404 });
    }

    // Voorzieningen verzamelen (vaak genest in 'materieel' in de v2 journeys API)
    const rawFacilities = new Set<string>();

    // Voeg faciliteiten toe vanuit het type of materieel details
    if (payload.equipment && payload.equipment.facilities) {
        payload.equipment.facilities.forEach((f: any) => rawFacilities.add(f));
    }
    // Fallback/Mockup voor de iconen (NS API v2 noemt dit vaak in notes/properties)
    const facilitiesText = JSON.stringify(payload).toLowerCase();
    if (facilitiesText.includes('wifi')) rawFacilities.add('WIFI');
    if (facilitiesText.includes('toilet') || facilitiesText.includes('wc')) rawFacilities.add('TOILET');
    if (facilitiesText.includes('fiets') || facilitiesText.includes('bicycle')) rawFacilities.add('BICYCLE');
    if (facilitiesText.includes('rolstoel') || facilitiesText.includes('wheelchair')) rawFacilities.add('WHEELCHAIR');
    if (facilitiesText.includes('stroom') || facilitiesText.includes('power')) rawFacilities.add('POWER');

    // Parse de stops
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const stops = payload.stops.map((stop: any) => {
      const isOrigin = stop.status === 'ORIGIN';
      const isDestination = stop.status === 'DESTINATION';

      let time = '';
      if (isOrigin && stop.departures && stop.departures.length > 0) {
        time = stop.departures[0].actualTime || stop.departures[0].plannedTime;
      } else if (stop.arrivals && stop.arrivals.length > 0) {
        time = stop.arrivals[0].actualTime || stop.arrivals[0].plannedTime;
      }

      return {
        name: stop.stop?.name || 'Onbekend',
        time: time,
        track: stop.actualTrack || stop.plannedTrack,
        status: stop.status,
      };
    }).filter((stop: any) => stop.status !== 'PASSING'); // We filteren stations waar de trein alleen doorheen rijdt zonder te stoppen

    const journeyDetails = {
      trainNumber: id,
      category: payload.transfers?.[0]?.transferType || payload.product?.displayName || 'Trein',
      direction: payload.direction || '',
      operator: payload.operator?.name || 'NS',
      facilities: Array.from(rawFacilities),
      stops: stops
    };

    return NextResponse.json(journeyDetails);

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Fout bij ophalen treindetails' }, { status: 500 });
  }
}