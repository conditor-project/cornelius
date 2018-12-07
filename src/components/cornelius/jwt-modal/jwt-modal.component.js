import './jwt-modal.scss';
import template from './jwt-modal.template.html';

export const jwtModal = {
  controller: function ($http, jwtService, API_CONDITOR_CONFIG) {
    this.$onInit = function () {
      this.loading = false;
      this.options = this.resolve.options || false;
      this.tokenJwt = jwtService.getTokenJwt();
    };

    this.save = function () {
      this.loading = true;
      $http.defaults.headers.common.Authorization = 'Bearer ' + this.tokenJwt;
      $http.get(`${API_CONDITOR_CONFIG.baseUrl}/${API_CONDITOR_CONFIG.routes.record}`)
        .then(() => {
          this.loading = false;
          jwtService.saveTokenJwt(this.tokenJwt);
          this.modalInstance.close();
        })
        .catch(response => {
          this.loading = false;
          $http.defaults.headers.common.Authorization = '';
          if (String(response.status)[0] === '5') {
            this.msgErrors = {
              level: 'danger',
              text: 'Error server side'
            };
          }
          if (String(response.status)[0] === '4') {
            this.msgErrors = {
              level: 'warning',
              text: 'Invalid or expired token JWT'
            };
          }
        });
    };

    this.cancel = function () {
      this.modalInstance.close();
    };
  },
  bindings: {
    modalInstance: '<',
    resolve: '<'
  },
  template
};
