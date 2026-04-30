type CsvValue = string | number | boolean | null | undefined;

function escapeCsvValue(value: CsvValue) {
  if (value === null || value === undefined) return "";

  const text = String(value);
  if (!/[",\n\r]/.test(text)) return text;

  return `"${text.replaceAll('"', '""')}"`;
}

export function toCsv(rows: Record<string, CsvValue>[]) {
  if (rows.length === 0) return "";

  const headers = Object.keys(rows[0]);
  const body = rows.map((row) => headers.map((header) => escapeCsvValue(row[header])).join(","));

  return [headers.join(","), ...body].join("\n");
}

export function csvResponse(filename: string, rows: Record<string, CsvValue>[]) {
  return new Response(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
