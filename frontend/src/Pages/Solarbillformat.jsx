import { useState } from "react";

export default function SolarGSTBill() {
  const [totalAmount, setTotalAmount] = useState("");

  const total = parseFloat(totalAmount) || 0;

  // 70% Goods, 30% Service
  const goodsTotal = total * 0.7;
  const serviceTotal = total * 0.3;

  const goodsTaxable = goodsTotal / 1.05;
  const goodsGST = goodsTotal - goodsTaxable;

  const serviceTaxable = serviceTotal / 1.18;
  const serviceGST = serviceTotal - serviceTaxable;

  const format = (num) =>
    num.toLocaleString("en-IN", {
      style: "currency",
      currency: "INR",
    });

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="mx-auto max-w-5xl rounded-xl bg-white p-6 md:p-8 shadow-lg">
        {/* Header */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Solar Project Tax Invoice
        </h2>

        {/* Input */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Enter Total Project Amount (₹)
          </label>
          <input
            type="number"
            placeholder="e.g. 216666.90"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="border px-3 py-2 text-left">Sr</th>
                <th className="border px-3 py-2 text-left">Description</th>
                <th className="border px-3 py-2 text-left">HSN / SAC</th>
                <th className="border px-3 py-2 text-left">Qty</th>
                <th className="border px-3 py-2 text-right">
                  Taxable Value (₹)
                </th>
                <th className="border px-3 py-2 text-right">GST (₹)</th>
                <th className="border px-3 py-2 text-right">Total (₹)</th>
              </tr>
            </thead>

            <tbody className="text-gray-800">
              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2">1</td>
                <td className="border px-3 py-2 leading-relaxed">
                  Solar Power Generating System <br />
                  <span className="text-xs text-gray-600">
                    (Panels, On-Grid Inverter, GI Structure, AC/DC Cables,
                    ACDB/DCDB, Net Meter – MNRE Norms)
                  </span>
                </td>
                <td className="border px-3 py-2">8541</td>
                <td className="border px-3 py-2">1</td>
                <td className="border px-3 py-2 text-right">
                  {format(goodsTaxable)}
                </td>
                <td className="border px-3 py-2 text-right">
                  {format(goodsGST)}{" "}
                  <span className="text-xs text-gray-500">(5%)</span>
                </td>
                <td className="border px-3 py-2 text-right font-medium">
                  {format(goodsTotal)}
                </td>
              </tr>

              <tr className="hover:bg-gray-50">
                <td className="border px-3 py-2">2</td>
                <td className="border px-3 py-2">
                  Installation, Commissioning & Labour Charges
                </td>
                <td className="border px-3 py-2">9954</td>
                <td className="border px-3 py-2">1</td>
                <td className="border px-3 py-2 text-right">
                  {format(serviceTaxable)}
                </td>
                <td className="border px-3 py-2 text-right">
                  {format(serviceGST)}{" "}
                  <span className="text-xs text-gray-500">(18%)</span>
                </td>
                <td className="border px-3 py-2 text-right font-medium">
                  {format(serviceTotal)}
                </td>
              </tr>
            </tbody>

            <tfoot>
              <tr className="bg-gray-100 font-bold text-gray-900">
                <td colSpan="6" className="border px-3 py-3 text-right">
                  Grand Total
                </td>
                <td className="border px-3 py-3 text-right text-lg">
                  {format(total)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
}
