"use client";

import { useEffect, useState, useRef } from "react";

type Color = { uuid: string; colorName: string };
type Model = { uuid: string; modelName: string };
type Vehicle = {
  uuid?: string;
  id?: string;
  model?: { uuid: string; modelName: string } | null;
  color?: { uuid: string; colorName: string } | null;
  year?: number;
  imagePath?: string | null;
};

export default function DashboardPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [models, setModels] = useState<Model[]>([]);
  const [colors, setColors] = useState<Color[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const [selectedModel, setSelectedModel] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const yearRef = useRef<HTMLInputElement | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  const fetchLists = async () => {
    try {
      const [rVehicles, rModels, rColors] = await Promise.all([
        fetch("/api/vehicle", { cache: "no-store" }),
        fetch("/api/models", { cache: "no-store" }),
        fetch("/api/colors", { cache: "no-store" }),
      ]);

      if (!rVehicles.ok) throw new Error("Erro ao buscar vehicles");
      if (!rModels.ok) throw new Error("Erro ao buscar models");
      if (!rColors.ok) throw new Error("Erro ao buscar colors");

      const vehiclesData = await rVehicles.json();
      const modelsData = await rModels.json();
      const colorsData = await rColors.json();

      setVehicles(Array.isArray(vehiclesData) ? vehiclesData : vehiclesData?.payload ?? []);
      setModels(Array.isArray(modelsData) ? modelsData : modelsData?.payload ?? []);
      setColors(Array.isArray(colorsData) ? colorsData : colorsData?.payload ?? []);
    } catch (err: any) {
      console.error("fetchLists error:", err);
      setError(err.message || "Erro ao carregar dados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLists();
  }, []);

  const handleOpenForm = (vehicle?: Vehicle) => {
    setShowForm(true);
    setError(null);

    if (vehicle) {
      setEditingVehicle(vehicle);
      setSelectedModel(vehicle.model?.uuid ?? "");
      setSelectedColor(vehicle.color?.uuid ?? "");
      if (yearRef.current) yearRef.current.value = vehicle.year?.toString() ?? "";
    } else {
      setEditingVehicle(null);
      setSelectedModel("");
      setSelectedColor("");
      if (yearRef.current) yearRef.current.value = "";
    }
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingVehicle(null);
    setSelectedModel("");
    setSelectedColor("");
    if (yearRef.current) yearRef.current.value = "";
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleCreateOrUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedModel || !selectedColor || !yearRef.current?.value) {
      setError("model, color e year são obrigatórios");
      return;
    }

    try {
      if (editingVehicle?.uuid) {
        // PUT - update
        const body = {
          modelUuid: selectedModel,
          colorUuid: selectedColor,
          year: Number(yearRef.current.value),
        };

        const res = await fetch(`/api/vehicle/${editingVehicle.uuid}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || JSON.stringify(data));
      } else {
        // POST - create
        const form = new FormData();
        form.append("modelUuid", selectedModel);
        form.append("colorUuid", selectedColor);
        form.append("year", yearRef.current.value);
        if (fileRef.current?.files?.[0]) form.append("imagePath", fileRef.current.files[0]);

        const res = await fetch("/api/vehicle", {
          method: "POST",
          body: form,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || JSON.stringify(data));
      }

      await fetchLists();
      handleCloseForm();
    } catch (err: any) {
      console.error("vehicle create/update error:", err);
      setError(err.message || "Erro ao salvar vehicle");
    }
  };

  const handleDelete = async (uuid?: string) => {
    if (!uuid) return;
    if (!confirm("Deseja excluir este vehicle?")) return;
    try {
      const res = await fetch(`/api/vehicle/${uuid}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao excluir");
      await fetchLists();
    } catch (err) {
      console.error(err);
      alert("Erro ao excluir vehicle");
    }
  };

  if (loading) return <p style={{ padding: 20 }}>Carregando...</p>;
  if (error) return <p style={{ padding: 20, color: "red" }}>{error}</p>;

  return (
    <div style={{ padding: 20 }}>
      <h1>Vehicles</h1>
      <button onClick={() => handleOpenForm()} style={{ marginBottom: 12 }}>
        ➕ Adicionar
      </button>

      {showForm && (
        <div style={{ marginBottom: 16, padding: 12, border: "1px solid #ddd", borderRadius: 6 }}>
          <form onSubmit={handleCreateOrUpdate}>
            <div style={{ marginBottom: 8 }}>
              <label>Modelo</label>
              <br />
              <select value={selectedModel} onChange={(e) => setSelectedModel(e.target.value)}>
                <option value="">-- selecione --</option>
                {models.map((m) => (
                  <option key={m.uuid} value={m.uuid}>
                    {m.modelName}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label>Cor</label>
              <br />
              <select value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)}>
                <option value="">-- selecione --</option>
                {colors.map((c) => (
                  <option key={c.uuid} value={c.uuid}>
                    {c.colorName}
                  </option>
                ))}
              </select>
            </div>

            <div style={{ marginBottom: 8 }}>
              <label>Ano</label>
              <br />
              <input ref={yearRef} type="number" min="1900" max="2100" />
            </div>

            {!editingVehicle && (
              <div style={{ marginBottom: 8 }}>
                <label>Imagem (opcional)</label>
                <br />
                <input ref={fileRef} type="file" accept="image/*" />
              </div>
            )}

            <div style={{ display: "flex", gap: 8 }}>
              <button type="submit">{editingVehicle ? "Atualizar" : "Salvar"}</button>
              <button type="button" onClick={handleCloseForm}>
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Imagem</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Modelo</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Cor</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Ano</th>
            <th style={{ borderBottom: "1px solid #ccc", padding: 8 }}>Ações</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((v, idx) => (
            <tr key={v.uuid ?? idx}>
              <td style={{ padding: 8 }}>
                {v.imagePath ? <img src={v.imagePath} alt="img" style={{ width: 100 }} /> : <span>Sem imagem</span>}
              </td>
              <td style={{ padding: 8 }}>{v.model?.modelName ?? "-"}</td>
              <td style={{ padding: 8 }}>{v.color?.colorName ?? "-"}</td>
              <td style={{ padding: 8 }}>{v.year ?? "-"}</td>
              <td style={{ padding: 8 }}>
                <button onClick={() => handleOpenForm(v)} style={{ marginRight: 8 }}>
                  ✏️
                </button>
                <button onClick={() => handleDelete(v.uuid)} style={{ color: "red" }}>
                  🗑️
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
