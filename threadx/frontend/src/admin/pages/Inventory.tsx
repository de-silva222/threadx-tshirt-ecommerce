import { useEffect, useState } from 'react'
import { adminService } from '@/services/admin'

export default function AdminInventory() {
  const [rows, setRows] = useState<any[]>([])

  function load() { adminService.inventory.list().then(setRows) }
  useEffect(() => { load() }, [])

  async function updateStock(variantId: number, value: string) {
    const stock = parseInt(value, 10)
    if (isNaN(stock) || stock < 0) return
    await adminService.inventory.updateStock(variantId, stock)
    load()
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Inventory</h1>
      <div className="overflow-x-auto bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="border-b border-ink/10 text-left text-xs uppercase tracking-wide text-ink/40">
            <tr><th className="p-4">Product</th><th className="p-4">SKU</th><th className="p-4">Variant</th><th className="p-4">Stock</th><th className="p-4">Status</th></tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id} className="border-b border-ink/5">
                <td className="p-4 font-medium">{r.product_name}</td>
                <td className="p-4 text-ink/50">{r.sku}</td>
                <td className="p-4">{r.color} / {r.size}</td>
                <td className="p-4">
                  <input
                    type="number"
                    defaultValue={r.stock}
                    onBlur={(e) => updateStock(r.id, e.target.value)}
                    className="w-20 border border-ink/15 px-2 py-1"
                  />
                </td>
                <td className="p-4">
                  {r.out_of_stock ? <span className="text-red-600 font-semibold">Out of stock</span> :
                    r.low_stock ? <span className="text-amber-600 font-semibold">Low stock</span> :
                    <span className="text-green-600">In stock</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
