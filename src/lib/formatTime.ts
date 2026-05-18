export function formatAlertTime(timestamp?: string) {
  if (!timestamp) return 'N/A';
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
}
