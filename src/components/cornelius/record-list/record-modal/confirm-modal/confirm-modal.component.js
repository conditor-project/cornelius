import './confirm-modal.scss';
import template from './confirm-modal.template.html';

export const confirmModal = {
  controller: function (Notification) {
    this.$onInit = function () {
      this.record = this.resolve.record;
      this.nearDuplicateRecords = this.resolve.nearDuplicateRecords;
    };

    this.yes = function () {
      this.modalInstance.close();
      setTimeout(function () {
        Notification('Primary notification');
      }, 2000);
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
