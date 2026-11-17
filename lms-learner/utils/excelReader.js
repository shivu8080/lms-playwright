const xlsx = require('xlsx');

class ExcelReader {
  static getData(filePath, sheetName) {
    try {
      const workbook = xlsx.readFile(filePath);
      const sheet = workbook.Sheets[sheetName];

      if (!sheet) {
        throw new Error(`Sheet "${sheetName}" not found`);
      }

      return xlsx.utils.sheet_to_json(sheet);
    } catch (error) {
      console.error("Excel Read Error:", error.message);
      return [];
    }
  }
}

module.exports = ExcelReader;