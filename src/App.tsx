import { useState } from 'react'
import { optimizeCuts, WorkOrder, OptimizedCut } from '../src/Algorithm';
import './App.css'

function App() {
  const [orders, setOrders] = useState<WorkOrder[]>([]);
  const [results, setResults] = useState<OptimizedCut[]>([]);
  const [form, setForm] = useState<WorkOrder>({
    workOrder: '',
    job: 'Stock',
    cuts: 1,
    length: 0,
    material: 'Stainless Steel'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value });
  };

  const addOrder = () => {
    if (!form.length || !form.cuts || !form.workOrder) return;
    setOrders([...orders, form]);
    setForm({ workOrder: '', job: 'Stock', cuts: 1, length: 0, material: 'Stainless Steel' });
  };

  const runOptimization = () => {
    const result = optimizeCuts(orders);
    console.log('result: ', result);
    setResults(result);
  };

  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-bold mb-4">Cutting Optimizer</h2>
        <div className="form-fields grid grid-cols-1 md:grid-cols-5 gap-2 mb-4">
          <input name="workOrder" placeholder="Work Order" maxLength={6} inputMode='numeric' value={form.workOrder} onChange={handleChange} className="border p-2 rounded" />
          <select name="job" value={form.job} onChange={handleChange} className="border p-2 rounded">
            <option value="Job">Job</option>
            <option value="Stock">Stock</option>
          </select>
          <input name="cuts" type="number" placeholder="Cuts" value={form.cuts} onChange={handleChange} className="border p-2 rounded" />
          <input name="length" type="number" step="0.001" placeholder="Length (in)" value={form.length === 0 ? '' : form.length} onChange={handleChange} className="border p-2 rounded" />
          <select name="material" value={form.material} onChange={handleChange} className="border p-2 rounded">
            <option value="Stainless Steel">Stainless Steel</option>
            <option value="Carbon Steel">Carbon Steel</option>
          </select>
        </div>
        <div className='btn-cont'>
          <button onClick={addOrder} className="bg-blue-600 text-white px-4 py-2 rounded mr-2">Add Order</button>
          <button onClick={runOptimization} className="bg-green-600 text-white px-4 py-2 rounded">Optimize</button>
        </div>

        <h3 className="text-lg mt-6 font-semibold">Current Work Orders:</h3>
        <table className="table-auto border-collapse w-full mt-2 text-sm">
          <thead>
            <tr className="bg-gray-200">
              <th style={{ padding: "10px" }} className="border px-8 py-2">Work Order</th>
              <th style={{ padding: "10px" }} className="border px-8 py-2">Type</th>
              <th style={{ padding: "10px" }} className="border px-8 py-2">Cuts</th>
              <th style={{ padding: "10px" }} className="border px-8 py-2">Length (in)</th>
              <th style={{ padding: "10px" }} className="border px-8 py-2">Material</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={idx}>
                <td style={{ padding: "10px" }} className="border px-8 py-2">{order.workOrder}</td>
                <td style={{ padding: "10px" }} className="border px-8 py-2">{order.job}</td>
                <td style={{ padding: "10px" }} className="border px-8 py-2">{order.cuts}</td>
                <td style={{ padding: "10px" }} className="border px-8 py-2">{order.length}</td>
                <td style={{ padding: "10px" }} className="border px-8 py-2">{order.material}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {results.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold mb-2">Optimized Rounds:</h3>
            {results.map((round, index) => (
              <div key={index} className="mb-4 p-4 border rounded bg-gray-50">
                <p><strong>Round {round.round}</strong></p>
                <p>Bars: <strong>{round.bars}</strong></p>
                <p>Material: <strong>{round.material}</strong></p>
                <p>Pattern: <strong>{round.pattern.map(cut => `${cut.count} × ${cut.length}\"`).join(', ')}</strong></p>
                <p>Waste per Bar: <strong>{round.wastePerBar}"</strong></p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}

export default App
