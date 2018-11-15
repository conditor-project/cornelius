export function conditorApiService ($http, jwtService, API_CONDITOR_CONFIG) {
  return {
    getRecords: function (filterOptions = {
      source: {
        hal: true,
        pubmed: true,
        sudoc: true,
        wos: true
      },
      score: 90,
      typeConditor: 'All'
    }) {
      const tokenJwt = jwtService.getTokenJwt();
      if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
      const sources = Object.keys(filterOptions.source).filter(source => filterOptions.source[source]).join(' OR ');
      let requestUrl = API_CONDITOR_CONFIG.baseUrl + '/?q=isDuplicate:false AND isNearDuplicate:true';
      if (sources.length > 0) requestUrl += ` AND source:(${sources})`;
      if (filterOptions.typeConditor !== 'All') requestUrl += ` AND typeConditor:${filterOptions.typeConditor}`;
      requestUrl += '&exclude=teiBlob';
      return $http.get(requestUrl);
    },
    getAggregationsSource: function () {
      const tokenJwt = jwtService.getTokenJwt();
      if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
      const requestUrl = API_CONDITOR_CONFIG.baseUrl + `/?aggs=terms:source&size=0`;
      return $http.get(requestUrl);
    }
  };
}
