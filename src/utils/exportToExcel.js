import * as XLSX from 'xlsx-js-style';

// Helper: index kolom → huruf Excel (A, B, C, ...)
const columnIndexToLetter = (index) => {
  let letter = '';
  while (index >= 0) {
    letter = String.fromCharCode((index % 26) + 65) + letter;
    index = Math.floor(index / 26) - 1;
  }
  return letter;
};

export const exportToExcel = (data, fileName) => {
  if (!data || data.length === 0) return;

  // Buat worksheet dari data
  const worksheet = XLSX.utils.json_to_sheet(data);

  // Ambil header
  const headers = Object.keys(data[0]);

  // Cari kolom nominal (biaya / total_biaya)
  const totalColIndex = headers.findIndex(
    (key) => key === 'total_biaya' || key === 'biaya'
  );

  if (totalColIndex === -1) return;

  const totalColLetter = columnIndexToLetter(totalColIndex);
  const totalRowIndex = data.length + 2;

  // Hitung total
  const total = data.reduce((sum, item) => {
    return sum + Number(item.total_biaya || item.biaya || 0);
  }, 0);

  // Style TOTAL
  const totalStyle = {
    font: { bold: true, sz: 12 },
    alignment: { horizontal: 'center', vertical: 'center' },
    fill: { fgColor: { rgb: 'FFF9C4' } },
    border: {
      top: { style: 'thin', color: { rgb: '000000' } },
      bottom: { style: 'thin', color: { rgb: '000000' } },
      left: { style: 'thin', color: { rgb: '000000' } },
      right: { style: 'thin', color: { rgb: '000000' } },
    },
  };

  // Cell TOTAL (kolom pertama)
  worksheet[`A${totalRowIndex}`] = {
    v: 'TOTAL',
    t: 's',
    s: totalStyle,
  };

  // Cell total nominal (TEPAT DI BAWAH total_biaya / biaya)
  worksheet[`${totalColLetter}${totalRowIndex}`] = {
    v: total,
    t: 'n',
    s: totalStyle,
  };

  // Update range worksheet
  const range = XLSX.utils.decode_range(worksheet['!ref']);
  range.e.r = totalRowIndex - 1;
  worksheet['!ref'] = XLSX.utils.encode_range(range);

  // Lebar kolom
  worksheet['!cols'] = headers.map(() => ({ wch: 20 }));

  // Buat workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Laporan');

  // Export file
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};
