export function jwtService ($http, $window) {
  const jwtService = {
    saveTokenJwt: function (token) {
      $window.localStorage.setItem('api-conditor', token);
    },
    getTokenJwt: function () {
      return $window.localStorage.getItem('api-conditor');
    }
  };
  return jwtService;
}
