import './confirm-modal.scss';
import template from './confirm-modal.template.html';

export const confirmModal = {
  controller: function () {
    this.$onInit = function () {
      this.record = this.resolve.record;
      this.nearDuplicateRecords = this.resolve.nearDuplicateRecords;
    };

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
