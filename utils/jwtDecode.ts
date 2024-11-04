export function isTokenExpired(token: string): boolean {
  try {
    const arrayToken = token.split(".");
    const payload = JSON.parse(atob(arrayToken[1]));
    const expirationTime = payload.exp;
    return !expirationTime || Date.now() >= expirationTime * 1000;
  } catch (e) {
    return true;
  }
}

export function getUserIdFromToken(token: string): string {
  const arrayToken = token.split(".");
  const payload = JSON.parse(atob(arrayToken[1]));
  const userId =
    payload[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];
  return userId;
}

