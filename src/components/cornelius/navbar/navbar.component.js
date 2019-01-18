import './navbar.scss';
import template from './navbar.template.html';

export const navbar = {
  controller: function ($uibModal, notificationLogService) {
    this.$onInit = function () {
      this.logs = notificationLogService.getAll();
    };
    this.openJwtModal = function () {
      $uibModal.open({
        component: 'jwtModal',
        backdrop: 'static'
      });
    };
    this.clearNotificationLogs = function () {
      this.logs = notificationLogService.clear();
    };
    this.deleteNotificationLogsEntry = function (entry) {
      this.logs = notificationLogService.deleteEntry(entry);
    };
  },
  template
};
