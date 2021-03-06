import './jwt-modal.scss';
import template from './jwt-modal.template.html';
import jwtDecode from 'jwt-decode';

export const jwtModal = {
  controller: function ($http, jwtService, CONFIG) {
    this.$onInit = function () {
      this.loading = false;
      this.options = this.resolve.options || false;
      const tokenJwt = jwtService.getTokenJwt();
      const isTokenJwtExpired = checkTokenJwtIsExpired(tokenJwt);
      this.tokenJwt = (isTokenJwtExpired) ? '' : tokenJwt;
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
        jwtService.saveTokenJwt(this.tokenJwt);
        $http.get(`${CONFIG.apiConditor.baseUrl}/${CONFIG.apiConditor.routes.record}`)
          .then(() => {
            this.loading = false;
            this.modalInstance.close();
          })
          .catch(response => {
            this.loading = false;
            jwtService.removeTokenJwt(this.tokenJwt);
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

function checkTokenJwtIsExpired (tokenJwt) {
  const decodedTokenJwt = jwtDecode(tokenJwt);
  const expired = new Date(decodedTokenJwt.exp * 1000);
  const now = Date.now();
  const isTokenExpired = expired < now;
  return isTokenExpired;
}
