export const homeState = {
  name: 'home',
  url: '/home'
};

let numberModalOpened = 0;
export const recordState = {
  name: 'record',
  url: '/record/{idConditor}',
  params: {
    idConditor: null,
    data: null
  },
  onEnter: function ($stateParams, $state, $uibModal, $uibModalStack, conditorApiService, notificationLogService, jwtModalService) {
    Promise.resolve().then(() => {
      const isTheGoodRecord = ($stateParams.data) ? $stateParams.data.idConditor === $stateParams.idConditor : false;
      if ($stateParams.data && isTheGoodRecord) return $stateParams;
      return conditorApiService.getRecordById($stateParams.idConditor);
    }).then(response => {
      $uibModalStack.dismissAll();
      const modalInstance = $uibModal.open({
        component: 'recordModal',
        size: 'xl',
        resolve: {
          record: () => response.data
        }
      });
      numberModalOpened++;
      modalInstance.result
        .catch(() => console.info('Record modal dismissed'))
        .finally(() => {
          numberModalOpened--;
          if (numberModalOpened === 0) $state.go('home');
        });
    }).catch((response) => {
      if (response.status === 401) jwtModalService.open({ force: true });
      notificationLogService.add(`La notice demandée est introuvable`, 'error');
      if (numberModalOpened === 0) $state.go('home');
    });
  }
};
