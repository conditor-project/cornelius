import './jwt-modal.scss';
import template from './jwt-modal.template.html';

export const jwtModal = {
  controller: function ($http, jwtService, API_CONDITOR_CONFIG) {
    this.$onInit = function () {
      this.loading = false;
      this.tokenJwt = jwtService.getTokenJwt();
    };

    this.ok = function () {
      this.loading = true;
      $http.defaults.headers.common.Authorization = 'Bearer ' + this.tokenJwt;
      $http.get(API_CONDITOR_CONFIG.url)
        .then(() => {
          this.loading = false;
          jwtService.saveTokenJwt(this.tokenJwt);
          this.modalInstance.close();
        })
        .catch(response => {
          this.loading = false;
          if (String(response.status)[0] === '5') {
            this.msgErrors = {
              level: 'danger',
              text: 'Error server side'
            };
          }
          if (String(response.status)[0] === '4') {
            this.msgErrors = {
              level: 'warning',
              text: 'Token JWT invalid'
            };
          }
        });
    };

    this.cancel = function () {
      this.modalInstance.close();
    };
  },
  bindings: {
    modalInstance: '<'
  },
  template
};
