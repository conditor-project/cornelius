import './confirm-modal.scss';
import template from './confirm-modal.template.html';
// import angular from 'angular';

export const confirmModal = {
  controller: function (notificationLogService, conditorApiService, $rootScope) {
    this.$onInit = function () {
      this.record = this.resolve.record;
      this.nearDuplicateRecords = this.resolve.nearDuplicateRecords;
    };

    this.confirm = function () {
      const duplicatesValidation = {
        recordId: this.record.idConditor,
        reportDuplicates: this.nearDuplicateRecords.filter(record => record.isDuplicateByUser).map(record => record.idConditor),
        reportNonDuplicates: this.nearDuplicateRecords.filter(record => !record.isDuplicateByUser).map(record => record.idConditor)
      };
      conditorApiService.postDuplicatesValidation(duplicatesValidation).then(response => {
        console.log(response);
        const message = 'Message de success';
        notificationLogService.add(message, 'success');
        $rootScope.$emit('refresh');
      }).catch(response => {
        console.log(response);
        const message = 'Message d\'erreur';
        notificationLogService.add(message, 'error');
      });
      this.modalInstance.close();
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
