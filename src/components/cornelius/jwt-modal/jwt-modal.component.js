import './jwt-modal.scss';
import template from './jwt-modal.template.html';
import jwtDecode from 'jwt-decode';

export const jwtModal = {
  controller: function ($http, jwtService, API_CONDITOR_CONFIG) {
    this.$onInit = function () {
      this.loading = false;
      this.options = this.resolve.options || false;
      this.tokenJwt = jwtService.getTokenJwt();
    };

    this.save = function () {
      const decodedTokenJwt = jwtDecode(this.tokenJwt);
      const expired = new Date(decodedTokenJwt.exp * 1000);
      const now = Date.now();
      const isTokenExpired = expired < now;
      if (isTokenExpired) {
        this.msgErrors = {
          level: 'warning',
          text: `Le jeton JWT a expiré le ${expired.toLocaleString('fr-FR', { timeZone: 'UTC' })}`
        };
      } else {
        this.loading = true;
        $http.defaults.headers.common.Authorization = 'Bearer ' + this.tokenJwt;
        $http.get(`${API_CONDITOR_CONFIG.apiConditorBaseUrl}/${API_CONDITOR_CONFIG.routes.record}`)
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
                text: 'Le jeton JWT est invalide'
              };
            }
          });
      }
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
