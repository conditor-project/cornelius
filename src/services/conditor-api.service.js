import luceneQueryStringBuilder from 'lucene-query-string-builder';
import queryString from 'query-string';
import angular from 'angular';

export function conditorApiService ($http, jwtService, API_CONDITOR_CONFIG) {
  const fieldsToExclude = [
    'authorRef',
    'creationDate',
    'duplicate',
    'duplicateRules',
    'hadTransDuplicate',
    'hasDoi',
    'idChain',
    'isDeduplicable',
    'isDuplicate',
    'isNearDuplicate',
    'ingestId',
    'path',
    'teiBlob'
  ];
  const defaultFields = [
    luceneQueryStringBuilder.field('isDuplicate', 'false'),
    luceneQueryStringBuilder.field('isNearDuplicate', 'true')
  ];
  return {
    getRecords: function (filterOptions = {
      source: {
        hal: false,
        pubmed: false,
        sudoc: false,
        wos: false
      },
      score: 90,
      typeConditor: 'Any'
    }) {
      const tokenJwt = jwtService.getTokenJwt();
      if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
      const recordsQueryString = getQueryString(filterOptions);
      const requestUrl = `${API_CONDITOR_CONFIG.baseUrl}/${API_CONDITOR_CONFIG.routes.record}/?${recordsQueryString}`;
      return $http.get(requestUrl);
    },
    getRecordById: function (idConditor) {
      const tokenJwt = jwtService.getTokenJwt();
      if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
      const requestUrl = `${API_CONDITOR_CONFIG.baseUrl}/${API_CONDITOR_CONFIG.routes.record}/${String(idConditor)}?exclude=${fieldsToExclude.join(',')}`;
      return $http.get(requestUrl);
    },
    getRecordsFromUrl: function (url) {
      const tokenJwt = jwtService.getTokenJwt();
      if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
      return $http.get(url);
    },
    getAggregationsSource: function (filterOptions) {
      const tokenJwt = jwtService.getTokenJwt();
      if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
      const filterOptionsCopy = angular.copy(filterOptions);
      filterOptionsCopy.aggregationTerms = { name: 'source', value: 'source' };
      filterOptionsCopy.source = {};
      const aggregationsSourceQueryString = getQueryString(filterOptionsCopy);
      const requestUrl = `${API_CONDITOR_CONFIG.baseUrl}/${API_CONDITOR_CONFIG.routes.record}/?${aggregationsSourceQueryString}`;
      return $http.get(requestUrl);
    },
    getAggregationsTypeConditor: function (filterOptions) {
      const tokenJwt = jwtService.getTokenJwt();
      if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
      const filterOptionsCopy = angular.copy(filterOptions);
      filterOptionsCopy.typeConditor = 'Any';
      filterOptionsCopy.aggregationTerms = { name: 'typeConditor', value: 'typeConditor.normalized' };
      const aggregationsTypeConditorQueryString = getQueryString(filterOptionsCopy);
      const requestUrl = `${API_CONDITOR_CONFIG.baseUrl}/${API_CONDITOR_CONFIG.routes.record}/?${aggregationsTypeConditorQueryString}`;
      return $http.get(requestUrl);
    }
  };

  function getQueryString (data) {
    const { field, group, or, and } = luceneQueryStringBuilder;
    const source = Object.keys(data.source).filter(source => data.source[source]);
    const fields = [...defaultFields];
    if (source.length > 0) fields.push(field('source', group(or(...source))));
    if (data.typeConditor !== 'Any') fields.push(field('typeConditor', data.typeConditor));
    const luceneQueryString = and(...fields);
    const output = {
      q: luceneQueryString
    };
    if (data.hasOwnProperty('aggregationTerms')) {
      output.aggs = field(field('terms', data.aggregationTerms.value), `{ name: ${data.aggregationTerms.name} }`);
      output.page_size = 0;
    } else {
      output.exclude = fieldsToExclude.join(',');
      output.page_size = 5;
    }
    return queryString.stringify(output);
  }
}
