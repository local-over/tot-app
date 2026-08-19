export function validateAuth(request) {
  const authHeader = request.headers.get('authorization');
  const key = process.env.TOT_API_KEY || 'tot_dev_key_2024';
  if (!authHeader || authHeader !== `Bearer ${key}`) {
    return false;
  }
  return true;
}
