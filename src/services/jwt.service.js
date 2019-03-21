export function jwtService ($window) {
  const key = 'api-conditor';
  return {
    saveTokenJwt: (token) => $window.localStorage.setItem(key, token),
    removeTokenJwt: () => $window.localStorage.removeItem(key),
    getTokenJwt: () => $window.localStorage.getItem(key)
  };
}
