import * as XLSX from 'xlsx';

export type ExcelRow = Record<string, any>;

class ExcelReader {

  /**
   * Load Excel workbook once.
   */
  static loadWorkbook(
    filePath: string
  ): XLSX.WorkBook {

    try {
      return XLSX.readFile(filePath);
    } catch (error) {

      const message =
        error instanceof Error
          ? error.message
          : String(error);

      throw new Error(
        `Unable to read Excel file "${filePath}": ${message}`
      );
    }
  }


  /**
   * Read all rows from a particular sheet.
   */
  static getData<T extends ExcelRow>(
    workbook: XLSX.WorkBook,
    sheetName: string
  ): T[] {

    const sheet =
      workbook.Sheets[sheetName];

    if (!sheet) {
      throw new Error(
        `Sheet "${sheetName}" not found in Excel file`
      );
    }

    return XLSX.utils.sheet_to_json<T>(
      sheet,
      {
        // Blank Excel cells become ""
        defval: '',

        // Convert values to readable values
        raw: false
      }
    );
  }


  /**
   * Find one row using data_key.
   *
   * Example:
   * INST1
   * PROFILE1
   * PTYPE1
   */
  static getDataByKey<T extends ExcelRow>(
    data: T[],
    dataKey: string
  ): T {

    const row = data.find(
      item =>
        String(item.data_key ?? '').trim() ===
        String(dataKey ?? '').trim()
    );

    if (!row) {
      throw new Error(
        `Data key "${dataKey}" not found`
      );
    }

    return row;
  }
}

export default ExcelReader;