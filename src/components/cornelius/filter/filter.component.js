import './filter.scss';
import template from './filter.template.html';
import angular from 'angular';
import debounce from 'lodash.debounce';

export const filter = {
  controller: function (jwtModalService, jwtService, conditorApiService) {
    this.$onInit = function () {
      this.optionsOrigin = {
        source: {},
        typeConditor: 'Tous les types'
      };
      this.options = angular.copy(this.optionsOrigin);
      this.isSourceFormActive = false;
      this.isTypeConditorFormActive = false;
      this.initOptions().catch(response => {
        if (response.status === 401) this.openJwtModal({ force: true });
        console.error(response);
      });
    };

    this.initOptions = function () {
      return conditorApiService.getAggregationsTypeConditor(this.options).then(response => {
        const totalCount = response.data.aggregations.typeConditor.buckets
          .map(bucket => bucket.doc_count)
          .reduce((accumulator, currentValue) => accumulator + currentValue)
        ;
        this.typeConditor = [
          {
            key: this.optionsOrigin.typeConditor,
            doc_count: totalCount
          },
          ...response.data.aggregations.typeConditor.buckets
        ];
        return conditorApiService.getAggregationsSource(this.options);
      }).then(response => {
        response.data.aggregations.source.buckets.map(bucket => {
          this.optionsOrigin.source[bucket.key] = false;
        });
        this.options = angular.copy(this.optionsOrigin);
        this.sources = response.data.aggregations.source.buckets;
      });
    };

    this.openJwtModal = function (options = { force: false }) {
      jwtModalService.open(options).then(() => {
        return this.initOptions();
      }).then(() => {
        this.apply();
      });
    };

    this.apply = function () {
      if (!jwtService.getTokenJwt()) return this.openJwtModal({ force: true });
      const newOptions = angular.copy(this.options);
      conditorApiService.getAggregationsSource(this.options).then(response => {
        this.sources.forEach(source => {
          source.doc_count = 0;
        });
        response.data.aggregations.source.buckets.map(bucket => {
          const source = this.sources.filter(source => source.key === bucket.key).pop();
          source.doc_count = bucket.doc_count;
        });
        return conditorApiService.getAggregationsTypeConditor(this.options);
      }).then(response => {
        const typeConditorBuckets = response.data.aggregations.typeConditor.buckets;
        this.typeConditor.forEach(typeConditor => {
          typeConditor.doc_count = 0;
        });
        const totalCount = typeConditorBuckets.length === 0 ? 0 : response.data.aggregations.typeConditor.buckets
          .map(bucket => bucket.doc_count)
          .reduce((accumulator, currentValue) => accumulator + currentValue)
        ;
        this.typeConditor[0].doc_count = totalCount;
        typeConditorBuckets.map(bucket => {
          const typeConditor = this.typeConditor.filter(typeConditor => typeConditor.key === bucket.key).pop();
          typeConditor.doc_count = bucket.doc_count;
        });
      }).then(() => {
        this.onOptionsChange({ newOptions });
      });
    };

    this.onChangeTitleAbstractForm = debounce(function () {
      this.isTitleAbstractFormActive = Boolean(this.options.titleAbstract);
      this.apply();
    }, 400);

    this.onChangeAuthorForm = debounce(function () {
      this.isAuthorFormActive = Boolean(this.options.author);
      this.apply();
    }, 400);

    this.onChangeSourceForm = debounce(function () {
      this.isSourceFormActive = !angular.equals(this.options.source, this.optionsOrigin.source);
      this.apply();
    }, 200);

    this.onChangeTypeConditorForm = function () {
      this.isTypeConditorFormActive = !angular.equals(this.options.typeConditor, this.optionsOrigin.typeConditor);
      this.apply();
    };
  },
  bindings: {
    onOptionsChange: '&'
  },
  template
};
