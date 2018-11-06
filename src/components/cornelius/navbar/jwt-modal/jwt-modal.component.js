import template from './jwt-modal.template.html';

export const jwtModal = {
  controller: function (jwtService) {
    this.ok = function () {
      jwtService.addToken(this.tokenJwt);
      this.modalInstance.close(this.tokenJwt);
    };

    this.cancel = function () {
      this.modalInstance.dismiss('cancel');
    };
  },
  bindings: {
    modalInstance: '<'
  },
  template
};
