import luceneQueryStringBuilder from 'lucene-query-string-builder';
import queryString from 'query-string';
import angular from 'angular';

export function conditorApiService ($http, jwtService, API_CONDITOR_CONFIG) {
  const fieldsToExclude = [
    'authors',
    'creationDate',
    'duplicates',
    'duplicateRules',
    'hasTransDuplicate',
    'hasDoi',
    'idChain',
    'isDeduplicable',
    'isDuplicate',
    'isNearDuplicate',
    'sessionName',
    'path',
    'teiBlob'
  ];
  const defaultFields = [
    luceneQueryStringBuilder.field('isDuplicate', 'false'),
    luceneQueryStringBuilder.field('isNearDuplicate', 'true')
  ];
  return {
    getRecords: function (
      filter = { source: {}, typeConditor: 'Tous les types' },
      sort = { query: 'title.default.normalized:asc' }
    ) {
      checkTokenJWT();
      const recordsQueryString = getQueryString(filter, sort);
      const requestUrl = `${API_CONDITOR_CONFIG.apiConditorBaseUrl}/${API_CONDITOR_CONFIG.routes.record}/?${recordsQueryString}`;
      return $http.get(requestUrl);
    },
    getRecordById: function (idConditor) {
      checkTokenJWT();
      const requestUrl = `${API_CONDITOR_CONFIG.apiConditorBaseUrl}/${API_CONDITOR_CONFIG.routes.record}/${String(idConditor)}?exclude=${fieldsToExclude.join(',')}`;
      return $http.get(requestUrl);
    },
    getRecordsFromUrl: function (url) {
      checkTokenJWT();
      return $http.get(url);
    },
    getAggregationsSource: function (filter) {
      checkTokenJWT();
      const filterCopy = angular.copy(filter);
      filterCopy.aggregationTerms = { name: 'source', value: 'source' };
      filterCopy.source = {};
      const aggregationsSourceQueryString = getQueryString(filterCopy);
      const requestUrl = `${API_CONDITOR_CONFIG.apiConditorBaseUrl}/${API_CONDITOR_CONFIG.routes.record}/?${aggregationsSourceQueryString}`;
      return $http.get(requestUrl);
    },
    getAggregationsTypeConditor: function (filter) {
      checkTokenJWT();
      const filterCopy = angular.copy(filter);
      filterCopy.typeConditor = 'Tous les types';
      filterCopy.aggregationTerms = { name: 'typeConditor', value: 'typeConditor.normalized' };
      const aggregationsTypeConditorQueryString = getQueryString(filterCopy);
      const requestUrl = `${API_CONDITOR_CONFIG.apiConditorBaseUrl}/${API_CONDITOR_CONFIG.routes.record}/?${aggregationsTypeConditorQueryString}`;
      return $http.get(requestUrl);
    }
  };

  function getQueryString (filter, sort) {
    const { field, group, or, and } = luceneQueryStringBuilder;
    const source = Object.keys(filter.source).filter(source => filter.source[source]);
    const fields = [...defaultFields];
    if (source.length > 0) fields.push(field('source', group(or(...source))));
    if (filter.typeConditor !== 'Tous les types') fields.push(field('typeConditor', filter.typeConditor));
    const luceneQueryString = and(...fields);
    const output = {
      q: luceneQueryString
    };
    if (filter.hasOwnProperty('aggregationTerms')) {
      output.aggs = field(field('terms', filter.aggregationTerms.value), `{ name: ${filter.aggregationTerms.name} }`);
      output.page_size = 0;
    } else {
      output.exclude = fieldsToExclude.join(',');
      output.page_size = API_CONDITOR_CONFIG.pageSize;
      if (sort) output.sort = sort.query;
    }
    return queryString.stringify(output);
  }

  function checkTokenJWT () {
    const tokenJwt = jwtService.getTokenJwt();
    if (tokenJwt) $http.defaults.headers.common.Authorization = `Bearer ${tokenJwt}`;
  }
}
