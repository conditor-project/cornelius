import './sidebar.scss';
import template from './sidebar.template.html';
import angular from 'angular';
import metadataMapping from 'co-config/metadata-mappings.json';

export const sidebar = {
  controller: function (jwtModalService, jwtService) {
    this.$onInit = function () {
      this.filterOptions = {
        source: {
          hal: true,
          pubmed: true,
          sudoc: true,
          wos: true
        },
        score: 90,
        typeConditor: 'All'
      };
      const typeConditor = metadataMapping
        .map(source => Object.keys(source.mapping).map(key => source.mapping[key]))
        .reduce((accumulator, current) => accumulator.concat(current))
      ;
      const uniqTypeConditor = ['All', ...new Set(typeConditor)];
      this.typeConditor = uniqTypeConditor;
    };

    this.openJwtModal = function (options = { force: false }) {
      jwtModalService.open(options).then(() => this.apply());
    };

    this.apply = function () {
      if (!jwtService.getTokenJwt()) return this.openJwtModal({ force: true });
      const newFilterOptions = angular.copy(this.filterOptions);
      this.onFilterOptionsChange({ newFilterOptions });
    };
  },
  bindings: {
    onFilterOptionsChange: '&'
  },
  template
};
