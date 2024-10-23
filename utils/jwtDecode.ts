export function isTokenExpired(token: string): boolean{
    const arrayToken = token.split(".");
    const payload = JSON.parse(atob(arrayToken[1]));
    const expirationTime = payload.exp;
    return Date.now() >= expirationTime * 1000;
}