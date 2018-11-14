import './record-list.scss';
import template from './record-list.template.html';

export const recordList = {
  controller: function ($uibModal, jwtService, conditorApiService) {
    this.$onChanges = function () {
      this.getRecords();
    };

    this.openJwtModal = function (options) {
      $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static',
        resolve: {
          options: () => options
        }
      }).result.then(() => {
        this.getRecords();
      });
    };

    this.openRecordModal = function (record) {
      $uibModal.open({
        component: 'recordModal',
        size: 'xl',
        resolve: {
          record: () => record
        }
      }).result.catch(() => console.info('Record modal dismissed '));
    };

    this.getRecords = function () {
      if (!jwtService.getTokenJwt()) return this.openJwtModal({ force: true });
      conditorApiService.getRecords(this.filterOptions).then((response) => {
        this.records = response.data;
      }).catch(response => {
        this.records = [];
        if (String(response.status)[0] === '4') this.openJwtModal({ force: true });
        // TODO: Manage code error 500
      });
    };
  },
  bindings: {
    filterOptions: '<'
  },
  template
};
