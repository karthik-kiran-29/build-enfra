'use client'
import { useState, useEffect } from 'react'
import { Plus, Upload, Search, Calendar } from 'lucide-react'

type Material = {
    id: string
    name: string
    unit: string
    category: string
    minStockLevel: number
    createdAt: string
    updatedAt: string
}

type GRN = {
    id: string
    grnNumber: string
    date: string
    materialId: string
    quantity: number
    rate: number
    totalAmount: number
    supplierName: string
    invoiceRef: string
    receivedBy: string
    remarks: string
    createdAt: string
    updatedAt: string
    material: Material
}

export default function GRNManagement() {
    const [activeTab, setActiveTab] = useState('create')
    const [grns, setGrns] = useState<GRN[]>([])
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        materialId: '',
        quantity: '',
        rate: '',
        supplierName: '',
        invoiceRef: '',
        receivedBy: '',
        remarks: ''
    })

    // Fetch all GRNs
    useEffect(() => {
        if (activeTab === 'listing') {
            setLoading(true)
            fetch('http://localhost:3001/api/grns')
                .then(res => res.json())
                .then(data => setGrns(data))
                .finally(() => setLoading(false))
        }
    }, [activeTab])

    // Dummy materials for dropdown (replace with API if needed)
    const materials: Material[] = [
        {
            id: 'cmbt0qo5b0000z7o06mnmvvat',
            name: 'Marble',
            unit: 'Bags',
            category: 'Cement',
            minStockLevel: 90,
            createdAt: '',
            updatedAt: ''
        },
        {
            id: 'mat2',
            name: 'Cement',
            unit: 'Bags',
            category: 'Cement',
            minStockLevel: 50,
            createdAt: '',
            updatedAt: ''
        }
    ]

    // Handle form field change
    const handleFormChange = (field: string, value: string) => {
        setForm({ ...form, [field]: value })
    }

    // Calculate total
    const totalAmount =
        Number(form.quantity) && Number(form.rate)
            ? Number(form.quantity) * Number(form.rate)
            : 0

    // Handle create GRN
    const handleCreateGRN = async () => {
        const body = {
            materialId: form.materialId,
            quantity: form.quantity,
            rate: form.rate,
            supplierName: form.supplierName,
            invoiceRef: form.invoiceRef,
            receivedBy: form.receivedBy,
            remarks: form.remarks
        }
        const res = await fetch('http://localhost:3001/api/grns', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        })
        if (res.ok) {
            setForm({
                materialId: '',
                quantity: '',
                rate: '',
                supplierName: '',
                invoiceRef: '',
                receivedBy: '',
                remarks: ''
            })
            // Optionally, refresh listing
            if (activeTab === 'listing') {
                setLoading(true)
                fetch('http://localhost:3001/api/grns')
                    .then(res => res.json())
                    .then(data => setGrns(data))
                    .finally(() => setLoading(false))
            }
            alert('GRN Created!')
        }
    }

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
                                    Material
                                </label>
                                <select
                                    className="select-field"
                                    value={form.materialId}
                                    onChange={e => handleFormChange('materialId', e.target.value)}
                                >
                                    <option value="">Select Material</option>
                                    {materials.map(mat => (
                                        <option key={mat.id} value={mat.id}>
                                            {mat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Quantity
                                </label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={form.quantity}
                                    onChange={e => handleFormChange('quantity', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Rate
                                </label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={form.rate}
                                    onChange={e => handleFormChange('rate', e.target.value)}
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Supplier Name
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={form.supplierName}
                                    onChange={e => handleFormChange('supplierName', e.target.value)}
                                    placeholder="Enter supplier name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Invoice Reference
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={form.invoiceRef}
                                    onChange={e => handleFormChange('invoiceRef', e.target.value)}
                                    placeholder="Enter invoice reference"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Received By
                                </label>
                                <input
                                    type="text"
                                    className="input-field"
                                    value={form.receivedBy}
                                    onChange={e => handleFormChange('receivedBy', e.target.value)}
                                    placeholder="Enter receiver name"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Total */}
                    <div className="card">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Total</h3>
                        </div>
                        <div className="flex justify-end">
                            <div className="text-lg font-semibold text-gray-900">
                                Total Amount: ₹{totalAmount.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Notes and Actions */}
                    <div className="card">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Remarks
                            </label>
                            <textarea
                                className="input-field"
                                rows={3}
                                value={form.remarks}
                                onChange={e => handleFormChange('remarks', e.target.value)}
                                placeholder="Enter any additional remarks"
                            />
                        </div>
                        <div className="flex justify-end space-x-3 mt-6">
                            <button className="btn-secondary">Save as Draft</button>
                            <button className="btn-primary" onClick={handleCreateGRN}>
                                Create GRN
                            </button>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Material</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quantity</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rate</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Amount</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {loading ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-6">Loading...</td>
                                        </tr>
                                    ) : grns.length === 0 ? (
                                        <tr>
                                            <td colSpan={9} className="text-center py-6">No GRNs found.</td>
                                        </tr>
                                    ) : (
                                        grns.map(grn => (
                                            <tr key={grn.id}>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{grn.grnNumber}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grn.date.slice(0, 10)}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grn.supplierName}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grn.material?.name}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grn.quantity}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grn.rate}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{grn.totalAmount.toLocaleString()}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{grn.remarks}</td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button className="text-blue-600 hover:text-blue-900 mr-3">View</button>
                                                    <button className="text-gray-600 hover:text-gray-900">Print</button>
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
    )
}
