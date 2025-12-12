'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import api, { getAuthToken } from '@/lib/api'
import Link from 'next/link'

export default function AdminImportExportPage() {
  const router = useRouter()
  const [file, setFile] = useState<File | null>(null)
  const [importing, setImporting] = useState(false)
  const [importResult, setImportResult] = useState<any>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleImport = async () => {
    if (!file) {
      alert('Please select a file')
      return
    }

    if (!getAuthToken()) {
      router.push('/admin')
      return
    }

    try {
      setImporting(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/admin/import/products-csv/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      setImportResult(response.data)
      alert(`Import completed! ${response.data.imported} products imported.`)
      setFile(null)
    } catch (err: any) {
      alert('Import failed: ' + (err.response?.data?.error || err.message))
    } finally {
      setImporting(false)
    }
  }

  const handleExport = async () => {
    if (!getAuthToken()) {
      router.push('/admin')
      return
    }

    try {
      const response = await api.get('/admin/export/orders-csv/', {
        responseType: 'blob',
      })

      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `orders-${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      alert('Export failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link
            href="/admin/dashboard"
            className="text-2xl font-bold text-gray-800 hover:text-primary-600"
          >
            ← Admin Dashboard
          </Link>
          <Link
            href="/admin"
            className="text-red-600 hover:text-red-700 font-medium px-4 py-2 rounded hover:bg-red-50 transition"
          >
            Logout
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Import / Export</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Import Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Import Products (CSV)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload a CSV file to import products. CSV should include columns: title, slug,
              description, brand, sku, size, color, price, stock_quantity
            </p>
            <div className="space-y-4">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary-600 file:text-white hover:file:bg-primary-700 file:cursor-pointer"
              />
              <button
                onClick={handleImport}
                disabled={!file || importing}
                className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 disabled:bg-gray-400 font-medium shadow-md hover:shadow-lg transition"
              >
                {importing ? 'Importing...' : 'Import Products'}
              </button>
              {importResult && (
                <div className="mt-4 p-4 bg-green-50 rounded">
                  <p className="text-green-800">
                    <strong>Imported:</strong> {importResult.imported} products
                  </p>
                  {importResult.errors && importResult.errors.length > 0 && (
                    <div className="mt-2">
                      <p className="text-red-800">
                        <strong>Errors:</strong>
                      </p>
                      <ul className="list-disc list-inside text-sm">
                        {importResult.errors.slice(0, 5).map((error: string, idx: number) => (
                          <li key={idx}>{error}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Export Section */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Export Orders (CSV)</h2>
            <p className="text-sm text-gray-600 mb-4">
              Download all orders as a CSV file for analysis or backup.
            </p>
            <button
              onClick={handleExport}
              className="w-full bg-primary-600 text-white px-4 py-3 rounded-lg hover:bg-primary-700 font-medium shadow-md hover:shadow-lg transition"
            >
              Export Orders
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
