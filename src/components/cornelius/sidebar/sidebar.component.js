import './sidebar.scss';
import template from './sidebar.template.html';
import angular from 'angular';

export const sidebar = {
  controller: function (jwtModalService, jwtService, conditorApiService) {
    this.$onInit = function () {
      this.filterOptionsOrigin = {
        source: {
          hal: false,
          pubmed: false,
          sudoc: false,
          wos: false
        },
        typeConditor: 'Any'
      };
      this.filterOptions = angular.copy(this.filterOptionsOrigin);
      this.isSourceFormActive = false;
      this.isTypeConditorFormActive = false;
      conditorApiService.getAggregationsTypeConditor()
        .then(response => {
          this.typeConditor = [
            this.filterOptionsOrigin.typeConditor,
            ...response.data.aggregations.typeConditor.buckets.map(bucket => bucket.key)
          ];
          return conditorApiService.getAggregationsSource();
        })
        .then(response => {
          this.sources = response.data.aggregations.source.buckets.map(bucket => bucket.key);
        })
        .catch(response => {
          if (response.status === 401) this.openJwtModal({ force: true });
          console.error(response);
        })
      ;
    };

    this.openJwtModal = function (options = { force: false }) {
      jwtModalService.open(options).then(() => this.apply());
    };

    this.apply = function () {
      if (!jwtService.getTokenJwt()) return this.openJwtModal({ force: true });
      const newFilterOptions = angular.copy(this.filterOptions);
      this.onFilterOptionsChange({ newFilterOptions });
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
