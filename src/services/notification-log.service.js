export function notificationLogService (Notification) {
  let logs = [];
  return {
    add: (message, context = 'info') => {
      logs.unshift({
        message,
        context,
        dateTime: Date.now()
      });
      Notification(message, context);
    },
    getAll: () => logs,
    clear: () => {
      logs = [];
      return logs;
    },
    deleteEntry: (entry) => {
      if (logs.includes(entry)) logs.splice(logs.indexOf(entry), 1);
      return logs;
    }
  };
}
