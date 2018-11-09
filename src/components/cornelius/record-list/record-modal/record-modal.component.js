import './record-modal.scss';
import template from './record-modal.template.html';
import angular from 'angular';

export const recordModal = {
  controller: function ($q, $http, jwtService, API_CONDITOR_CONFIG) {
    this.$onInit = function () {
      this.record = this.resolve.record;
      this.recordsComparison = {};
      this.sizeColumnHeader = 6;
      this.getNearDuplicate().then(() => {
        const sizeColumnHeaderCalculated = Math.floor(12 / (this.nearDuplicateRecords.length + 1));
        this.sizeColumnHeader = (this.nearDuplicateRecords.length >= 6) ? 2 : sizeColumnHeaderCalculated;
        this.nearDuplicateRecordSelected = this.nearDuplicateRecords[0];
        Object.keys(this.record).map(key => {
          this.recordsComparison[key] = [this.record[key], this.nearDuplicateRecordSelected[key]];
        });
        console.log(this.recordsComparison);
      });
    };

    this.ok = function () {
      this.modalInstance.close();
    };

    this.getNearDuplicate = function () {
      $http.defaults.headers.common.Authorization = 'Bearer ' + jwtService.getTokenJwt();
      const nearDuplicateRecords = this.record.nearDuplicate.map(nearDuplicateRecord => {
        const requestUrl = API_CONDITOR_CONFIG.baseUrl + '/' + String(nearDuplicateRecord.idConditor) + '?exclude=teiBlob';
        return $http.get(requestUrl);
      });
      return $q.all(nearDuplicateRecords).then(responses => {
        this.nearDuplicateRecords = responses.map(response => response.data);
        this.nearDuplicateRecords.push(angular.copy(this.nearDuplicateRecords[0]));
      });
    };
  },
  bindings: {
    modalInstance: '<',
    resolve: '<'
  },
  template
};
