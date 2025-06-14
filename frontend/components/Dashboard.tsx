'use client'
import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { AlertTriangle, Package, DollarSign, TrendingDown } from 'lucide-react'

type DashboardApiResponse = {
  totalMaterials: number
  totalGRNs: number
  totalIssues: number
  lowStockCount: number
  recentGRNs: any[]
  recentIssues: any[]
  lowStockMaterials: any[]
  totalStockValue: number
}

export default function Dashboard() {
  const [data, setData] = useState<DashboardApiResponse | null>(null)
  const [activeTab, setActiveTab] = useState<'grn' | 'issues'>('grn')

  useEffect(() => {
    fetch('http://localhost:3001/api/dashboard/summary')
      .then(res => res.json())
      .then(setData)
      .catch(() => setData(null))
  }, [])

  // Fallback for loading state
  if (!data) {
    return <div className="p-6">Loading...</div>
  }

  // Prepare summary
  const stockSummary = {
    totalMaterials: data.totalMaterials,
    totalStockValue: data.totalStockValue,
    lowStockItems: data.lowStockCount,
  }

  // Prepare low stock alerts
  const lowStockAlerts = data.lowStockMaterials.map((m) => ({
    name: m.name,
    currentStock: `${m.availableStock} ${m.unit}`,
    reorderLevel: `${m.minStockLevel} ${m.unit}`,
  }))

  // Prepare recent transactions
  const recentTransactions =
    activeTab === 'grn'
      ? data.recentGRNs.map((g) => ({
          date: new Date(g.date).toLocaleDateString(),
          material: g.material?.name || '',
          quantity: `${g.quantity} ${g.material?.unit || ''}`,
          type: 'grn',
        }))
      : data.recentIssues.map((i) => ({
          date: new Date(i.date).toLocaleDateString(),
          material: i.material?.name || '',
          quantity: `${i.totalQuantity} ${i.material?.unit || ''}`,
          type: 'issues',
        }))

  // Prepare top consumed (dummy, as not in API)
  const topConsumed = data.lowStockMaterials
    .map((m) => ({
      name: m.name,
      value: m.totalIssued || 0,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Overview of your construction inventory</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Materials</p>
              <p className="text-2xl font-bold text-gray-900">{stockSummary.totalMaterials}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Stock Value</p>
              <p className="text-2xl font-bold text-gray-900">₹{stockSummary.totalStockValue.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-lg">
              <TrendingDown className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Low Stock Items</p>
              <p className="text-2xl font-bold text-gray-900">{stockSummary.lowStockItems}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Low Stock Alerts */}
        <div className="card">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-5 w-5 text-red-500 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Low Stock Alerts</h2>
          </div>
          <div className="space-y-3">
            {lowStockAlerts.map((alert, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{alert.name}</p>
                  <p className="text-sm text-gray-600">Current: {alert.currentStock}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">Reorder: {alert.reorderLevel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h2>
          <div className="mb-4">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setActiveTab('grn')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'grn' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                GRN
              </button>
              <button
                onClick={() => setActiveTab('issues')}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  activeTab === 'issues' ? 'bg-white text-primary-600 shadow-sm' : 'text-gray-600'
                }`}
              >
                Issues
              </button>
            </div>
          </div>
          <div className="space-y-3">
            {recentTransactions.map((transaction, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{transaction.material}</p>
                  <p className="text-sm text-gray-600">{transaction.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{transaction.quantity}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Consumed Materials Chart */}
        <div className="card lg:col-span-2">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top Consumed Materials</h2>
          <div className="text-sm text-gray-600 mb-4">
            <span className="text-2xl font-bold text-gray-900">
              {topConsumed.reduce((sum, t) => sum + t.value, 0)}
            </span>
            <span className="text-green-600 ml-2">+0%</span>
            <span className="ml-1">Last Month</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topConsumed}>
                <XAxis dataKey="name" />
                <YAxis />
                <Bar dataKey="value" fill="#3b82f6" radius={4} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}