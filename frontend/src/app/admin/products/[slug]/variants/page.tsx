'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import api, { getAuthToken } from '@/lib/api'
import Link from 'next/link'

interface Variant {
  id?: number
  sku: string
  size: string
  color: string
  price: string
  compare_at_price: string
  stock_quantity: number
  low_stock_threshold: number
  image_main: string
  is_active: boolean
  images?: Array<{ id?: number; image_url: string; alt_text: string; position: number }>
}

export default function VariantsPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [product, setProduct] = useState<any>(null)
  const [variants, setVariants] = useState<Variant[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingVariant, setEditingVariant] = useState<Variant | null>(null)
  const [bulkMode, setBulkMode] = useState(false)
  const [formData, setFormData] = useState<Variant>({
    sku: '',
    size: '',
    color: '',
    price: '',
    compare_at_price: '',
    stock_quantity: 0,
    low_stock_threshold: 10,
    image_main: '',
    is_active: true,
    images: [],
  })

  useEffect(() => {
    if (!getAuthToken()) {
      router.push('/admin')
      return
    }
    fetchProduct()
  }, [slug])

  const fetchProduct = async () => {
    try {
      const response = await api.get(`/admin/products/${slug}/`)
      setProduct(response.data)
      setVariants(response.data.variants || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const generateSKU = (size?: string, color?: string) => {
    const productCode = product?.title?.substring(0, 3).toUpperCase() || 'PRD'
    const sizeCode = size ? size.substring(0, 2).toUpperCase() : 'XX'
    const colorCode = color ? color.substring(0, 2).toUpperCase() : 'XX'
    const randomNum = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
    return `${productCode}-${sizeCode}-${colorCode}-${randomNum}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (bulkMode && !editingVariant) {
        // Bulk create mode - split by commas and create all combinations
        const sizes = formData.size ? formData.size.split(',').map(s => s.trim()).filter(s => s) : ['']
        const colors = formData.color ? formData.color.split(',').map(c => c.trim()).filter(c => c) : ['']
        
        const variantsToCreate = []
        
        // Create all combinations
        for (const size of sizes) {
          for (const color of colors) {
            const variantData: any = {
              product: product.id,
              sku: generateSKU(size, color),
              size: size || null,
              color: color || null,
              price: parseFloat(formData.price),
              compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
              stock_quantity: formData.stock_quantity,
              low_stock_threshold: formData.low_stock_threshold,
              image_main: formData.image_main || null,
              is_active: formData.is_active,
            }
            
            // Include images data if provided
            if (formData.images && formData.images.length > 0) {
              variantData.images_data = formData.images.map((img, idx) => ({
                image_url: img.image_url,
                alt_text: img.alt_text || '',
                position: img.position !== undefined ? img.position : idx
              }))
            }
            
            variantsToCreate.push(variantData)
          }
        }
        
        // Create all variants
        await Promise.all(
          variantsToCreate.map(variantData => api.post('/admin/variants/', variantData))
        )
        
        alert(`Successfully created ${variantsToCreate.length} variants!`)
      } else {
        // Single variant mode
        const variantData: any = {
          product: product.id,
          sku: formData.sku || generateSKU(formData.size, formData.color),
          size: formData.size || null,
          color: formData.color || null,
          price: parseFloat(formData.price),
          compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
          stock_quantity: formData.stock_quantity,
          low_stock_threshold: formData.low_stock_threshold,
          image_main: formData.image_main || null,
          is_active: formData.is_active,
        }

        // Include images data if provided
        if (formData.images && formData.images.length > 0) {
          variantData.images_data = formData.images.map((img, idx) => ({
            image_url: img.image_url,
            alt_text: img.alt_text || '',
            position: img.position !== undefined ? img.position : idx
          }))
        }

        if (editingVariant?.id) {
          await api.put(`/admin/variants/${editingVariant.id}/`, variantData)
        } else {
          await api.post('/admin/variants/', variantData)
        }
      }

      setShowForm(false)
      setEditingVariant(null)
      setBulkMode(false)
      setFormData({
        sku: '',
        size: '',
        color: '',
        price: '',
        compare_at_price: '',
        stock_quantity: 0,
        low_stock_threshold: 10,
        image_main: '',
        is_active: true,
        images: [],
      })
      fetchProduct()
    } catch (err: any) {
      console.error('Error saving variant:', err)
      alert('Échec de l\'enregistrement: ' + (err.response?.data?.error || err.response?.data?.detail || err.message))
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette variante?')) return
    try {
      await api.delete(`/admin/variants/${id}/`)
      fetchProduct()
    } catch (err) {
      alert('Échec de la suppression')
    }
  }

  const handleEdit = (variant: Variant) => {
    setEditingVariant(variant)
    setBulkMode(false)
    setFormData({
      sku: variant.sku,
      size: variant.size || '',
      color: variant.color || '',
      price: variant.price,
      compare_at_price: variant.compare_at_price || '',
      stock_quantity: variant.stock_quantity,
      low_stock_threshold: variant.low_stock_threshold,
      image_main: variant.image_main || '',
      is_active: variant.is_active,
      images: variant.images || [],
    })
    setShowForm(true)
  }

  const addImage = () => {
    setFormData(prev => ({
      ...prev,
      images: [...(prev.images || []), { image_url: '', alt_text: '', position: (prev.images?.length || 0) }]
    }))
  }

  const updateImage = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images?.map((img, i) => i === index ? { ...img, [field]: value } : img)
    }))
  }

  if (loading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Chargement...</div></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link href={`/admin/products/${slug}`} className="text-xl font-semibold text-gray-900 hover:text-rose-600 transition flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Retour au Produit
          </Link>
        </div>
      </nav>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold text-gray-900">Variantes pour {product?.title}</h1>
          <button
            onClick={() => {
              setShowForm(true)
              setEditingVariant(null)
              setBulkMode(false)
              setFormData({
                sku: '',
                size: '',
                color: '',
                price: '',
                compare_at_price: '',
                stock_quantity: 0,
                low_stock_threshold: 10,
                image_main: '',
                is_active: true,
                images: [],
              })
            }}
            className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-6 py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 font-semibold shadow-md transition"
          >
            + Ajouter une Variante
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">{editingVariant ? 'Modifier' : 'Ajouter'} une Variante</h2>
              {!editingVariant && (
                <label className="flex items-center gap-3 cursor-pointer bg-rose-50 px-4 py-2 rounded-lg border border-rose-200">
                  <input
                    type="checkbox"
                    checked={bulkMode}
                    onChange={(e) => setBulkMode(e.target.checked)}
                    className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                  />
                  <span className="text-sm font-semibold text-gray-900">
                    Mode Création Multiple (séparer par virgules)
                  </span>
                </label>
              )}
            </div>
            
            {bulkMode && !editingVariant && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800">
                  <strong>Mode Création Multiple:</strong> Entrez plusieurs tailles et/ou couleurs séparées par des virgules.
                  Le système créera automatiquement toutes les combinaisons possibles.
                  <br/>
                  <span className="italic">Exemple: Tailles "S,M,L" et Couleurs "Rouge,Bleu" créera 6 variantes (S-Rouge, S-Bleu, M-Rouge, M-Bleu, L-Rouge, L-Bleu)</span>
                </p>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {!bulkMode && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-gray-900">
                      SKU {!editingVariant && <span className="text-gray-500 font-normal">(auto-généré si vide)</span>}
                    </label>
                    <input
                      type="text"
                      value={formData.sku}
                      onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      placeholder="Laissez vide pour auto-générer"
                    />
                  </div>
                )}
                <div className={bulkMode ? 'col-span-2' : ''}>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">
                    Prix (DA) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">
                    Tailles {bulkMode && <span className="text-rose-600">(séparer par ,)</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder={bulkMode ? "Ex: S,M,L,XL" : "Ex: M"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">
                    Couleurs {bulkMode && <span className="text-rose-600">(séparer par ,)</span>}
                  </label>
                  <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder={bulkMode ? "Ex: Rouge,Bleu,Vert" : "Ex: Rouge"}
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Quantité en Stock *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock_quantity}
                    onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-900">Prix Comparatif (DA)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compare_at_price}
                    onChange={(e) => setFormData({ ...formData, compare_at_price: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-900">URL Image Principale</label>
                  <input
                    type="url"
                    value={formData.image_main}
                    onChange={(e) => setFormData({ ...formData, image_main: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="flex items-center pt-2">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="mr-3 w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
                    />
                    <span className="text-sm font-semibold text-gray-900">Active</span>
                  </label>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <label className="block text-sm font-semibold text-gray-900">Images Additionnelles</label>
                  <button 
                    type="button" 
                    onClick={addImage} 
                    className="bg-rose-600 text-white px-4 py-2 rounded-lg hover:bg-rose-700 text-sm font-semibold transition"
                  >
                    + Ajouter une Image
                  </button>
                </div>
                {formData.images?.map((img, index) => (
                  <div key={index} className="flex gap-3 mb-3">
                    <input
                      type="url"
                      value={img.image_url}
                      onChange={(e) => updateImage(index, 'image_url', e.target.value)}
                      placeholder="URL de l'image"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <input
                      type="text"
                      value={img.alt_text}
                      onChange={(e) => updateImage(index, 'alt_text', e.target.value)}
                      placeholder="Texte alternatif"
                      className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-rose-500"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({
                        ...prev,
                        images: prev.images?.filter((_, i) => i !== index)
                      }))}
                      className="bg-red-100 text-red-700 hover:bg-red-200 px-4 py-2 rounded-lg font-semibold transition"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-200">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-rose-500 to-rose-600 text-white px-8 py-3 rounded-lg hover:from-rose-600 hover:to-rose-700 font-semibold shadow-md transition"
                >
                  {bulkMode ? 'Créer les Variantes' : editingVariant ? 'Mettre à Jour' : 'Créer la Variante'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false)
                    setEditingVariant(null)
                    setBulkMode(false)
                  }}
                  className="bg-gray-200 text-gray-800 px-8 py-3 rounded-lg hover:bg-gray-300 font-semibold transition"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">SKU</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Taille</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Couleur</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Prix</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {variants.length > 0 ? variants.map((variant) => (
                <tr key={variant.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{variant.sku}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{variant.size || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{variant.color || '-'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">{variant.price} DA</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{variant.stock_quantity}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => handleEdit(variant)}
                      className="text-rose-600 hover:text-rose-800 font-semibold mr-4 transition"
                    >
                      Modifier
                    </button>
                    <button
                      onClick={() => variant.id && handleDelete(variant.id)}
                      className="text-red-600 hover:text-red-800 font-semibold transition"
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Aucune variante trouvée. Cliquez sur "Ajouter une Variante" pour commencer.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
