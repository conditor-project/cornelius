import template from './confirm-modal.template.html';

export const confirmModal = {
  controller: function () {
    this.yes = function () {
      this.modalInstance.close();
    };

    this.no = function () {
      this.modalInstance.dismiss();
    };
  },
  bindings: {
    modalInstance: '<',
    resolve: '<'
  },
  template
};
