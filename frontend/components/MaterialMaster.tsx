'use client'
import { useState, useEffect } from 'react'
import { Search, Filter, Plus, Eye, Edit, Trash2 } from 'lucide-react'

type Material = {
    id: string
    name: string
    unit: string
    category: string
    minStockLevel: number
    createdAt: string
    updatedAt: string
}

const API_URL = 'http://localhost:3001/api/materials'

export default function MaterialMaster() {
    const [materials, setMaterials] = useState<Material[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddModal, setShowAddModal] = useState(false)
    const [newMaterial, setNewMaterial] = useState({
        name: '',
        category: '',
        unit: '',
        minStockLevel: ''
    })

    // Fetch materials from API
    useEffect(() => {
        fetch(API_URL)
            .then(res => res.json())
            .then(data => setMaterials(data))
            .catch(() => setMaterials([]))
    }, [])

    const filteredMaterials = materials.filter(material =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleAddMaterial = async () => {
        const payload = {
            name: newMaterial.name,
            category: newMaterial.category,
            unit: newMaterial.unit,
            minStockLevel: newMaterial.minStockLevel
        }
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        if (res.ok) {
            const created = await res.json()
            setMaterials([...materials, created])
            setNewMaterial({ name: '', category: '', unit: '', minStockLevel: '' })
            setShowAddModal(false)
        }
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
                                    Min Stock Level
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
                                        {material.minStockLevel}
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
                                    Min Stock Level
                                </label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={newMaterial.minStockLevel}
                                    onChange={(e) => setNewMaterial({...newMaterial, minStockLevel: e.target.value})}
                                    placeholder="Enter min stock level"
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
                                disabled={!newMaterial.name || !newMaterial.category || !newMaterial.unit || !newMaterial.minStockLevel}
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
