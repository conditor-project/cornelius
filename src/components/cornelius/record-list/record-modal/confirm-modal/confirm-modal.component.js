import './confirm-modal.scss';
import template from './confirm-modal.template.html';

export const confirmModal = {
  controller: function (notificationLogService) {
    this.$onInit = function () {
      this.record = this.resolve.record;
      this.nearDuplicateRecords = this.resolve.nearDuplicateRecords;
    };

    this.yes = function () {
      this.modalInstance.close();
      setTimeout(function () {
        const isOk = Math.round(Math.random() * 10) > 5;
        if (isOk) {
          const message = 'Tout a bien été enregistré';
          notificationLogService.add(message, 'success');
        } else {
          const message = 'Le serveur invoque une defense talismanique et vous renvoie votre validation';
          notificationLogService.add(message, 'error');
        }
      }, 1000);
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
