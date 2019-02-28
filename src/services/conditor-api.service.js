import luceneQueryStringBuilder from 'lucene-query-string-builder';
import queryString from 'query-string';
import angular from 'angular';

export function conditorApiService ($http, CONFIG) {
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
      const recordsQueryString = getQueryString(filter, sort);
      const requestUrl = `${CONFIG.apiConditor.baseUrl}/${CONFIG.apiConditor.routes.record}/?${recordsQueryString}`;
      return $http.get(requestUrl);
    },
    getRecordById: function (idConditor) {
      const requestUrl = `${CONFIG.apiConditor.baseUrl}/${CONFIG.apiConditor.routes.record}/${String(idConditor)}?excludes=${fieldsToExclude.join(',')}`;
      return $http.get(requestUrl);
    },
    getRecordsFromUrl: function (url) {
      return $http.get(url);
    },
    getAggregationsSource: function (filter) {
      const filterCopy = angular.copy(filter);
      filterCopy.aggregationTerms = { name: 'source', value: 'source' };
      filterCopy.source = {};
      const aggregationsSourceQueryString = getQueryString(filterCopy);
      const requestUrl = `${CONFIG.apiConditor.baseUrl}/${CONFIG.apiConditor.routes.record}/?${aggregationsSourceQueryString}`;
      return $http.get(requestUrl);
    },
    getAggregationsTypeConditor: function (filter) {
      const filterCopy = angular.copy(filter);
      filterCopy.typeConditor = 'Tous les types';
      filterCopy.aggregationTerms = { name: 'typeConditor', value: 'typeConditor.normalized' };
      const aggregationsTypeConditorQueryString = getQueryString(filterCopy);
      const requestUrl = `${CONFIG.apiConditor.baseUrl}/${CONFIG.apiConditor.routes.record}/?${aggregationsTypeConditorQueryString}`;
      return $http.get(requestUrl);
    }
  };

  function getQueryString (filter, sort) {
    const { field, group, or, and } = luceneQueryStringBuilder;
    const source = Object.keys(filter.source).filter(source => filter.source[source]);
    const fields = [...defaultFields];

    // Input title abstract
    if (filter.hasOwnProperty('titleAbstract') && filter.titleAbstract) {
      const whereToLook = [
        'abstract',
        'title.default',
        'title.en',
        'title.fr',
        'title.journal',
        'title.meeting',
        'title.monography'
      ].map(item => field(item, filter.titleAbstract));
      const luceneQueryForSearch = or(...whereToLook);
      fields.push(group(luceneQueryForSearch));
    }

    // Checkbox source
    if (source.length > 0) fields.push(field('source', group(or(...source))));

    // Input dropdown type conditor
    if (filter.typeConditor !== 'Tous les types') fields.push(field('typeConditor', filter.typeConditor));
    const luceneQueryString = and(...fields);
    const output = {
      q: luceneQueryString
    };

    if (filter.hasOwnProperty('aggregationTerms')) {
      output.aggs = field(field('terms', filter.aggregationTerms.value), `{ name: ${filter.aggregationTerms.name} }`);
      output.page_size = 0;
    } else {
      output.excludes = fieldsToExclude.join(',');
      output.page_size = CONFIG.apiConditor.pageSize;
      if (sort) output.sort = sort.query;
    }

    return queryString.stringify(output);
  }
}
