export function authTokenInterceptorService ($window) {
  const key = 'api-conditor';
  return {
    request: function (config) {
      const tokenJwt = $window.localStorage.getItem(key);
      config.headers = config.headers || {};
      if (tokenJwt) config.headers.Authorization = `Bearer ${tokenJwt}`;
      return config;
    }
  };
}
