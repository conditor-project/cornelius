import './record-modal.scss';
import template from './record-modal.template.html';
import { diffWords } from 'diff';
import get from 'lodash.get';
import angular from 'angular';

export const recordModal = {
  controller: function ($q, $uibModal, conditorApiService, API_CONDITOR_CONFIG) {
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
      const recordsComparison = {};
      const sortedField = new Set([
        'source',
        'title.default',
        'title.en',
        'title.fr',
        'arxiv',
        'doi',
        'nnt',
        'reportNumber',
        'authorNames',
        'halAuthorId',
        'isni',
        'orcId',
        'researcherId',
        'viaf',
        'publicationDate',
        'title.journal',
        'title.monography',
        'title.meeting',
        'volume',
        'xissn',
        'issn',
        'eissn',
        'isbn',
        'eisbn',
        'issue',
        'specialIssue',
        'pageRange',
        'articleNumber',
        'meetAbstrNo',
        'part',
        'abstract',
        'idHal',
        'pmId',
        'ppn',
        'utKey',
        'documentType',
        'typeConditor'
      ]);
      sortedField.forEach(key => {
        let record = get(this.record, key, '');
        let nearDuplicateRecordSelected = get(this.nearDuplicateRecordSelected, key, '');
        record = (typeof record === 'string') ? record : String(record);
        nearDuplicateRecordSelected = (typeof nearDuplicateRecord === 'string') ? nearDuplicateRecordSelected : String(nearDuplicateRecordSelected);
        if ((record.length + nearDuplicateRecordSelected.length) === 0) return;
        const isEqual = (record.toLowerCase() === nearDuplicateRecordSelected.toLowerCase());
        const averageNumberCharacters = (record.length + nearDuplicateRecordSelected.length) / 2;
        const maxSizeAbstract = 3000;
        const toBeCompared = !['source'].includes(key);
        const origin = { raw: record };
        const target = { raw: nearDuplicateRecordSelected };
        if (averageNumberCharacters < maxSizeAbstract && toBeCompared) {
          const comparison = diffWords(record, nearDuplicateRecordSelected, { ignoreCase: true });
          origin.details = comparison.filter(chunk => (!chunk.added));
          target.details = comparison.filter(chunk => (!chunk.removed));
        }
        if (key === 'idHal') {
          if (record) origin.url = `${API_CONDITOR_CONFIG.halBaseUrl}/${record}`;
          if (nearDuplicateRecordSelected) target.url = `${API_CONDITOR_CONFIG.halBaseUrl}/${record}`;
        }
        if (key === 'pmId') {
          if (record) origin.url = `${API_CONDITOR_CONFIG.pubmedBaseUrl}/${record}`;
          if (nearDuplicateRecordSelected) target.url = `${API_CONDITOR_CONFIG.pubmedBaseUrl}/${record}`;
        }
        recordsComparison[key] = [isEqual, origin, target];
      });
      this.recordsComparison = recordsComparison;
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
      const nearDuplicateRecords = this.record.nearDuplicates.map(nearDuplicateRecord => {
        return conditorApiService.getRecordById(nearDuplicateRecord.idConditor);
      });
      return $q.all(nearDuplicateRecords).then(responses => {
        this.nearDuplicateRecords = responses.map(response => {
          const output = angular.copy(response.data);
          output.isSelected = false;
          output.similarityRate = this.record.nearDuplicates.filter(nearDuplicate => nearDuplicate.idConditor === response.data.idConditor).pop().similarityRate;
          return output;
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
