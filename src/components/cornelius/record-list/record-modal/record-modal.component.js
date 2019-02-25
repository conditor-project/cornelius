import './record-modal.scss';
import template from './record-modal.template.html';
import { diffWords } from 'diff';
import get from 'lodash.get';
import angular from 'angular';

export const recordModal = {
  controller: function ($q, $uibModal, conditorApiService, CONFIG) {
    this.$onInit = function () {
      this.ready = false;
      this.hasNearDuplicates = false;
      this.record = this.resolve.record;
      this.recordsComparison = {};
      this.sizeColumnHeaderRecord = 6;
      this.sizeColumnHeaderNested = 6;
      this.hasNearDuplicateRecordsToValidate = false;
      getNearDuplicates(this.record, conditorApiService).then(nearDuplicates => {
        this.nearDuplicateRecords = nearDuplicates.map(response => {
          const output = angular.copy(response.data);
          output.isSelected = false;
          const nearDuplicate = this.record.nearDuplicates
            .filter(nearDuplicate => nearDuplicate.idConditor === response.data.idConditor)
            .pop();
          output.similarityRate = nearDuplicate.similarityRate;
          output.duplicateBySymmetry = nearDuplicate.duplicateBySymmetry;
          return output;
        });
        this.sizeColumnHeaderRecord = (this.nearDuplicateRecords.length > 2) ? 3 : Math.floor(12 / (this.nearDuplicateRecords.length + 1));
        this.sizeColumnHeaderNested = (this.nearDuplicateRecords.length > 2) ? 9 : this.sizeColumnHeaderRecord * this.nearDuplicateRecords.length;
        this.sizeColumnHeaderNearDuplicateRecords = (this.nearDuplicateRecords.length > 2) ? 4 : Math.floor(12 / this.nearDuplicateRecords.length);
        this.nearDuplicateRecordSelected = this.nearDuplicateRecords.length > 0 ? this.nearDuplicateRecords[0] : {};
        this.nearDuplicateRecordSelected.isSelected = true;
        this.recordsComparison = getComparisonInfos(this.record, this.nearDuplicateRecordSelected, CONFIG);
        this.hasNearDuplicates = this.nearDuplicateRecords.length > 0;
        this.ready = true;
      }).catch(console.error);
    };

    this.selectNearDuplicateRecord = function (nearDuplicateRecord) {
      this.nearDuplicateRecordSelected.isSelected = false;
      nearDuplicateRecord.isSelected = true;
      this.nearDuplicateRecordSelected = nearDuplicateRecord;
      this.recordsComparison = getComparisonInfos(this.record, this.nearDuplicateRecordSelected, CONFIG);
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
          const nearDuplicate = this.record.nearDuplicates
            .filter(nearDuplicate => nearDuplicate.idConditor === response.data.idConditor)
            .pop();
          output.similarityRate = nearDuplicate.similarityRate;
          output.duplicateBySymmetry = nearDuplicate.duplicateBySymmetry;
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

function getComparisonInfos (record, nearDuplicateRecordSelected, CONFIG) {
  const recordsComparison = {};
  const filteredSortedFields = new Set([
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
    'halId',
    'pmId',
    'ppn',
    'utKey',
    'documentType',
    'typeConditor'
  ]);
  filteredSortedFields.forEach(key => {
    let recordData = get(record, key, '');
    let nearDuplicateRecordData = get(nearDuplicateRecordSelected, key, '');
    recordData = (typeof recordData === 'string') ? recordData : String(recordData);
    nearDuplicateRecordData = (typeof nearDuplicateRecord === 'string') ? nearDuplicateRecordData : String(nearDuplicateRecordData);
    if ((recordData.length + nearDuplicateRecordData.length) === 0) return;
    const isEqual = (recordData.toLowerCase() === nearDuplicateRecordData.toLowerCase());
    const averageNumberCharacters = (recordData.length + nearDuplicateRecordData.length) / 2;
    const maxSizeAbstract = 3000;
    const toBeCompared = !['source'].includes(key);
    const origin = { raw: recordData };
    const target = { raw: nearDuplicateRecordData };
    if (averageNumberCharacters < maxSizeAbstract && toBeCompared) {
      const comparison = diffWords(recordData, nearDuplicateRecordData, { ignoreCase: true });
      origin.details = comparison.filter(chunk => (!chunk.added));
      target.details = comparison.filter(chunk => (!chunk.removed));
    }
    if (key === 'idHal') {
      if (recordData) origin.url = `${CONFIG.hal.baseUrl}/${recordData}`;
      if (nearDuplicateRecordData) target.url = `${CONFIG.hal.baseUrl}/${nearDuplicateRecordData}`;
    }
    if (key === 'pmId') {
      if (recordData) origin.url = `${CONFIG.pubmed.baseUrl}/${recordData}`;
      if (nearDuplicateRecordData) target.url = `${CONFIG.pubmed.baseUrl}/${nearDuplicateRecordData}`;
    }
    if (key === 'orcId') {
      if (recordData) origin.url = `${CONFIG.orcid.baseUrl}/${recordData}`;
      if (nearDuplicateRecordData) target.url = `${CONFIG.orcid.baseUrl}/${nearDuplicateRecordData}`;
    }
    recordsComparison[key] = [isEqual, origin, target];
  });
  return recordsComparison;
}

function getNearDuplicates (record, conditorApiService) {
  const nearDuplicateRecords = record.nearDuplicates.map(nearDuplicateRecord => {
    return conditorApiService.getRecordById(nearDuplicateRecord.idConditor);
  });
  return Promise.all(nearDuplicateRecords);
}
