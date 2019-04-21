import format from 'date-fns/format';

const transform = (timestamp) => {
  const string = format(timestamp, 'YYYY-MM-DD HH:mm:ss');
  const [result, year, month, day, hour, minute, second] = string.match(/^(\d+?)-(\d+?)-(\d+?)\s(\d+?):(\d+?):(\d+?)$/);
  return {
    year: Number(year),
    month: Number(month),
    day: Number(day),
    hour: Number(hour),
    minute: Number(minute),
    second: Number(second),
  };
}

export default {
  transform,
}