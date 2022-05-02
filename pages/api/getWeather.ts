import { NextApiRequest, NextApiResponse } from 'next';
import { Forecast, Workout } from '../';

require('dotenv-safe').config();

export default async function getWeather(
  request: NextApiRequest,
  response: NextApiResponse,
) {
  if (request.method === 'POST') {
    //
    try {
      // get the workouts
      const workoutResponse = await fetch(
        'https://s3.eu-west-1.amazonaws.com/dev-challenges.myclubs.com/frontend/frontend_challenge_activities.json',
      );
      const workoutBody: { hits: { hits: Workout[] } } | undefined =
        await workoutResponse.json();
      if (!workoutBody) {
        response.json({ error: 'Failed to fetch the workouts' });
        return;
      }
      // get the single workout that we need the forecast for
      const requestedWorkoutInfo = workoutBody.hits.hits.find(
        (item) => item._source.activityDate.objectId === request.body.objectId,
      );
      if (!requestedWorkoutInfo) {
        response.status(404).json({ error: "Can't find your workout" });
        return;
      }
      // get the date of the workout
      const workoutDate =
        requestedWorkoutInfo._source.activityDate.start.iso.slice(0, 10);

      // get the city of the workout
      const workoutLocationLat = requestedWorkoutInfo._source.location.latitude;
      const workoutLocationLon =
        requestedWorkoutInfo._source.location.longitude;

      // for debugging netlify
      if (!process.env.API_KEY) {
        response
          .status(502)
          .json({ error: 'Problem using the environment variables' });
        return;
      }
      // get the weather forecast for the specific city
      const forecastResponse = await fetch(
        `https://api.weatherbit.io/v2.0/forecast/daily?&lat=${workoutLocationLat}&lon=${workoutLocationLon}&key=${process.env.API_KEY}`,
      );
      const forecastBody: { data: Forecast[] } | undefined =
        await forecastResponse.json();

      if (!forecastBody) {
        response
          .status(404)
          .json({ error: 'Failed to fetch the weather forecast' });
        return;
      }

      // use only the forecast for the day of the workout
      const dateForecast = forecastBody.data.filter(
        (weather) =>
          weather.valid_date ===
          // BUT these dates are in the past, so add one year to the date
          (
            Number(workoutDate.slice(0, 4)) +
            1 +
            workoutDate.slice(4)
          ).toString(),
      );
      // send the activityDate and the forecast in the response body
      response.status(200).json({
        weather: dateForecast[0],
        activityDate: requestedWorkoutInfo._source.activityDate,
        city: requestedWorkoutInfo._source.city,
      });
      return;
    } catch {
      response
        .status(404)
        .json({ error: 'Oh no, something went wrong getting your forecast' });
      return;
    }
  }
  response.status(405).json({ error: 'Method not supported' });
}
