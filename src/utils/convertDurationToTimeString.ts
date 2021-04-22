export function ConvertDurationToTimeString(duration: number): string {
  const hours = Math.floor(duration / (60 * 60))
  const minutes = Math.floor((duration % (60 * 60)) / 60)
  const seconds = duration % 60

  return [hours, minutes, seconds]
    .map(unit => String(unit).padStart(2, '0'))
    .join(':')
}