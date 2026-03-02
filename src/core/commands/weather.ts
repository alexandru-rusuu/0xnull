import type { CommandDefinition } from "@/core/engine/types";

interface WeatherData {
  temperature: number;
  windspeed: number;
  weathercode: number;
  time: string;
}

const WEATHER_CODES: Record<number, { icon: string; desc: string }> = {
  0: { icon: "☀️", desc: "Clear sky" },
  1: { icon: "🌤️", desc: "Mainly clear" },
  2: { icon: "⛅", desc: "Partly cloudy" },
  3: { icon: "☁️", desc: "Overcast" },
  45: { icon: "🌫️", desc: "Foggy" },
  48: { icon: "🌫️", desc: "Rime fog" },
  51: { icon: "🌦️", desc: "Light drizzle" },
  53: { icon: "🌦️", desc: "Moderate drizzle" },
  55: { icon: "🌦️", desc: "Dense drizzle" },
  61: { icon: "🌧️", desc: "Light rain" },
  63: { icon: "🌧️", desc: "Moderate rain" },
  65: { icon: "🌧️", desc: "Heavy rain" },
  71: { icon: "🌨️", desc: "Light snow" },
  73: { icon: "🌨️", desc: "Moderate snow" },
  75: { icon: "❄️", desc: "Heavy snow" },
  77: { icon: "❄️", desc: "Snow grains" },
  80: { icon: "🌧️", desc: "Rain showers" },
  81: { icon: "🌧️", desc: "Moderate showers" },
  82: { icon: "⛈️", desc: "Violent showers" },
  85: { icon: "🌨️", desc: "Snow showers" },
  86: { icon: "🌨️", desc: "Heavy snow showers" },
  95: { icon: "⛈️", desc: "Thunderstorm" },
  96: { icon: "⛈️", desc: "Thunderstorm + hail" },
  99: { icon: "⛈️", desc: "Thunderstorm + heavy hail" },
};

async function getCoordinates(city?: string): Promise<{ lat: number; lon: number; name: string }> {
  if (city) {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`,
    );
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return {
        lat: data.results[0].latitude,
        lon: data.results[0].longitude,
        name: `${data.results[0].name}, ${data.results[0].country_code}`,
      };
    }
    throw new Error(`City not found: ${city}`);
  }

  // Try browser geolocation, fallback to Bucharest
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            name: "Current Location",
          }),
        () =>
          resolve({
            lat: 44.4268,
            lon: 26.1025,
            name: "Bucharest, RO (fallback)",
          }),
        { timeout: 3000 },
      );
    } else {
      resolve({
        lat: 44.4268,
        lon: 26.1025,
        name: "Bucharest, RO (fallback)",
      });
    }
  });
}

export const weatherCommand: CommandDefinition = {
  name: "weather",
  description: "Display current weather conditions",
  usage: "weather [city]",
  aliases: ["wttr"],
  execute: async (ctx) => {
    ctx.setLoading(true);

    try {
      const city = ctx.args.join(" ") || undefined;
      const coords = await getCoordinates(city);

      const res = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`,
      );
      const data = await res.json();
      const w: WeatherData = data.current_weather;

      const weatherInfo = WEATHER_CODES[w.weathercode] ?? {
        icon: "🌡️",
        desc: `Code ${w.weathercode}`,
      };

      ctx.pushLines([
        { type: "blank", content: "" },
        { type: "ascii", content: "  ╔══════════════════════════════════════════╗" },
        { type: "ascii", content: "  ║          🌍 WEATHER REPORT              ║" },
        { type: "ascii", content: "  ╚══════════════════════════════════════════╝" },
        { type: "blank", content: "" },
        { type: "output", content: `  Location:    ${coords.name}`, color: "#00f0ff" },
        { type: "output", content: `  Condition:   ${weatherInfo.icon} ${weatherInfo.desc}` },
        { type: "output", content: `  Temperature: ${w.temperature}°C` },
        { type: "output", content: `  Wind Speed:  ${w.windspeed} km/h` },
        { type: "output", content: `  Updated:     ${w.time}` },
        { type: "blank", content: "" },
      ]);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      ctx.pushLine({
        type: "error",
        content: `weather: ${msg}`,
      });
    } finally {
      ctx.setLoading(false);
    }
  },
};
