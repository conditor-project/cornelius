export function jwtService ($http, $localStorage) {
  const jwtService = {};
  jwtService.addToken = addToken;
  return jwtService;

  function addToken (token) {
    $localStorage.conditor = { token };
    $http.defaults.headers.common.Authorization = 'Bearer ' + token;
  }
}
