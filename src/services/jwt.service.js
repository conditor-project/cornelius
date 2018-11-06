export function jwtService ($window) {
  const key = 'api-conditor';
  const jwtService = {
    saveTokenJwt: (token) => $window.localStorage.setItem(key, token),
    getTokenJwt: () => $window.localStorage.getItem(key)
  };
  return jwtService;
}
