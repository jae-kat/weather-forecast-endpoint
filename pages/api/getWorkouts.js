export default async function getWorkouts(request, response) {
  if (request.method === 'GET') {
    const workoutResponse = await fetch(
      'https://s3.eu-west-1.amazonaws.com/dev-challenges.myclubs.com/frontend/frontend_challenge_activities.json',
    );
    const workoutBody = await workoutResponse.json();

    response.status(200).json({ workouts: workoutBody });
    return;
  }

  response.status(405).json({ error: 'Method not allowed' });
}
