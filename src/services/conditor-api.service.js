export function conditorApiService ($http, jwtService, API_CONDITOR_CONFIG) {
  const fieldsToExclude = ['teiBlob', 'hasDoi', 'ingestId', 'path', 'duplicate', 'idChain', 'isDuplicate', 'isDeduplicable', 'isNearDuplicate', 'creationDate', 'authorRef'];
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
      let requestUrl = API_CONDITOR_CONFIG.baseUrl + '/v1/records/?q=isDuplicate:false AND isNearDuplicate:true';
      if (sources.length > 0) requestUrl += ` AND source:(${sources})`;
      if (filterOptions.typeConditor !== 'All') requestUrl += ` AND typeConditor:${filterOptions.typeConditor}`;
      requestUrl += `&exclude=${fieldsToExclude.join(',')}`;
      requestUrl += '&page_size=5';
      return $http.get(requestUrl);
    },
    getRecordById: function (idConditor) {
      const tokenJwt = jwtService.getTokenJwt();
      if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
      const requestUrl = `${API_CONDITOR_CONFIG.baseUrl}/v1/records/${String(idConditor)}?exclude=${fieldsToExclude.join(',')}`;
      return $http.get(requestUrl);
    },
    getRecordsFromUrl: function (url) {
      const tokenJwt = jwtService.getTokenJwt();
      if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
      return $http.get(url);
    },
    getAggregationsSource: function () {
      const tokenJwt = jwtService.getTokenJwt();
      if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
      const requestUrl = API_CONDITOR_CONFIG.baseUrl + `/v1/records/?aggs=terms:source&size=0`;
      return $http.get(requestUrl);
    }
  };
}
