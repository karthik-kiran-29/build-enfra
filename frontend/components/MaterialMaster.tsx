'use client'
import { useState } from 'react'
import { Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react'

const mockMaterials = [
  {
    id: '1',
    name: 'Portland Cement',
    category: 'Cement',
    unit: 'Bags',
    reorderPoint: 100,
    currentStock: 250,
    status: 'Active'
  },
  {
    id: '2',
    name: 'TMT Steel Bars',
    category: 'Steel',
    unit: 'Tonnes',
    reorderPoint: 5,
    currentStock: 12,
    status: 'Active'
  },
  {
    id: '3',
    name: 'Red Bricks',
    category: 'Masonry',
    unit: 'Numbers',
    reorderPoint: 5000,
    currentStock: 15000,
    status: 'Active'
  }
]

export default function MaterialMaster() {
  const [materials, setMaterials] = useState(mockMaterials)
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newMaterial, setNewMaterial] = useState({
    name: '',
    category: '',
    unit: '',
    reorderPoint: '',
    minStockLevel: ''
  })

  const filteredMaterials = materials.filter(material =>
    material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    material.category.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddMaterial = () => {
    const material = {
      id: Date.now().toString(),
      name: newMaterial.name,
      category: newMaterial.category,
      unit: newMaterial.unit,
      reorderPoint: parseInt(newMaterial.reorderPoint),
      currentStock: 0,
      status: 'Active'
    }
    setMaterials([...materials, material])
    setNewMaterial({ name: '', category: '', unit: '', reorderPoint: '', minStockLevel: '' })
    setShowAddModal(false)
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Material Master Management</h1>
        <p className="text-gray-600 mt-2">Add, edit, and view construction materials. Manage material-wise stock reports.</p>
      </div>

      {/* Search and Actions */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search for materials"
              className="input-field pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-3">
            <button className="btn-secondary flex items-center">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </button>
            <button 
              className="btn-primary flex items-center"
              onClick={() => setShowAddModal(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New Material
            </button>
          </div>
        </div>
      </div>

      {/* Materials Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Material Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unit
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reorder Point
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredMaterials.map((material) => (
                <tr key={material.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{material.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                      {material.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.unit}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {material.currentStock}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {material.reorderPoint}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                      {material.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-900">
                        <Eye className="h-4 w-4" />
                      </button>
                      <button className="text-gray-600 hover:text-gray-900">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 hover:text-red-900">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Material Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Material</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={newMaterial.name}
                  onChange={(e) => setNewMaterial({...newMaterial, name: e.target.value})}
                  placeholder="Enter material name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  className="select-field"
                  value={newMaterial.category}
                  onChange={(e) => setNewMaterial({...newMaterial, category: e.target.value})}
                >
                  <option value="">Select Category</option>
                  <option value="Cement">Cement</option>
                  <option value="Steel">Steel</option>
                  <option value="Masonry">Masonry</option>
                  <option value="Aggregates">Aggregates</option>
                  <option value="Wood">Wood</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Unit of Measurement
                </label>
                <select
                  className="select-field"
                  value={newMaterial.unit}
                  onChange={(e) => setNewMaterial({...newMaterial, unit: e.target.value})}
                >
                  <option value="">Select Unit</option>
                  <option value="Bags">Bags</option>
                  <option value="Tonnes">Tonnes</option>
                  <option value="Numbers">Numbers</option>
                  <option value="Cubic Meters">Cubic Meters</option>
                  <option value="Square Feet">Square Feet</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reorder Point
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={newMaterial.reorderPoint}
                  onChange={(e) => setNewMaterial({...newMaterial, reorderPoint: e.target.value})}
                  placeholder="Enter reorder level"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                className="btn-secondary"
                onClick={() => setShowAddModal(false)}
              >
                Cancel
              </button>
              <button
                className="btn-primary"
                onClick={handleAddMaterial}
                disabled={!newMaterial.name || !newMaterial.category || !newMaterial.unit}
              >
                Add Material
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}