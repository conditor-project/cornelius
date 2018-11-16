import './record-modal.scss';
import template from './record-modal.template.html';
import { diffWords } from 'diff';
import { mappings } from 'co-config/mapping.json';

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
          const fieldsToIgnore = Object.keys(mappings.record.properties)
            .map(key => {
              mappings.record.properties[key].name = key;
              return mappings.record.properties[key];
            })
            .filter(property => (property.type === 'nested') || property.type === 'boolean')
            .filter(property => property.name !== 'nearDuplicate')
            .map(property => property.name)
            ;
          fieldsToIgnore.push('path', 'nearDuplicate', 'ingestId', 'creationDate', 'score', 'idChain', 'idConditor');
          if (fieldsToIgnore.includes(key)) return;
          let record = this.record[key];
          let nearDuplicateRecordSelected = this.nearDuplicateRecordSelected[key];
          record = (typeof record === 'string') ? record : String(record);
          nearDuplicateRecordSelected = (typeof nearDuplicateRecord === 'string') ? nearDuplicateRecordSelected : String(nearDuplicateRecordSelected);
          if ((record.length + nearDuplicateRecordSelected.length) === 0) return;
          const isEqual = (record === nearDuplicateRecordSelected);
          const averageNumberCharacters = (record.length + nearDuplicateRecordSelected.length) / 2;
          if (averageNumberCharacters < 3000) {
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
      });
    };
  },
  bindings: {
    modalInstance: '<',
    resolve: '<'
  },
  template
};
