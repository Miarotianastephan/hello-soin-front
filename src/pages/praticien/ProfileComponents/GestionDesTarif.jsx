import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { PenSquare, ArrowRightCircle, Save, Trash, PlusCircle } from 'lucide-react';

const practicesData = [
  { 
    id: 1, 
    name: 'Acupuncture',
    consultations: [
      { type: 'Premier RDV', duration: 60, price: 50 },
      { type: 'Suivi', duration: 30, price: 40 },
      { type: 'Urgence', duration: '', price: '' },
      { type: 'VAD (Visite à Domicile)', duration: 30, price: 45 },
    ],
    color: '#16a34a'
  },
  { 
    id: 2, 
    name: 'Naturopathie',
    consultations: [
      { type: 'Premier RDV', duration: 60, price: 55 },
      { type: 'Suivi', duration: 30, price: 45 },
      { type: 'Urgence', duration: '', price: '' },
      { type: 'VAD (Visite à Domicile)', duration: 30, price: 50 },
    ],
    color: '#10b981'
  },
  { 
    id: 3, 
    name: 'Ostéopathie',
    consultations: [
      { type: 'Premier RDV', duration: 45, price: 70 },
      { type: 'Suivi', duration: 30, price: 60 },
      { type: 'Urgence', duration: '', price: '' },
      { type: 'VAD (Visite à Domicile)', duration: 45, price: 80 },
    ],
    color: '#2563eb'
  },
  { 
    id: 4, 
    name: 'Thérapeute',
    consultations: [
      { type: 'Premier RDV', duration: 50, price: 60 },
      { type: 'Suivi', duration: 30, price: 50 },
      { type: 'Urgence', duration: '', price: '' },
      { type: 'VAD (Visite à Domicile)', duration: 30, price: 65 },
    ],
    color: '#dc2626'
  },
];

