import './record-modal.scss';
import template from './record-modal.template.html';
import { diffWords } from 'diff';

export const recordModal = {
  controller: function ($q, $uibModal, conditorApiService) {
    this.$onInit = function () {
      this.record = this.resolve.record;
      this.recordsComparison = {};
      this.sizeColumnHeaderRecord = 6;
      this.sizeColumnHeaderNested = 6;
      this.hasNearDuplicateRecordsToValidate = false;
      this.getNearDuplicate().then(() => {
        this.sizeColumnHeaderRecord = (this.nearDuplicateRecords.length > 2) ? 3 : Math.floor(12 / (this.nearDuplicateRecords.length + 1));
        this.sizeColumnHeaderNested = (this.nearDuplicateRecords.length > 2) ? 9 : this.sizeColumnHeaderRecord * this.nearDuplicateRecords.length;
        this.sizeColumnHeaderNearDuplicateRecords = (this.nearDuplicateRecords.length > 2) ? 4 : Math.floor(12 / this.nearDuplicateRecords.length);
        this.nearDuplicateRecordSelected = this.nearDuplicateRecords[0];
        this.nearDuplicateRecordSelected.isSelected = true;
        this.getComparisonInfos();
      });
    };

    this.selectNearDuplicateRecord = function (nearDuplicateRecord) {
      this.nearDuplicateRecordSelected.isSelected = false;
      nearDuplicateRecord.isSelected = true;
      this.nearDuplicateRecordSelected = nearDuplicateRecord;
      this.getComparisonInfos();
    };

    this.getComparisonInfos = function () {
      const recordKeys = Object.keys(this.record);
      const nearDuplicateRecordSelectedKeys = Object.keys(this.nearDuplicateRecordSelected);
      const keys = [...new Set(recordKeys.concat(nearDuplicateRecordSelectedKeys))];
      keys.map(key => {
        const notDisplay = ['_score', 'idConditor', 'nearDuplicate', 'isSelected', 'isDuplicateByUser'].includes(key);
        if (notDisplay) return;
        let record = this.record.hasOwnProperty(key) ? this.record[key] : '';
        let nearDuplicateRecordSelected = this.nearDuplicateRecordSelected.hasOwnProperty(key) ? this.nearDuplicateRecordSelected[key] : '';
        record = (typeof record === 'string') ? record : String(record);
        nearDuplicateRecordSelected = (typeof nearDuplicateRecord === 'string') ? nearDuplicateRecordSelected : String(nearDuplicateRecordSelected);
        if ((record.length + nearDuplicateRecordSelected.length) === 0) return;
        const isEqual = (record.toLowerCase() === nearDuplicateRecordSelected.toLowerCase());
        const averageNumberCharacters = (record.length + nearDuplicateRecordSelected.length) / 2;
        const maxSizeAbstract = 3000;
        const toCompare = !['source'].includes(key);
        if (averageNumberCharacters < maxSizeAbstract && toCompare) {
          const comparison = diffWords(record, nearDuplicateRecordSelected, { ignoreCase: true });
          const origin = comparison.filter(chunk => (!chunk.added));
          const target = comparison.filter(chunk => (!chunk.removed));
          this.recordsComparison[key] = [isEqual, origin, target];
        } else {
          const origin = [{ value: record }];
          const target = [{ value: nearDuplicateRecordSelected }];
          this.recordsComparison[key] = [isEqual, origin, target];
        }
      });
    };

    this.checkNearDuplicateRecordsToValidate = function () {
      this.hasNearDuplicateRecordsToValidate = Boolean(this.nearDuplicateRecords.filter(record => {
        return (record.hasOwnProperty('isDuplicateByUser') && record.isDuplicateByUser !== null);
      }).length);
    };

    this.save = function () {
      if (!this.hasNearDuplicateRecordsToValidate) return;
      $uibModal.open({
        component: 'confirmModal',
        resolve: {
          record: () => this.record,
          nearDuplicateRecords: () => this.nearDuplicateRecords
        }
      }).result.then(() => {
        this.modalInstance.close();
      }).catch(() => console.info('Confirm modal dismissed'));
    };

    this.cancel = function () {
      this.modalInstance.close();
    };

    this.getNearDuplicate = function () {
      const nearDuplicateRecords = this.record.nearDuplicate.map(nearDuplicateRecord => {
        return conditorApiService.getRecordById(nearDuplicateRecord.idConditor);
      });
      return $q.all(nearDuplicateRecords).then(responses => {
        this.nearDuplicateRecords = responses.map(response => {
          response.data.isSelected = false;
          return response.data;
        });
      });
    };
  },
  bindings: {
    modalInstance: '<',
    resolve: '<'
  },
  template
};
