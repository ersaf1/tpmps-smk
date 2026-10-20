import { read, utils, type WorkBook } from 'xlsx';
export type SheetInfo = { name: string; rows: number; columns: number };
export type SheetWindow = { row: number; column: number; columns: string[]; values: string[][] };
type Request = { id: number; type: 'load'; buffer: ArrayBuffer }
  | { id: number; type: 'window'; sheet: number; row: number; column: number };
type Reply = { id: number; sheets?: SheetInfo[]; window?: SheetWindow; error?: string };
const scope = globalThis as unknown as { onmessage: (event: MessageEvent<Request>) => void; postMessage: (reply: Reply) => void };
let workbook: WorkBook | null = null;
let sheets: SheetInfo[] = [];
scope.onmessage = ({ data }) => {
  try {
    if (data.type === 'load') {
      workbook = read(data.buffer, { type: 'array', raw: true, cellHTML: false, cellFormula: true, cellNF: true, bookVBA: false, bookDeps: false });
      sheets = workbook.SheetNames.map(name => {
        const sheet = workbook!.Sheets[name];
        const range = sheet['!ref'] ? utils.decode_range(sheet['!ref']) : null;
        return { name, rows: range ? range.e.r + 1 : 0, columns: range ? range.e.c + 1 : 0 };
      });
      scope.postMessage({ id: data.id, sheets });
    } else {
      if (!workbook || !sheets[data.sheet]) throw new Error('Sheet unavailable');
      const info = sheets[data.sheet];
      const sheet = workbook.Sheets[info.name];
      const rowCount = Math.max(0, Math.min(200, info.rows - data.row));
      const columnCount = Math.max(0, Math.min(40, info.columns - data.column));
      const values = Array.from({ length: rowCount }, (_, r) => Array.from({ length: columnCount }, (_, c) => {
        const cell = sheet[utils.encode_cell({ r: data.row + r, c: data.column + c })];
        if (!cell) return '';
        // Formulas are never evaluated; display stored values or the formula as text.
        return cell.v == null && cell.f ? `=${cell.f}` : utils.format_cell(cell);
      }));
      scope.postMessage({ id: data.id, window: { row: data.row, column: data.column,
        columns: Array.from({ length: columnCount }, (_, c) => utils.encode_col(data.column + c)), values } });
    }
  } catch {
    scope.postMessage({ id: data.id, error: 'Spreadsheet tidak dapat dibaca. File mungkin rusak atau dilindungi kata sandi.' });
  }
};
