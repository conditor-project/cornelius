import './sidebar.scss';
import template from './sidebar.template.html';
import angular from 'angular';
import metadataMapping from 'co-config/metadata-mappings.json';

export const sidebar = {
  controller: function (jwtModalService, jwtService) {
    this.$onInit = function () {
      this.filterOptionsOrigin = {
        source: {
          hal: false,
          pubmed: false,
          sudoc: false,
          wos: false
        },
        score: 90,
        typeConditor: 'Any'
      };
      this.filterOptions = angular.copy(this.filterOptionsOrigin);
      this.isSourceFormActive = false;
      this.isTypeConditorFormActive = false;
      const typeConditor = metadataMapping
        .map(source => Object.keys(source.mapping).map(key => source.mapping[key]))
        .reduce((accumulator, current) => accumulator.concat(current))
      ;
      const uniqTypeConditor = [this.filterOptionsOrigin.typeConditor, ...new Set(typeConditor)];
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
