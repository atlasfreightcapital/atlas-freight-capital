import { cn } from "@/lib/utils";

interface AdminTableProps {
  columns: string[];
  rows: Array<Array<React.ReactNode>>;
  className?: string;
}

export function AdminTable({ columns, rows, className }: AdminTableProps) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-[#d1dad6] bg-white", className)}>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-left text-sm">
          <thead className="bg-[#eef3f1] text-xs uppercase tracking-wide text-[#56676f]">
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 font-semibold">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d1dad6] text-[#1d2a30]">
            {rows.map((row, index) => (
              <tr key={index} className="hover:bg-[#fbfcfa]">
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-4 align-top">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
