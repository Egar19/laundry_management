export const dateFormat = (isoString) => {
  const date = new Date(isoString);

  const witaDate = new Date(date.getTime() + 8 * 60 * 60 * 1000);

  return witaDate.toLocaleString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
};
