import './confirm-modal.scss';
import template from './confirm-modal.template.html';
import has from 'lodash.has';

export const confirmModal = {
  controller: function (notificationLogService, conditorApiService, $rootScope) {
    this.$onInit = function () {
      this.record = this.resolve.record;
      this.nearDuplicateRecords = this.resolve.nearDuplicateRecords;
    };

    this.confirm = function () {
      const reportRecords = this.nearDuplicateRecords.filter(record => has(record, 'isDuplicateByUser'));
      const reportDuplicates = reportRecords.filter(record => record.isDuplicateByUser).map(record => record.idConditor);
      const reportNonDuplicates = reportRecords.filter(record => !record.isDuplicateByUser).map(record => record.idConditor);
      const duplicatesValidation = {
        recordId: this.record.idConditor,
        reportDuplicates,
        reportNonDuplicates
      };
      conditorApiService.postDuplicatesValidation(duplicatesValidation).then(() => {
        const message = `Le signalement de la notice (${this.record.sourceId}) a bien été enregistré.`;
        notificationLogService.add(message, 'success');
        $rootScope.$emit('refresh');
      }).catch(response => {
        if (has(response.data, 'errors')) {
          response.data.errors.map(error => {
            const message = `Le traitement du signalement de la notice (${this.record.sourceId}) n'a pas pu aboutir : ${error.statusName}, ${error.message} (${error.details})`;
            console.error(error);
            notificationLogService.add(message, 'error');
          });
        } else {
          const message = `Le traitement du signalement de la notice (${this.record.sourceId}) n'a pas pu aboutir : ${response.data}`;
          console.error(response);
          notificationLogService.add(message, 'error');
        }
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
