import './record-modal.scss';
import template from './record-modal.template.html';
import { diffWords } from 'diff';
// import angular from 'angular';

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
          if (typeof this.record[key] === 'string' && typeof this.nearDuplicateRecordSelected[key] === 'string') {
            const isEqual = (this.record[key] === this.nearDuplicateRecordSelected[key]);
            const median = (this.record[key].length + this.nearDuplicateRecordSelected[key].length) / 2;
            if (median > 50 && median < 5000) {
              const comparison = diffWords(this.record[key], this.nearDuplicateRecordSelected[key]);
              const origin = comparison.filter(chunk => (!chunk.added));
              const target = comparison.filter(chunk => (!chunk.removed));
              this.recordsComparison[key] = [isEqual, origin, target];
            } else {
              const origin = [{ value: this.record[key] }];
              const target = [{ value: this.nearDuplicateRecordSelected[key] }];
              this.recordsComparison[key] = [isEqual, origin, target];
            }
          }
        });
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
        // this.nearDuplicateRecords.push(angular.copy(this.nearDuplicateRecords[0]));
      });
    };
  },
  bindings: {
    modalInstance: '<',
    resolve: '<'
  },
  template
};
