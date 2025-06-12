'use client'
import { useState } from 'react'
import { Plus, Upload, Search, Calendar } from 'lucide-react'

export default function GRNManagement() {
  const [activeTab, setActiveTab] = useState('create')
  const [grnData, setGrnData] = useState({
    grnNumber: 'GRN/2025/001',
    supplier: '',
    date: '',
    location: '',
    materials: [
      { material: 'Cement', quantity: 100, unitPrice: 400, totalPrice: 40000 },
      { material: 'Steel Rods', quantity: 500, unitPrice: 60, totalPrice: 30000 },
      { material: 'Bricks', quantity: 2000, unitPrice: 8, totalPrice: 16000 }
    ],
    notes: ''
  })

  const addMaterialRow = () => {
    setGrnData({
      ...grnData,
      materials: [
        ...grnData.materials,
        { material: '', quantity: 0, unitPrice: 0, totalPrice: 0 }
      ]
    })
  }

  const updateMaterial = (index: number, field: string, value: any) => {
    const newMaterials = [...grnData.materials]
    newMaterials[index] = { ...newMaterials[index], [field]: value }
    
    if (field === 'quantity' || field === 'unitPrice') {
      newMaterials[index].totalPrice = newMaterials[index].quantity * newMaterials[index].unitPrice
    }
    
    setGrnData({ ...grnData, materials: newMaterials })
  }

  const totalAmount = grnData.materials.reduce((sum, material) => sum + material.totalPrice, 0)

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">GRN Management</h1>
        <p className="text-gray-600 mt-2">Manage your Goods Received Notes (GRNs) efficiently.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {['create', 'listing', 'import'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-2 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab === 'import' ? 'Excel Import' : tab} GRN
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Create GRN Tab */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  GRN Number
                </label>
                <input
                  type="text"
                  className="input-field bg-gray-50"
                  value={grnData.grnNumber}
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Supplier
                </label>
                <select
                  className="select-field"
                  value={grnData.supplier}
                  onChange={(e) => setGrnData({...grnData, supplier: e.target.value})}
                >
                  <option value="">Select Supplier</option>
                  <option value="ABC Cement Ltd">ABC Cement Ltd</option>
                  <option value="Steel Works Co">Steel Works Co</option>
                  <option value="Prime Builders">Prime Builders</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  className="input-field"
                  value={grnData.date}
                  onChange={(e) => setGrnData({...grnData, date: e.target.value})}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location/Site
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={grnData.location}
                  onChange={(e) => setGrnData({...grnData, location: e.target.value})}
                  placeholder="Enter site location"
                />
              </div>
            </div>
          </div>

          {/* Materials Table */}
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Materials</h3>
              <button
                onClick={addMaterialRow}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Material
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Unit Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Price</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {grnData.materials.map((material, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3">
                        <select
                          className="select-field"
                          value={material.material}
                          onChange={(e) => updateMaterial(index, 'material', e.target.value)}
                        >
                          <option value="">Select Material</option>
                          <option value="Cement">Cement</option>
                          <option value="Steel Rods">Steel Rods</option>
                          <option value="Bricks">Bricks</option>
                          <option value="Sand">Sand</option>
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          className="input-field"
                          value={material.quantity}
                          onChange={(e) => updateMaterial(index, 'quantity', parseInt(e.target.value))}
                          placeholder="0"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          className="input-field"
                          value={material.unitPrice}
                          onChange={(e) => updateMaterial(index, 'unitPrice', parseInt(e.target.value))}
                          placeholder="0.00"
                        />
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-medium text-gray-900">
                          ₹{material.totalPrice.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => {
                            const newMaterials = grnData.materials.filter((_, i) => i !== index)
                            setGrnData({...grnData, materials: newMaterials})
                          }}
                          className="text-red-600 hover:text-red-900"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-end">
                <div className="text-lg font-semibold text-gray-900">
                  Total Amount: ₹{totalAmount.toLocaleString()}
                </div>
              </div>
            </div>
          </div>

          {/* Notes and Actions */}
          <div className="card">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notes/Remarks
              </label>
              <textarea
                className="input-field"
                rows={3}
                value={grnData.notes}
                onChange={(e) => setGrnData({...grnData, notes: e.target.value})}
                placeholder="Enter any additional notes or remarks"
              />
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button className="btn-secondary">Save as Draft</button>
              <button className="btn-primary">Create GRN</button>
            </div>
          </div>
        </div>
      )}

      {/* Listing Tab */}
      {activeTab === 'listing' && (
        <div className="space-y-6">
          <div className="card">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search GRNs..."
                  className="input-field pl-10"
                />
              </div>
              <div className="flex space-x-3">
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <input
                    type="date"
                    className="input-field pl-10"
                    placeholder="From Date"
                  />
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">GRN Number</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Supplier</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">GRN/2025/001</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">2025-01-15</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">ABC Cement Ltd</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹86,000</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                      <button className="text-gray-600 hover:text-gray-900">Print</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Excel Import Tab */}
      {activeTab === 'import' && (
        <div className="space-y-6">
          <div className="card text-center">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-900">Upload Excel File</p>
                <p className="text-sm text-gray-500">
                  Choose an Excel file (.xlsx, .xls) to import GRN data
                </p>
              </div>
              <div className="mt-6">
                <input
                  type="file"
                  accept=".xlsx,.xls"
                  className="hidden"
                  id="excel-upload"
                />
                <label
                  htmlFor="excel-upload"
                  className="btn-primary cursor-pointer inline-flex items-center"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </label>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Excel Format Requirements</h3>
            <div className="prose text-sm text-gray-600">
              <p>Your Excel file should contain the following columns:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Supplier Name</li>
                <li>Material Name</li>
                <li>Quantity</li>
                <li>Unit Price</li>
                <li>Date (DD/MM/YYYY format)</li>
                <li>Invoice Reference (optional)</li>
                <li>Remarks (optional)</li>
              </ul>
            </div>
            <div className="mt-4">
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                Download Sample Template
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )}
