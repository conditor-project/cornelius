import './item-list.scss';
import template from './item-list.template.html';

export const itemList = {
  controller: function ($http, $uibModal, jwtService, API_CONDITOR_CONFIG) {
    this.$onChanges = function () {
      if (!jwtService.getTokenJwt()) return this.openJwtModal({ force: true });
      this.getRecords();
    };

    this.openJwtModal = function (options) {
      $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static',
        resolve: {
          options: () => options
        }
      }).result.then(() => {
        this.getRecords();
      });
    };

    this.getRecords = function () {
      $http.defaults.headers.common.Authorization = 'Bearer ' + jwtService.getTokenJwt();
      const sources = Object.keys(this.filterOptions.source).filter(source => this.filterOptions.source[source]).join(' OR ');
      let requestUrl = API_CONDITOR_CONFIG.baseUrl + `/?q=source:(${sources})`;
      if (this.filterOptions.typeConditor !== 'All') requestUrl += ` AND typeConditor:${this.filterOptions.typeConditor}`;
      requestUrl += '&exclude=teiBlob';
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
