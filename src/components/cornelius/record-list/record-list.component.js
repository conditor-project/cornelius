import './record-list.scss';
import template from './record-list.template.html';
import queryString from 'query-string';
import parseLinkHeader from 'parse-link-header';

export const recordList = {
  controller: function ($uibModal, jwtModalService, jwtService, conditorApiService) {
    this.$onChanges = function () {
      this.loading = false;
      this.currentPage = 1;
      this.pageSize = 1;
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
      }).result.catch(() => console.info('Record modal dismissed'));
    };

    this.getRecords = function () {
      this.loading = true;
      this.totalRecords = '...';
      if (!jwtService.getTokenJwt()) return this.openJwtModal({ force: true });
      conditorApiService.getRecords(this.filterOptions).then((response) => {
        this.loading = false;
        this.totalRecords = response.headers('X-Total-Count');
        this.records = response.data;
        this.pageSize = queryString.parse(queryString.extract(response.config.url)).page_size;
        this.links = parseLinkHeader(response.headers('Link'));
      }).catch(response => {
        this.loading = false;
        this.records = [];
        if (response.status === 401) this.openJwtModal({ force: true });
        // TODO: Manage code error 500
      });
    };

    this.paginateRecords = function (action) {
      this.currentPage = this.links[action].page;
      this.pageSize = this.links[action].page_size;
      conditorApiService.getRecordsFromUrl(this.links[action].url).then(response => {
        this.records = response.data;
        this.links = parseLinkHeader(response.headers('Link'));
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
