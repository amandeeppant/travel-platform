export async function callIrctcRequest(url: string, init: RequestInit) {
  const host = process.env.RAPIDAPI_HOST;
  const key = process.env.RAPIDAPI_KEY;
  if (!host || !key) throw new Error("Missing RAPIDAPI_HOST or RAPIDAPI_KEY in environment.");

  const headers: Record<string, string> = {
    "x-rapidapi-host": host,
    "x-rapidapi-key": key,
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };

  const res = await fetch(url, { ...init, headers });
  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    const err: any = new Error(`IRCTC API error: ${res.status} ${res.statusText} ${txt}`);
    err.status = res.status;
    throw err;
  }

  // Some RapidAPI endpoints return an empty body even with 200 OK.
  // Read the raw text and parse safely to avoid `Unexpected end of JSON input`.
  const text = await res.text().catch(() => "");
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch (err) {
    const e: any = new Error(`IRCTC API returned invalid JSON: ${err instanceof Error ? err.message : String(err)}`);
    e.status = res.status;
    e.raw = text;
    throw e;
  }
}

function looksLikeTrainsArray(obj: any): any[] | null {
  if (!obj) return null;
  if (Array.isArray(obj) && obj.length && typeof obj[0] === "object") return obj;
  if (Array.isArray(obj?.trains) && obj.trains.length) return obj.trains;
  if (Array.isArray(obj?.result) && obj.result.length) return obj.result;
  if (Array.isArray(obj?.data) && obj.data.length) return obj.data;
  if (Array.isArray(obj?.data?.trains) && obj.data.trains.length) return obj.data.trains;
  return null;
}

export async function searchTrainsBetweenStations(from: string, to: string, date?: string, trainNumber?: string) {
  const host = process.env.RAPIDAPI_HOST;
  if (!host) throw new Error("Missing RAPIDAPI_HOST in environment.");

  const base = `https://${host}`;

  // Lightweight city -> station-code mapping for common major stations.
  const cityToStation: Record<string, string> = {
    "new delhi": "NDLS",
    "delhi": "NDLS",
    "mumbai": "BCT",
    "mumbai central": "MMCT",
    "bombay": "BCT",
    "kolkata": "KOAA",
    "kolkota": "KOAA",
    "chennai": "MAS",
    "bangalore": "SBC",
    "bengaluru": "SBC",
    "hyderabad": "HYB",
    "secunderabad": "SC",
  };

  function toStationCode(input: string) {
    if (!input) return "";
    const s = input.trim();
    // If user already provided a station code-like token (2-5 uppercase letters), return as-is
    if (/^[A-Z0-9]{2,5}$/.test(s)) return s;
    const key = s.toLowerCase();
    return cityToStation[key] || "";
  }

  const fromCode = toStationCode(from);
  const toCode = toStationCode(to);
  const candidates: { method: "GET" | "POST"; path: string; params?: Record<string, string>; body?: any }[] = [
    { method: "GET", path: "/api/v3/getLiveStation", params: { hours: "1", fromStationCode: from, toStationCode: to } },
    { method: "GET", path: "/api/v3/getTrainsBetweenStations", params: { fromStationCode: from, toStationCode: to, dateOfJourney: date || "" } },
    { method: "GET", path: "/api/v2/getTrainsBetweenStations", params: { fromStationCode: from, toStationCode: to, dateOfJourney: date || "" } },
    { method: "GET", path: "/api/v1/search", params: { fromStation: from, toStation: to, departDate: date || "" } },
    { method: "GET", path: "/api/v1/trains/between", params: { from: from, to: to, date: date || "" } },
    { method: "GET", path: "/api/trainBetweenStations", params: { fromStationCode: from, toStationCode: to, dateOfJourney: date || "" } },
    { method: "POST", path: "/api/v3/getTrainsBetweenStations", body: { fromStationCode: from, toStationCode: to, dateOfJourney: date } },
    { method: "POST", path: "/api/v3/trainsBetweenStations", body: { fromStation: from, toStation: to, dateOfTravel: date } },
  ];

  let lastErr: any = null;

  // First attempt: if we have station codes, call getLiveStation for quick live data
  if (fromCode || toCode) {
    try {
      const u = new URL(`/api/v3/getLiveStation`, base);
      if (fromCode) u.searchParams.set("fromStationCode", fromCode);
      if (toCode) u.searchParams.set("toStationCode", toCode);
      u.searchParams.set("hours", "1");
      const json = await callIrctcRequest(u.toString(), { method: "GET", headers: { "Content-Type": "application/json" } });
      const arr = looksLikeTrainsArray(json);
      if (arr) return arr;
      if (json?.data && looksLikeTrainsArray(json.data)) return json.data;
    } catch (err: any) {
      lastErr = err;
    }
  }
  for (const c of candidates) {
    try {
      const url = new URL(c.path, base).toString();
      let json: any;
      if (c.method === "GET") {
        const u = new URL(url);
        if (c.params) Object.entries(c.params).forEach(([k, v]) => { if (v) u.searchParams.set(k, v); });
        json = await callIrctcRequest(u.toString(), { method: "GET", headers: { "Content-Type": "application/json" } });
      } else {
        json = await callIrctcRequest(url, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(c.body || {}) });
      }

      const arr = looksLikeTrainsArray(json);
      if (arr) return arr;

      if (json?.data && looksLikeTrainsArray(json.data)) return json.data;
      if (json?.result && looksLikeTrainsArray(json.result)) return json.result;
    } catch (err: any) {
      lastErr = err;
    }
  }

  // If a specific train number was provided, try the alternate RapidAPI endpoint the user supplied.
  if (trainNumber) {
    try {
      const altHost = "indian-railway-irctc.p.rapidapi.com";
      const u = new URL(`/api/trains/v1/train/status`, `https://${altHost}`);
      // departure_date expected as YYYYMMDD; try to convert ISO date if provided
      function toYYYYMMDD(d?: string) {
        if (!d) return "";
        const justDigits = d.replace(/-/g, "");
        if (/^\d{8}$/.test(justDigits)) return justDigits;
        const dt = new Date(d);
        if (isNaN(dt.getTime())) return "";
        const y = dt.getFullYear();
        const m = String(dt.getMonth() + 1).padStart(2, "0");
        const day = String(dt.getDate()).padStart(2, "0");
        return `${y}${m}${day}`;
      }

      const dep = toYYYYMMDD(date);
      if (dep) u.searchParams.set("departure_date", dep);
      u.searchParams.set("isH5", "true");
      u.searchParams.set("client", "web");
      u.searchParams.set("deviceIdentifier", "Mozilla%2520Firefox-138.0.0.0");
      u.searchParams.set("train_number", trainNumber);

      const res = await fetch(u.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-rapid-api": "rapid-api-database",
          "x-rapidapi-host": altHost,
          "x-rapidapi-key": process.env.RAPIDAPI_KEY || "",
        },
      });

      if (res.ok) {
        const json = await res.json();
        const arr = looksLikeTrainsArray(json) || looksLikeTrainsArray(json?.data) || looksLikeTrainsArray(json?.result);
        if (arr) return arr;
        // If the response contains a single train status object, wrap it so callers get an array
        if (json && typeof json === "object") return [json];
      } else {
        lastErr = new Error(`Alt IRCTC endpoint error: ${res.status} ${res.statusText} ${await res.text().catch(() => "")}`);
      }
    } catch (err: any) {
      lastErr = err;
    }
  }

  throw lastErr || new Error("No working IRCTC endpoint found");
}
