'use client'
import { useState } from 'react'
import { Search, Calculator, Eye, Printer } from 'lucide-react'

const mockFifoData = {
  materialName: 'Portland Cement',
  unit: 'Bags',
  currentStock: 350,
  grnHistory: [
    { grnNumber: 'GRN/001', date: '2025-01-05', quantity: 100, remainingQty: 100, rate: 400, totalValue: 40000 },
    { grnNumber: 'GRN/002', date: '2025-01-10', quantity: 150, remainingQty: 150, rate: 450, totalValue: 67500 },
    { grnNumber: 'GRN/003', date: '2025-01-15', quantity: 100, remainingQty: 100, rate: 500, totalValue: 50000 }
  ]
}

export default function IssueNotes() {
  const [activeTab, setActiveTab] = useState('create')
  const [issueData, setIssueData] = useState({
    issueNumber: 'ISN/2025/001',
    date: '',
    material: '',
    requestedQuantity: '',
    issuedTo: '',
    purpose: '',
    approvedBy: ''
  })
  
  type FifoBreakdown = {
    breakdown: {
      grnNumber: string
      date: string
      quantity: number
      rate: number
      amount: number
    }[]
    totalQuantity: number
    totalAmount: number
    weightedAvgRate: string
    insufficientStock: boolean
  }
  
  const [fifoBreakdown, setFifoBreakdown] = useState<FifoBreakdown | null>(null)
  const [showFifoPreview, setShowFifoPreview] = useState(false)

  const calculateFifo = () => {
    const requestedQty = parseInt(issueData.requestedQuantity)
    if (!requestedQty || requestedQty <= 0) return

    let remainingToIssue = requestedQty
    const breakdown = []
    let totalAmount = 0

    for (const grn of mockFifoData.grnHistory) {
      if (remainingToIssue <= 0) break
      
      const qtyFromThisGrn = Math.min(remainingToIssue, grn.remainingQty)
      const amountFromThisGrn = qtyFromThisGrn * grn.rate
      
      breakdown.push({
        grnNumber: grn.grnNumber,
        date: grn.date,
        quantity: qtyFromThisGrn,
        rate: grn.rate,
        amount: amountFromThisGrn
      })
      
      totalAmount += amountFromThisGrn
      remainingToIssue -= qtyFromThisGrn
    }

    const weightedAvgRate = totalAmount / requestedQty
    
    setFifoBreakdown({
      breakdown,
      totalQuantity: requestedQty,
      totalAmount,
      weightedAvgRate: weightedAvgRate.toFixed(2),
      insufficientStock: remainingToIssue > 0
    })
    setShowFifoPreview(true)
  }

  return (
    <div className="p-6 min-h-screen bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Issue Notes Management</h1>
        <p className="text-gray-600 mt-2">Create and manage material issue notes with automatic FIFO calculations.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['create', 'listing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab} Issue Note
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Create Issue Note Tab */}
      {activeTab === 'create' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Issue Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Issue Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issue Number
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                    value={issueData.issueNumber}
                    readOnly
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.date}
                    onChange={(e) => setIssueData({...issueData, date: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.material}
                    onChange={(e) => setIssueData({...issueData, material: e.target.value})}
                  >
                    <option value="">Select Material</option>
                    <option value="cement">Portland Cement</option>
                    <option value="steel">TMT Steel Bars</option>
                    <option value="bricks">Red Bricks</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quantity to Issue
                  </label>
                  <div className="flex">
                    <input
                      type="number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={issueData.requestedQuantity}
                      onChange={(e) => setIssueData({...issueData, requestedQuantity: e.target.value})}
                      placeholder="Enter quantity"
                    />
                    <button
                      onClick={calculateFifo}
                      className="px-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 border border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!issueData.material || !issueData.requestedQuantity}
                    >
                      <Calculator className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issued To (Project/Department)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.issuedTo}
                    onChange={(e) => setIssueData({...issueData, issuedTo: e.target.value})}
                    placeholder="Enter project or department"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Approved By
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.approvedBy}
                    onChange={(e) => setIssueData({...issueData, approvedBy: e.target.value})}
                    placeholder="Enter approver name"
                  />
                </div>
              </div>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Purpose
                </label>
                <textarea
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={issueData.purpose}
                  onChange={(e) => setIssueData({...issueData, purpose: e.target.value})}
                  placeholder="Enter purpose of issue"
                  rows={3}
                />
              </div>
            </div>

            {/* FIFO Breakdown */}
            {showFifoPreview && fifoBreakdown && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">FIFO Calculation Breakdown</h3>
                
                {fifoBreakdown.insufficientStock && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                    <p className="text-red-800 font-medium">
                      Insufficient Stock! Available: {mockFifoData.currentStock} {mockFifoData.unit}
                    </p>
                  </div>
                )}
                
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">GRN Number</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {fifoBreakdown.breakdown.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">{item.grnNumber}</td>
                          <td className="px-4 py-3 text-sm text-gray-500">{item.date}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">{item.quantity}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">₹{item.rate}</td>
                          <td className="px-4 py-3 text-sm text-gray-900">₹{item.amount.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-gray-50">
                      <tr>
                        <td colSpan={2} className="px-4 py-3 text-sm font-medium text-gray-900">Total</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">{fifoBreakdown.totalQuantity}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{fifoBreakdown.weightedAvgRate}</td>
                        <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{fifoBreakdown.totalAmount.toLocaleString()}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Save as Draft
              </button>
              <button 
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!showFifoPreview || !!(fifoBreakdown && fifoBreakdown.insufficientStock)}
              >
                Create Issue Note
              </button>
            </div>
          </div>

          {/* Right Column - Stock Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Stock</h3>
              {issueData.material ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Material:</span>
                    <span className="text-sm font-medium text-gray-900">{mockFifoData.materialName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Available:</span>
                    <span className="text-sm font-medium text-gray-900">{mockFifoData.currentStock} {mockFifoData.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Unit:</span>
                    <span className="text-sm font-medium text-gray-900">{mockFifoData.unit}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select a material to view stock information</p>
              )}
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">GRN History (FIFO Order)</h3>
              {issueData.material ? (
                <div className="space-y-3">
                  {mockFifoData.grnHistory.map((grn, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-900">{grn.grnNumber}</p>
                          <p className="text-xs text-gray-500">{grn.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{grn.remainingQty} {mockFifoData.unit}</p>
                          <p className="text-xs text-gray-500">₹{grn.rate}/{mockFifoData.unit}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select a material to view GRN history</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Listing Tab */}
      {activeTab === 'listing' && (
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search issue notes..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issue Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Issued To</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">ISN/2025/001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-01-18</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Portland Cement</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">120 Bags</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Project Alpha</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹49,000</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Printer className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}