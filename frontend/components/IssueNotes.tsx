'use client'
import { useEffect, useState } from 'react'
import { Search, Calculator, Eye, Printer } from 'lucide-react'

type Material = {
  id: string
  name: string
  unit: string
  category: string
  minStockLevel: number
  createdAt: string
  updatedAt: string
}

type Issue = {
  id: string
  issueNumber: string
  date: string
  materialId: string
  totalQuantity: number
  weightedRate: number
  totalAmount: number
  issuedTo: string
  purpose: string | null
  approvedBy: string
  createdAt: string
  updatedAt: string
  material: Material
}

type PreviewResponse = {
  items: {
    grnNumber: string
    date: string
    quantity: number
    rate: number
    amount: number
  }[]
  totalQuantity: number
  weightedAverageRate: number
  totalAmount: number
  canFulfill: boolean
  availableStock: number
}

export default function IssueNotes() {
  const [activeTab, setActiveTab] = useState<'create' | 'listing' | 'preview'>('create')
  const [issues, setIssues] = useState<Issue[]>([])
  const [materials, setMaterials] = useState<Material[]>([])
  const [loading, setLoading] = useState(false)
  const [issueData, setIssueData] = useState({
    materialId: '',
    quantity: '',
    rate: '',
    supplierName: '',
    invoiceRef: '',
    receivedBy: '',
    remarks: '',
    issuedTo: '',
    approvedBy: '',
    purpose: ''
  })
  const [previewData, setPreviewData] = useState<PreviewResponse | null>(null)
  const [previewLoading, setPreviewLoading] = useState(false)
  const [createLoading, setCreateLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Fetch all issues
  useEffect(() => {
    setLoading(true)
    fetch('http://localhost:3001/api/issues')
      .then(res => res.json())
      .then(setIssues)
      .finally(() => setLoading(false))
  }, [])

  // Fetch all materials (for dropdown)
  useEffect(() => {
    fetch('http://localhost:3001/api/materials')
      .then(res => res.json())
      .then(setMaterials)
      .catch(() => setMaterials([]))
  }, [])

  // Handle preview
  const handlePreview = async () => {
    if (!issueData.materialId || !issueData.quantity) return
    setPreviewLoading(true)
    setPreviewData(null)
    setErrorMsg('')
    try {
      const res = await fetch('http://localhost:3001/api/issues/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: issueData.materialId,
          quantity: issueData.quantity
        })
      })
      const data = await res.json()
      setPreviewData(data)
      setActiveTab('preview')
    } catch {
      setErrorMsg('Failed to fetch preview')
    } finally {
      setPreviewLoading(false)
    }
  }

  // Handle create
  const handleCreate = async () => {
    setCreateLoading(true)
    setErrorMsg('')
    setSuccessMsg('')
    try {
      const res = await fetch('http://localhost:3001/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: issueData.materialId,
          quantity: issueData.quantity,
          rate: issueData.rate,
          supplierName: issueData.supplierName,
          invoiceRef: issueData.invoiceRef,
          receivedBy: issueData.receivedBy,
          remarks: issueData.remarks,
          issuedTo: issueData.issuedTo,
          approvedBy: issueData.approvedBy,
          purpose: issueData.purpose
        })
      })
      if (!res.ok) throw new Error('Failed to create issue')
      setSuccessMsg('Issue created successfully')
      setIssueData({
        materialId: '',
        quantity: '',
        rate: '',
        supplierName: '',
        invoiceRef: '',
        receivedBy: '',
        remarks: '',
        issuedTo: '',
        approvedBy: '',
        purpose: ''
      })
      setPreviewData(null)
      setActiveTab('listing')
      // Refresh issues
      fetch('http://localhost:3001/api/issues')
        .then(res => res.json())
        .then(setIssues)
    } catch {
      setErrorMsg('Failed to create issue')
    } finally {
      setCreateLoading(false)
    }
  }

  // Get selected material
  const selectedMaterial = materials.find(m => m.id === issueData.materialId)

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
            {['create', 'preview', 'listing'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'listing' ? 'List Issue Notes' : tab.charAt(0).toUpperCase() + tab.slice(1) + ' Issue Note'}
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
                    Material
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.materialId}
                    onChange={(e) => setIssueData({ ...issueData, materialId: e.target.value })}
                  >
                    <option value="">Select Material</option>
                    {materials.map((mat) => (
                      <option key={mat.id} value={mat.id}>{mat.name}</option>
                    ))}
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
                      value={issueData.quantity}
                      onChange={(e) => setIssueData({ ...issueData, quantity: e.target.value })}
                      placeholder="Enter quantity"
                    />
                    <button
                      onClick={handlePreview}
                      className="px-3 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 border border-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={!issueData.materialId || !issueData.quantity || previewLoading}
                      type="button"
                    >
                      <Calculator className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rate
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.rate}
                    onChange={(e) => setIssueData({ ...issueData, rate: e.target.value })}
                    placeholder="Enter rate"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Supplier Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.supplierName}
                    onChange={(e) => setIssueData({ ...issueData, supplierName: e.target.value })}
                    placeholder="Enter supplier name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Invoice Ref
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.invoiceRef}
                    onChange={(e) => setIssueData({ ...issueData, invoiceRef: e.target.value })}
                    placeholder="Enter invoice reference"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Received By
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.receivedBy}
                    onChange={(e) => setIssueData({ ...issueData, receivedBy: e.target.value })}
                    placeholder="Enter receiver name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Remarks
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.remarks}
                    onChange={(e) => setIssueData({ ...issueData, remarks: e.target.value })}
                    placeholder="Enter remarks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Issued To (Project/Department)
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={issueData.issuedTo}
                    onChange={(e) => setIssueData({ ...issueData, issuedTo: e.target.value })}
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
                    onChange={(e) => setIssueData({ ...issueData, approvedBy: e.target.value })}
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
                  onChange={(e) => setIssueData({ ...issueData, purpose: e.target.value })}
                  placeholder="Enter purpose of issue"
                  rows={3}
                />
              </div>
              {errorMsg && <div className="text-red-600 mt-2">{errorMsg}</div>}
              {successMsg && <div className="text-green-600 mt-2">{successMsg}</div>}
            </div>
            <div className="flex justify-end space-x-3">
              <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50">
                Save as Draft
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={
                  !issueData.materialId ||
                  !issueData.quantity ||
                  !issueData.rate ||
                  !issueData.issuedTo ||
                  !issueData.approvedBy ||
                  createLoading
                }
                onClick={handleCreate}
                type="button"
              >
                {createLoading ? 'Creating...' : 'Create Issue Note'}
              </button>
            </div>
          </div>
          {/* Right Column - Stock Info */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Stock</h3>
              {selectedMaterial ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Material:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMaterial.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Unit:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMaterial.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMaterial.category}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select a material to view stock information</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Preview Issue Note Tab */}
      {activeTab === 'preview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">FIFO Calculation Preview</h3>
              {previewLoading && <div>Loading preview...</div>}
              {previewData && (
                <>
                  {!previewData.canFulfill && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-800 font-medium">
                        Insufficient Stock! Available: {previewData.availableStock} {selectedMaterial?.unit}
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
                        {previewData.items.map((item, index) => (
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
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">{previewData.totalQuantity}</td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{previewData.weightedAverageRate.toFixed(2)}</td>
                          <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{previewData.totalAmount.toLocaleString()}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={() => setActiveTab('create')}
              >
                Back to Create
              </button>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Current Stock</h3>
              {selectedMaterial ? (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Material:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMaterial.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Unit:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMaterial.unit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Category:</span>
                    <span className="text-sm font-medium text-gray-900">{selectedMaterial.category}</span>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Select a material to view stock information</p>
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
                  // Add search logic if needed
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
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6">Loading...</td>
                    </tr>
                  ) : issues.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-6">No issues found.</td>
                    </tr>
                  ) : (
                    issues.map((issue) => (
                      <tr key={issue.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{issue.issueNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.date.slice(0, 10)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.material?.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{issue.totalQuantity} {issue.material?.unit}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{issue.issuedTo}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{issue.totalAmount.toLocaleString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-blue-600 hover:text-blue-900 mr-3">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Printer className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}