export function jwtService ($http, $window) {
  const jwtService = {};
  jwtService.addToken = addToken;
  return jwtService;

  function addToken (token) {
    $window.localStorage.setItem('conditor', token);
    $http.defaults.headers.common.Authorization = 'Bearer ' + token;
  }
}
