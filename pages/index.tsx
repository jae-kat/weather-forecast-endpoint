import Head from 'next/head';
import { useEffect, useState } from 'react';
import { outdoorWorkoutStyles } from '../styles/indexStyles';

type ApiWeatherResponse = {
  weather: Forecast[];
  activityDate: { objectId: string };
  city: string;
};

type Forecast = {
  min_temp: string;
  max_temp: string;
  pop: string;
  valid_date: string;
  weather: { description: string };
};

type Workout = {
  _source: {
    description: string;
    name: string;
    activityDate: {
      start: { iso: string };
      objectId: string;
    };
    partner: { name: string };
    participationModes: string[];
    city: string;
  };
};

export default function Home() {
  const [forecast, setForecast] = useState<ApiWeatherResponse | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [workouts, setWorkouts] = useState<Workout[] | undefined>();

  useEffect(() => {
    async function getWorkouts() {
      try {
        const response = await fetch('/api/getWorkouts');
        const body: { workouts: { hits: { hits: Workout[] } } } =
          await response.json();
        const outdoorWorkouts = body.workouts.hits.hits.filter((workout) =>
          workout._source.participationModes.includes('outdoor'),
        );
        setWorkouts(outdoorWorkouts);
      } catch (err) {
        console.log(err);
      }
    }
    getWorkouts().catch((err) => console.log(err));
  }, []);

  async function getWeatherFromApi(objectId: string) {
    try {
      const weatherResponse = await fetch('/api/getWeather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ objectId: objectId }),
      });
      const weatherBody: { error: string } | ApiWeatherResponse =
        await weatherResponse.json();
      if ('error' in weatherBody) {
        setError(weatherBody.error);
        return;
      }
      setForecast(weatherBody);
    } catch (err) {
      console.log('Error fetching the weather forecast: ', err);
    }
  }

  return (
    <div>
      <Head>
        <title>Outdoor Workouts</title>
        <meta
          name="description"
          content="Get the weather forecast for your outdoor classes"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div css={outdoorWorkoutStyles}>
        <h1>OUTDOOR CLASSES</h1>

        {workouts &&
          workouts.map((workout) => {
            return (
              <div
                className="workouts"
                key={`outdoor-workout-${workout._source.activityDate.objectId}`}
              >
                <p className="date">
                  {new Date(
                    workout._source.activityDate.start.iso,
                  ).toLocaleString('en-UK', {
                    day: 'numeric',
                    month: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                <p className="city">{workout._source.city}</p>
                <h2>{workout._source.name}</h2>
                <button
                  onClick={() =>
                    getWeatherFromApi(workout._source.activityDate.objectId)
                  }
                >
                  WEATHER FORECAST
                </button>
              </div>
            );
          })}

        {error && <p>{error}</p>}
        {forecast && (
          <div className="forecast">
            <button onClick={() => setForecast(undefined)}>X Close</button>
            <p className="city">{forecast.city} </p>
            <p className="date">{forecast.weather[0].valid_date}</p>
            <p className="description">
              {forecast.weather[0].weather.description}
            </p>
            <p className="temp">
              Temperature:
              <br />
              <span>Max: ⇧ {forecast.weather[0].max_temp}°C</span>
              <br />
              <span>Min: ⇩ {forecast.weather[0].min_temp}°C</span>
            </p>
            <p className="rain">
              Probability of precipitation: {forecast.weather[0].pop}%
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
