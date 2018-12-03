import './record-modal.scss';
import template from './record-modal.template.html';
import { diffWords } from 'diff';

export const recordModal = {
  controller: function ($q, conditorApiService) {
    this.$onInit = function () {
      this.record = this.resolve.record;
      this.recordsComparison = {};
      this.sizeColumnHeader = 6;
      this.getNearDuplicate().then(() => {
        const sizeColumnHeaderCalculated = Math.floor(12 / (this.nearDuplicateRecords.length + 1));
        this.sizeColumnHeader = (this.nearDuplicateRecords.length > 2) ? 3 : sizeColumnHeaderCalculated;
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

    this.ok = function () {
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
