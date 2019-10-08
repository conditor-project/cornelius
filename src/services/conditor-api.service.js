import luceneQueryStringBuilder from 'lucene-query-string-builder';
import queryString from 'query-string';
import angular from 'angular';

export function conditorApiService ($http, CONFIG) {
  const fieldsToExclude = [
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
    'path'
  ];
  const defaultFields = [
    luceneQueryStringBuilder.field('isNearDuplicate', 'true')
  ];
  return {
    getRecords: function (
      filter = {
        source: {},
        typeConditor: 'Tous les types',
        publicationDate: {
          min: 0,
          max: 0,
          options: {
            ceil: 0,
            floor: 0
          }
        }
      },
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
    },
    getAggregationsPublicationDate: function (filter) {
      const filterCopy = angular.copy(filter);
      filterCopy.publicationDate = { min: 0, max: 0, options: { ceil: 0, floor: 0 } };
      filterCopy.aggregationTerms = { name: 'publicationDate', value: 'xPublicationDate' };
      const aggregationsPublicationDateQueryString = getQueryString(filterCopy);
      const requestUrl = `${CONFIG.apiConditor.baseUrl}/${CONFIG.apiConditor.routes.record}/?${aggregationsPublicationDateQueryString}`;
      return $http.get(requestUrl);
    },
    postDuplicatesValidation: function (duplicatesValidation) {
      const requestUrl = `${CONFIG.apiConditor.baseUrl}/duplicatesValidations/?debug`;
      return $http.post(requestUrl, duplicatesValidation);
    }
  };

  function getQueryString (filter, sort) {
    const { field, group, or, and, range } = luceneQueryStringBuilder;
    const source = Object.keys(filter.source).filter(source => filter.source[source]);
    const fields = [...defaultFields];
    const nestedLuceneQueryString = [];

    // Input title abstract
    if (filter.hasOwnProperty('titleAbstract') && filter.titleAbstract) {
      const titleAbstract = escapeDoubleQuote(filter.titleAbstract);
      const whereToLook = [
        'abstract',
        'title.default',
        'title.en',
        'title.fr',
        'title.journal',
        'title.meeting',
        'title.monography'
      ].map(item => field(item, group(titleAbstract)));
      const luceneQueryForTitleAbstract = or(...whereToLook);
      fields.push(group(luceneQueryForTitleAbstract));
    }

    // Input author
    if (filter.hasOwnProperty('author') && filter.author) {
      const author = escapeDoubleQuote(filter.author);
      fields.push(field('authorNames', group(author)));
    }

    // Input id
    if (filter.hasOwnProperty('id') && filter.id) {
      const id = escapeDoubleQuote(filter.id);
      const whereToLook = [
        'arxiv',
        'doi',
        'eisbn',
        'eissn',
        'halAuthorId',
        'halId',
        'idConditor',
        'isbn',
        'isni',
        'issn',
        'nnt',
        'orcId',
        'pmId',
        'ppn',
        'researcherId',
        'utKey',
        'viaf'
      ].map(item => field(item, group(id)));
      const luceneQueryForId = or(...whereToLook);
      fields.push(group(luceneQueryForId));
    }

    if (filter.hasOwnProperty('address') && filter.address) {
      const address = escapeDoubleQuote(filter.address);
      nestedLuceneQueryString.push(`authors>affiliations>"authors.affiliations.address:${address}"`);
    }

    // Checkbox source
    if (source.length > 0) fields.push(field('source', group(or(...source))));

    // Input dropdown type conditor
    if (filter.typeConditor !== 'Tous les types') fields.push(field('typeConditor', filter.typeConditor));

    // Input range publicationDate
    if (filter.publicationDate.min !== filter.publicationDate.options.floor || filter.publicationDate.max !== filter.publicationDate.options.ceil) {
      fields.push(field('xPublicationDate', range(filter.publicationDate.min.toString(), filter.publicationDate.max.toString(), true, true)));
    }

    const luceneQueryString = and(...fields);
    const output = {
      q: [`"${luceneQueryString}"`].concat(nestedLuceneQueryString).join(' ')
    };

    if (filter.hasOwnProperty('aggregationTerms')) {
      output.aggs = field(field('terms', filter.aggregationTerms.value), `{ name: ${filter.aggregationTerms.name}, size: 1000 }`);
      output.page_size = 0;
    } else {
      output.excludes = fieldsToExclude.join(',');
      output.page_size = CONFIG.apiConditor.pageSize;
      if (sort) output.sort = sort.query;
    }

    return queryString.stringify(output);
  }
}

function escapeDoubleQuote (text) {
  return text.replace(/"/g, '\\"');
}
