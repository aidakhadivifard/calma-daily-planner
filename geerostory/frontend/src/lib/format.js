export function formatDuration(seconds) {
  if (!seconds) return '';
  const mins = Math.max(1, Math.round(seconds / 60));
  return `~${mins} min`;
}

export function formatTime(seconds) {
  const total = Math.max(0, Math.floor(seconds || 0));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
