import './record-list.scss';
import template from './record-list.template.html';

export const recordList = {
  controller: function ($uibModal, jwtModalService, jwtService, conditorApiService) {
    this.$onChanges = function () {
      this.getRecords();
    };

    this.openJwtModal = function (options = { force: false }) {
      jwtModalService.open(options).then(() => this.getRecords());
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
        this.totalRecords = response.headers('X-Total-Count');
        this.records = response.data;
      }).catch(response => {
        this.records = [];
        if (response.status === 401) this.openJwtModal({ force: true });
        // TODO: Manage code error 500
      });
    };
  },
  bindings: {
    filterOptions: '<'
  },
  template
};
