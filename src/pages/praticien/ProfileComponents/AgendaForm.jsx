// AgendaForm.js
import React, { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

/**
 * Composant AgendaForm
 * Props:
 *   - initialData: { title: string, date: string }
 *   - onSave: function(formData)
 *   - onCancel: function()
 */
const AgendaForm = ({ initialData = { title: "", date: "" }, onSave, onCancel }) => {
  const [formData, setFormData] = useState(initialData);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card className="border rounded bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Édition de l'agenda</CardTitle>
          <Button variant="ghost" size="sm" onClick={onCancel} className="text-xs">
            Retour
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Titre</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border rounded p-2 text-sm"
              placeholder="Nom de l'agenda"
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-xs font-medium mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="border rounded p-2 text-sm"
              required
            />
          </div>
          <Button type="submit" className="self-end text-xs">
            Enregistrer
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export  default AgendaForm