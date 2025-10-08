"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useDropzone } from "react-dropzone";
import { CldUploadWidget } from "next-cloudinary";
import { Plus, Trash2, Edit, X } from "lucide-react";

interface Sofa {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  type: string;
}

interface SofaType {
  id: string;
  name: string;
}

export default function SofasAdmin() {
  const [sofas, setSofas] = useState<Sofa[]>([]);
  const [types, setTypes] = useState<SofaType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSofa, setEditingSofa] = useState<Sofa | null>(null);
  const [newType, setNewType] = useState("");
  const [editingType, setEditingType] = useState<SofaType | null>(null);
  const router = useRouter();

  // Fetch sofas and types
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sofasRes, typesRes] = await Promise.all([
          fetch("/api/sofas"),
          fetch("/api/sofa-types"),
        ]);

        if (!sofasRes.ok || !typesRes.ok) {
          throw new Error("Failed to fetch data");
        }

        const [sofasData, typesData] = await Promise.all([
          sofasRes.json(),
          typesRes.json(),
        ]);

        setSofas(sofasData);
        setTypes(typesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle sofa form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSofa) return;

    try {
      const response = await fetch(`/api/sofas/${editingSofa.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editingSofa),
      });

      if (!response.ok) {
        throw new Error("Failed to update sofa");
      }

      const updatedSofa = await response.json();
      setSofas((prev) =>
        prev.map((sofa) =>
          sofa.id === updatedSofa.id ? updatedSofa : sofa
        )
      );
      setEditingSofa(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle sofa deletion
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this sofa?")) return;

    try {
      const response = await fetch(`/api/sofas/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete sofa");
      }

      setSofas((prev) => prev.filter((sofa) => sofa.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle type addition
  const handleAddType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newType.trim()) return;

    try {
      const response = await fetch("/api/sofa-types", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newType }),
      });

      if (!response.ok) {
        throw new Error("Failed to add type");
      }

      const addedType = await response.json();
      setTypes((prev) => [...prev, addedType]);
      setNewType("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  // Handle type deletion
  const handleDeleteType = async (id: string) => {
    if (!confirm("Are you sure you want to delete this type?")) return;

    try {
      const response = await fetch(`/api/sofa-types/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete type");
      }

      setTypes((prev) => prev.filter((type) => type.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Sofas Admin Panel</h1>

      {/* Types Management */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Manage Types</h2>
        <form onSubmit={handleAddType} className="flex gap-2 mb-4">
          <input
            type="text"
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            placeholder="New type name"
            className="border p-2 rounded"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Type
          </button>
        </form>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {types.map((type) => (
            <div
              key={type.id}
              className="border p-4 rounded flex justify-between items-center"
            >
              <span>{type.name}</span>
              <button
                onClick={() => handleDeleteType(type.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Sofas List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Manage Sofas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sofas.map((sofa) => (
            <div key={sofa.id} className="border p-4 rounded">
              {editingSofa?.id === sofa.id ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <input
                      type="text"
                      value={editingSofa.name}
                      onChange={(e) =>
                        setEditingSofa({ ...editingSofa, name: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      value={editingSofa.description}
                      onChange={(e) =>
                        setEditingSofa({
                          ...editingSofa,
                          description: e.target.value,
                        })
                      }
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price</label>
                    <input
                      type="number"
                      value={editingSofa.price}
                      onChange={(e) =>
                        setEditingSofa({
                          ...editingSofa,
                          price: parseFloat(e.target.value),
                        })
                      }
                      className="w-full border p-2 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Type</label>
                    <select
                      value={editingSofa.type}
                      onChange={(e) =>
                        setEditingSofa({ ...editingSofa, type: e.target.value })
                      }
                      className="w-full border p-2 rounded"
                    >
                      {types.map((type) => (
                        <option key={type.id} value={type.name}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Image</label>
                    <CldUploadWidget
                      uploadPreset="sofas"
                      onSuccess={(result: any) => {
                        setEditingSofa({
                          ...editingSofa,
                          image: result.info.secure_url,
                        });
                      }}
                    >
                      {({ open }) => (
                        <button
                          type="button"
                          onClick={() => open()}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        >
                          Upload Image
                        </button>
                      )}
                    </CldUploadWidget>
                    {editingSofa.image && (
                      <img
                        src={editingSofa.image}
                        alt="Preview"
                        className="mt-2 w-32 h-32 object-cover"
                      />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingSofa(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <img
                    src={sofa.image}
                    alt={sofa.name}
                    className="w-full h-48 object-cover mb-4"
                  />
                  <h3 className="font-semibold">{sofa.name}</h3>
                  <p className="text-gray-600 mb-2">{sofa.description}</p>
                  <p className="font-medium">${sofa.price}</p>
                  <p className="text-sm text-gray-500">Type: {sofa.type}</p>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setEditingSofa(sofa)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(sofa.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 