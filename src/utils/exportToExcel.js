import * as XLSX from 'xlsx-js-style';

export const exportToExcel = (data, fileName) => {
  if (!data || data.length === 0) return;

  const worksheet = XLSX.utils.json_to_sheet(data);

  const total = data.reduce((sum, item) => {
    const num = Number(item.total_biaya) || Number(item.biaya) || 0;
    return sum + num;
  }, 0);

  const totalRowIndex = data.length + 2;

  worksheet[`A${totalRowIndex}`] = {
    v: 'TOTAL',
    t: 's',
    s: {
      font: { bold: true, sz: 12 },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: 'FFF9C4' } }, // soft yellow
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    },
  };

  worksheet[`B${totalRowIndex}`] = {
    v: total,
    t: 'n',
    s: {
      font: { bold: true, sz: 12 },
      alignment: { horizontal: 'center', vertical: 'center' },
      fill: { fgColor: { rgb: 'FFF9C4' } }, // soft yellow
      border: {
        top: { style: 'thin', color: { rgb: '000000' } },
        bottom: { style: 'thin', color: { rgb: '000000' } },
        left: { style: 'thin', color: { rgb: '000000' } },
        right: { style: 'thin', color: { rgb: '000000' } },
      },
    },
  };

  const range = XLSX.utils.decode_range(worksheet['!ref']);
  range.e.r = totalRowIndex - 1;
  worksheet['!ref'] = XLSX.utils.encode_range(range);

  worksheet['!cols'] = Object.keys(data[0]).map(() => ({ wch: 20 }));

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');

  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
