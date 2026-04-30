import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { carrierInvoiceStage } from "@/lib/carrier-data";
import { formatCurrency } from "@/lib/utils";

export interface CarrierInvoiceRow {
  id: string;
  invoiceNumber: string;
  loadNumber: string;
  broker: string;
  amount: number;
  status: string;
  submittedAt: string;
  expectedPayDate: string;
}

export function InvoiceStatusTable({ invoices }: { invoices: CarrierInvoiceRow[] }) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#d1dad6] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="bg-[#eef3f1] text-xs uppercase tracking-wide text-[#56676f]">
            <tr>
              <th className="px-4 py-3 font-semibold">Invoice</th>
              <th className="px-4 py-3 font-semibold">Load</th>
              <th className="px-4 py-3 font-semibold">Broker</th>
              <th className="px-4 py-3 font-semibold">Amount</th>
              <th className="px-4 py-3 font-semibold">Stage</th>
              <th className="px-4 py-3 font-semibold">Submitted</th>
              <th className="px-4 py-3 font-semibold">Expected broker pay</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#d1dad6] text-[#1d2a30]">
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="hover:bg-[#fbfcfa]">
                <td className="px-4 py-4">
                  <Link href={`/carrier/invoices/${invoice.id}`} className="font-semibold text-[#0a7c86]">
                    {invoice.invoiceNumber}
                  </Link>
                </td>
                <td className="px-4 py-4">{invoice.loadNumber}</td>
                <td className="px-4 py-4">{invoice.broker}</td>
                <td className="px-4 py-4 font-semibold">{formatCurrency(invoice.amount)}</td>
                <td className="px-4 py-4">
                  <Badge
                    variant={
                      carrierInvoiceStage(invoice.status).key === "paid"
                        ? "success"
                        : carrierInvoiceStage(invoice.status).key === "needs_attention"
                          ? "warning"
                          : carrierInvoiceStage(invoice.status).key === "pending"
                            ? "info"
                            : "default"
                    }
                  >
                    {carrierInvoiceStage(invoice.status).label}
                  </Badge>
                </td>
                <td className="px-4 py-4 text-[#40515a]">{invoice.submittedAt}</td>
                <td className="px-4 py-4 text-[#40515a]">{invoice.expectedPayDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
