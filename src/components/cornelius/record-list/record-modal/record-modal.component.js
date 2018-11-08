import './record-modal.scss';
import template from './record-modal.template.html';

export const recordModal = {
  controller: function ($q, $http, jwtService, API_CONDITOR_CONFIG) {
    this.$onInit = function () {
      this.record = this.resolve.record;
      console.log(this.record);
      this.getNearDuplicate().then(console.log);
    };

    this.ok = function () {
      this.modalInstance.close();
    };

    this.getNearDuplicate = function () {
      $http.defaults.headers.common.Authorization = 'Bearer ' + jwtService.getTokenJwt();
      const nearDuplicateRecords = this.record.nearDuplicate.map(nearDuplicateRecord => {
        const requestUrl = API_CONDITOR_CONFIG.baseUrl + '/' + String(nearDuplicateRecord.idConditor);
        return $http.get(requestUrl);
      });
      return $q.all(nearDuplicateRecords);
    };
  },
  bindings: {
    modalInstance: '<',
    resolve: '<'
  },
  template
};
