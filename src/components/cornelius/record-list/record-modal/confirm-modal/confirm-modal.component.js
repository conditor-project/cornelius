import './confirm-modal.scss';
import template from './confirm-modal.template.html';

export const confirmModal = {
  controller: function (notificationLogService) {
    this.$onInit = function () {
      this.record = this.resolve.record;
      this.nearDuplicateRecords = this.resolve.nearDuplicateRecords;
    };

    this.confirm = function () {
      this.modalInstance.close();
      setTimeout(function () {
        const isOk = Math.round(Math.random() * 10) > 5;
        if (isOk) {
          const message = 'Message de succes généré aléatoirement';
          notificationLogService.add(message, 'success');
        } else {
          const message = 'Message d\'erreur généré aléatoirement';
          notificationLogService.add(message, 'error');
        }
      }, 1000);
    };

    this.goBack = function () {
      this.modalInstance.dismiss();
    };
  },
  bindings: {
    modalInstance: '<',
    resolve: '<'
  },
  template
};