export default function GestionDesTarif() {
  const [practices, setPractices] = useState(() => {
    const saved = localStorage.getItem('practice2');
    const data = saved ? JSON.parse(saved) : practicesData;
    // Ajout de la propriété isDefault
    return data.map(practice => ({
      ...practice,
      consultations: practice.consultations.map(consultation => ({
        ...consultation,
        isDefault: [
          'Premier RDV', 
          'Suivi', 
          'Urgence', 
          'VAD (Visite à Domicile)'
        ].includes(consultation.type)
      }))
    }));
  });

  function handleAddConsultation() {
    const newConsultation = { 
      type: '', 
      duration: '', 
      price: '', 
      isDefault: false 
    };
    setFormValues(prev => ({
      ...prev,
      consultations: [...prev.consultations, newConsultation]
    }));
  }
// Dans la fonction handleDeleteConsultation : supprimer la vérification isDefault
function handleDeleteConsultation(index) {
  const updated = formValues.consultations.filter((_, i) => i !== index);
  setFormValues(v => ({ ...v, consultations: updated }));
}
  function handleChange(idx, field, value) {
    const updated = [...formValues.consultations];
    let newValue = value;

    if (field === 'duration' || field === 'price') {
      newValue = value === '' ? '' : parseInt(value, 10) || '';
    } else if (field === 'type') {
      newValue = value;
    }

    updated[idx] = { ...updated[idx], [field]: newValue };
    setFormValues(v => ({ ...v, consultations: updated }));
  }

  
  const [selected, setSelected] = useState(practices[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: selected?.name || '',
    consultations: selected?.consultations || [],
    color: selected?.color || '#009688',
  });

  // Update formValues when selected changes
  useEffect(() => {
    if (selected) {
      setFormValues({
        name: selected.name,
        consultations: selected.consultations,
        color: selected.color,
      });
    }
  }, [selected]);

  function handleEditClick() {
    setIsEditing(true);
  }

  function handleChange(idx, field, value) {
    const updated = [...formValues.consultations];
    let newValue = value;
    
    if (field === 'duration' || field === 'price') {
      newValue = value === '' ? '' : parseInt(value, 10) || '';
    }
    
    updated[idx] = { ...updated[idx], [field]: newValue };
    setFormValues(v => ({ ...v, consultations: updated }));
  }

  function handleColorChange(value) {
    setFormValues(v => ({ ...v, color: value }));
  }

  function handleSave() {
    const updatedPractices = practices.map(pr => {
      if (pr.id === selected.id) {
        return {
          ...pr,
          name: formValues.name,
          consultations: formValues.consultations,
          color: formValues.color
        };
      }
      return pr;
    });
    
    setPractices(updatedPractices);
    localStorage.setItem('practice2', JSON.stringify(updatedPractices));
    setIsEditing(false);
    setSelected(updatedPractices.find(p => p.id === selected.id));
  }

  return (
    <div className='w-full'>
      <main>
        <div className='flex space-x-6'>
          {/* List */}
          <div className='flex-1 w-2/5 border-r pr-4'>
            <ul className='space-y-2'>
              {practices.map(pr => (
                <li
                  key={pr.id}
                  onClick={() => { setSelected(pr); setIsEditing(false); }}
                  className={`flex items-center justify-between p-3 border rounded cursor-pointer ${
                    selected?.id === pr.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200'
                  }`}
                >
                  <div className='flex items-center space-x-2'>
                    <span 
                      style={{ backgroundColor: pr.color }}
                      className='h-10 w-10 border rounded'
                    />
                    <div>
                      <p className='font-medium text-xs'>{pr.name}</p>
                      <p className='text-xs text-gray-500'>
                        {pr.consultations.length} types de consultations
                      </p>
                    </div>
                  </div>
                  <Button variant='outline' size='sm' className='shadow-none rounded text-xs'>
                    Voir Détail <ArrowRightCircle />
                  </Button>
                </li>
              ))}
            </ul>
          </div>

          {/* Detail/Edit */}
          <div className='w-3/5 text-xs'>
            {!isEditing ? (
              <>
                <div className='flex items-center gap-2 mb-2'>
                  <span 
                    style={{ backgroundColor: selected?.color }}
                    className='h-10 w-10 border rounded'
                  />
                  <div>
                    <h4 className='font-semibold text-xs'>{selected?.name}</h4>
                    <Button 
                      size='sm' 
                      className='shadow-none rounded text-xs h-5' 
                      onClick={handleEditClick}
                    >
                      <PenSquare /> Modifier
                    </Button>
                  </div>
                </div>
                <Separator className='my-4' />
                <div className='space-y-2 text-gray-600'>
                  <p><span className='font-medium'>Spécialité : </span>{selected?.name}</p>
                  <p><span className='font-medium'>Lieu de pratique : </span>Cabinet 1 - Cabinet 2 - Cabinet 3</p>
                  <p><span className='font-medium'>À domicile - </span> Visio</p>
                </div>
                <Separator className='my-4' />
                <table className='w-full text-xs'>
                  <thead className='text-left bg-gray-200'>
                    <tr>
                      <th className='py-2 px-1'>Type de consultation</th>
                      <th className='py-2 px-1'>Durée (en minutes)</th>
                      <th className='py-2 px-1'>Tarif (en euros €)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected?.consultations?.map((c, i) => (
                      <tr key={i}>
                        <td className='px-1 py-2 border-b text-gray-600'>{c.type}</td>
                        <td className='px-1 py-2 border-b text-gray-600'>{c.duration || '-'}</td>
                        <td className='px-1 py-2 border-b text-gray-600'>{c.price ? `${c.price} €` : '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            ) : (
              <form className='space-y-2'>
                <div className='flex gap-2 justify-start items-center'>
                  <label className='block text-sm  text-gray-700 font-bold'>Spécialité</label>
                  <span className={`bg-gray-100 text-xs p-1 rounded`}>{formValues.name}</span>
                </div>

                <div className='flex items-center space-x-2'>
                  <div>
                    <input
                      type='color'
                      value={formValues.color}
                      onChange={e => handleColorChange(e.target.value)}
                      className='rounded border-none'
                    />
                  </div>
                  <div>
                    <input
                      type='text'
                      value={formValues.color}
                      onChange={e => handleColorChange(e.target.value)}
                      className='text-xs w-1/2 shadow-none rounded p-1 border'
                    />
                  </div>
                </div>

                {formValues.consultations.map((c, idx) => (
  <div key={idx} className="flex items-start space-x-2">
    {/* Colonne 1 – Type */}
    <div className="w-1/4 space-y-1">
      <label className="block text-xs font-bold text-gray-700">
        {c.isDefault ? c.type : 'Type de rendez‑vous'}
      </label>
      {!c.isDefault && (
        <input
          type="text"
          value={c.type}
          onChange={e => handleChange(idx, 'type', e.target.value)}
          className="shadow-none border rounded p-2 w-full text-xs"
          placeholder="Nom du type"
        />
      )}
    </div>

    {/* Colonne 2 – Tarif */}
    <div className="w-1/4 space-y-1">
      <label className="block text-xs font-bold text-gray-700">Tarif (€)</label>
      <input
        type="number"
        value={c.price}
        onChange={e => handleChange(idx, 'price', e.target.value)}
        className="shadow-none border rounded p-2 w-full text-xs"
        placeholder="Prix en €"
      />
    </div>

    {/* Colonne 3 – Durée */}
    <div className="w-1/4 space-y-1">
      <label className="block text-xs font-bold text-gray-700">Durée (min)</label>
      <input
        type="number"
        value={c.duration}
        onChange={e => handleChange(idx, 'duration', e.target.value)}
        className="shadow-none border rounded p-2 w-full text-xs"
        placeholder="Durée en minutes"
      />
    </div>

    <div className="w-1/4 space-y-1">
      <label className="block text-xs font-bold text-white">Action</label>
      <Button
        type="button"
        onClick={() => handleDeleteConsultation(idx)}
        variant="destructive"
        className="text-xs p-1 h-6"
      >
        <Trash/>
      </Button>
    </div>

  </div>
))}

<div className='flex justify-end items-center w-full self-end'>
<Button 
    type='button' 
    onClick={handleAddConsultation} 
    variant='outline'
    className='text-xs mt-4 border-2 rounded shadow-none text-blue-gray-700 font-bold self-end'
  >
    <PlusCircle/> Ajouter un type de rendez-vous
  </Button>

</div>
                <div className='flex space-x-2'>
                  <Button onClick={handleSave} className="text-xs rounded"><Save/> Enregistrer</Button>
                  <Button variant='outline' onClick={() => setIsEditing(false)} className="text-xs rounded">Annuler</Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}