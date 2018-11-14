export function jwtService ($window) {
  const key = 'api-conditor';
  return {
    saveTokenJwt: (token) => $window.localStorage.setItem(key, token),
    getTokenJwt: () => $window.localStorage.getItem(key)
  };
}
