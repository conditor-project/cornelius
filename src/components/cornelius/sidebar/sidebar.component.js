import './sidebar.scss';
import template from './sidebar.template.html';
import angular from 'angular';

export const sidebar = {
  controller: function (jwtModalService, jwtService, conditorApiService) {
    this.$onInit = function () {
      this.filterOptionsOrigin = {
        source: {},
        typeConditor: 'Any'
      };
      this.filterOptions = angular.copy(this.filterOptionsOrigin);
      this.isSourceFormActive = false;
      this.isTypeConditorFormActive = false;
      this.initFilterOptions().catch(response => {
        if (response.status === 401) this.openJwtModal({ force: true });
        console.error(response);
      });
    };

    this.initFilterOptions = function () {
      return conditorApiService.getAggregationsTypeConditor(this.filterOptions).then(response => {
        const totalCount = response.data.aggregations.typeConditor.buckets
          .map(bucket => bucket.doc_count)
          .reduce((accumulator, currentValue) => accumulator + currentValue)
        ;
        this.typeConditor = [
          {
            key: this.filterOptionsOrigin.typeConditor,
            doc_count: totalCount
          },
          ...response.data.aggregations.typeConditor.buckets
        ];
        return conditorApiService.getAggregationsSource(this.filterOptions);
      }).then(response => {
        response.data.aggregations.source.buckets.map(bucket => {
          this.filterOptionsOrigin.source[bucket.key] = false;
        });
        this.filterOptions = angular.copy(this.filterOptionsOrigin);
        this.sources = response.data.aggregations.source.buckets;
      });
    };

    this.openJwtModal = function (options = { force: false }) {
      jwtModalService.open(options).then(() => {
        return this.initFilterOptions();
      }).then(() => {
        this.apply();
      });
    };

    this.apply = function () {
      if (!jwtService.getTokenJwt()) return this.openJwtModal({ force: true });
      const newFilterOptions = angular.copy(this.filterOptions);
      conditorApiService.getAggregationsSource(this.filterOptions).then(response => {
        this.sources.forEach(source => {
          source.doc_count = 0;
        });
        response.data.aggregations.source.buckets.map(bucket => {
          const source = this.sources.filter(source => source.key === bucket.key).pop();
          source.doc_count = bucket.doc_count;
        });
        return conditorApiService.getAggregationsTypeConditor(this.filterOptions);
      }).then(response => {
        this.typeConditor.forEach(typeConditor => {
          typeConditor.doc_count = 0;
        });
        const totalCount = response.data.aggregations.typeConditor.buckets
          .map(bucket => bucket.doc_count)
          .reduce((accumulator, currentValue) => accumulator + currentValue)
        ;
        this.typeConditor[0].doc_count = totalCount;
        response.data.aggregations.typeConditor.buckets.map(bucket => {
          const typeConditor = this.typeConditor.filter(typeConditor => typeConditor.key === bucket.key).pop();
          typeConditor.doc_count = bucket.doc_count;
        });
      }).then(() => {
        this.onFilterOptionsChange({ newFilterOptions });
      });
    };

    this.onChangeSourceForm = function () {
      this.isSourceFormActive = !angular.equals(this.filterOptions.source, this.filterOptionsOrigin.source);
    };

    this.onChangeTypeConditorForm = function () {
      this.isTypeConditorFormActive = !angular.equals(this.filterOptions.typeConditor, this.filterOptionsOrigin.typeConditor);
    };
  },
  bindings: {
    onFilterOptionsChange: '&'
  },
  template
};
