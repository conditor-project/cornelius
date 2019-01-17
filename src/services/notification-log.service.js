export function notificationLogService (Notification) {
  const logs = [];
  return {
    add: (message, context = 'primary') => {
      logs.push({
        message,
        context,
        dateTime: Date.now()
      });
      Notification(message, context);
    },
    getAll: () => logs
  };
}
