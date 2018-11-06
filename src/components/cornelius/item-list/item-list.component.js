import './item-list.scss';
import template from './item-list.template.html';

export const itemList = {
  controller: function ($http, jwtService, API_CONDITOR_CONFIG) {
    $http.defaults.headers.common.Authorization = 'Bearer ' + jwtService.getTokenJwt();
    this.$onInit = function () {
      this.getRecords();
    };

    this.$onChanges = function () {
      this.getRecords();
    };

    this.getRecords = function () {
      const sources = Object.keys(this.filterOptions.source).filter(source => this.filterOptions.source[source]).join(' OR ');
      const requestUrl = API_CONDITOR_CONFIG.baseUrl + `/?q=source:(${sources})&exclude=teiBlob`;
      $http.get(requestUrl)
        .then((response) => {
          this.items = response.data;
        });
    };
  },
  bindings: {
    filterOptions: '<'
  },
  template
};
