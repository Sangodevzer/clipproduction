import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  closestCenter, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import { 
  SortableContext, 
  sortableKeyboardCoordinates,
  verticalListSortingStrategy 
} from '@dnd-kit/sortable';
import { 
  Lock, 
  Menu, 
  X, 
  Plus, 
  Trash2, 
  MapPin, 
  Clock, 
  GripVertical,
  CheckSquare,
  Square,
  Package,
  Calendar,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  TrendingDown,
  TrendingUp,
  PieChart,
  Edit2,
  Camera,
  Upload,
  Image as ImageIcon,
  ZoomIn
} from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { api } from './api';

// Utility: Generate unique IDs
const generateId = () => `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

// Authentication Component
const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      const data = await response.json();
      
      if (data.success) {
        onLogin();
      } else {
        setError(true);
        setTimeout(() => setError(false), 2000);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(true);
      setTimeout(() => setError(false), 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-studio-darker via-studio-dark to-studio-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl p-6 border border-white/20">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-studio-accent p-3 rounded-full mb-3">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold sci-fi-title mb-1" data-text="JEUNE PATRON PRODUCTION">
              Jeune Patron Production
            </h1>
            <p className="text-gray-300 text-center text-sm">Gestion de Production de Clips</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={`w-full px-4 py-3 bg-white/5 border ${
                  error ? 'border-red-500' : 'border-white/20'
                } rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-studio-accent transition-all`}
                placeholder="Entrez le mot de passe"
                autoFocus
              />
              {error && (
                <p className="mt-2 text-sm text-red-400">Mot de passe incorrect</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-studio-accent hover:bg-studio-accent-light text-white font-semibold py-3 px-6 rounded-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Connexion...' : 'Accéder'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

// Draggable Card Component
const DraggableCard = ({ card, onEdit, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedCard, setEditedCard] = useState(card);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleSave = () => {
    onEdit(editedCard);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedCard(card);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div ref={setNodeRef} style={style} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20 mb-3">
        <input
          type="text"
          value={editedCard.title}
          onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
          className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-studio-accent"
          placeholder="Titre"
        />
        <textarea
          value={editedCard.description}
          onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
          className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-studio-accent min-h-[60px]"
          placeholder="Description"
        />
        <input
          type="time"
          value={editedCard.time}
          onChange={(e) => setEditedCard({ ...editedCard, time: e.target.value })}
          className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-studio-accent"
        />
        <input
          type="url"
          value={editedCard.mapUrl}
          onChange={(e) => setEditedCard({ ...editedCard, mapUrl: e.target.value })}
          className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-studio-accent"
          placeholder="URL Google Maps (optionnel)"
        />
        <select
          value={editedCard.category}
          onChange={(e) => setEditedCard({ ...editedCard, category: e.target.value })}
          className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-studio-accent"
        >
          <option value="shooting">Tournage (Violet)</option>
          <option value="catering">Catering (Vert)</option>
          <option value="travel">Déplacement (Bleu)</option>
          <option value="meeting">Réunion (Jaune)</option>
          <option value="red">Rouge</option>
          <option value="orange">Orange</option>
          <option value="pink">Rose</option>
          <option value="indigo">Indigo</option>
          <option value="teal">Turquoise</option>
          <option value="other">Autre (Gris)</option>
        </select>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="flex-1 bg-studio-accent text-white px-3 py-2 rounded hover:bg-studio-accent-light transition-colors"
          >
            Enregistrer
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-white/10 text-white px-3 py-2 rounded hover:bg-white/20 transition-colors"
          >
            Annuler
          </button>
        </div>
      </div>
    );
  }

  const categoryColors = {
    shooting: 'bg-purple-600/30 border-purple-500',
    catering: 'bg-green-600/30 border-green-500',
    travel: 'bg-blue-600/30 border-blue-500',
    meeting: 'bg-yellow-600/30 border-yellow-500',
    other: 'bg-gray-600/30 border-gray-500',
    red: 'bg-red-600/30 border-red-500',
    orange: 'bg-orange-600/30 border-orange-500',
    pink: 'bg-pink-600/30 border-pink-500',
    indigo: 'bg-indigo-600/30 border-indigo-500',
    teal: 'bg-teal-600/30 border-teal-500',
  };

  const categoryLabels = {
    shooting: 'Tournage',
    catering: 'Catering',
    travel: 'Déplacement',
    meeting: 'Réunion',
    other: 'Autre',
    red: 'Rouge',
    orange: 'Orange',
    pink: 'Rose',
    indigo: 'Indigo',
    teal: 'Turquoise',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${categoryColors[card.category] || categoryColors.other} backdrop-blur-sm rounded-lg p-2 border-2 mb-2 cursor-pointer hover:shadow-lg transition-all`}
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-white text-sm mb-0.5">{card.title}</h3>
          {card.description && (
            <div>
              <p className="text-xs text-gray-300 mb-1">
                {showFullDescription || card.description.length <= 100
                  ? card.description
                  : `${card.description.substring(0, 100)}...`}
              </p>
              {card.description.length > 100 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullDescription(!showFullDescription);
                  }}
                  className="text-xs text-studio-accent-light hover:text-studio-accent transition-colors mb-2"
                >
                  {showFullDescription ? 'Voir moins' : 'Voir plus...'}
                </button>
              )}
            </div>
          )}
          {card.time && (
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <Clock className="w-3 h-3" />
              <span>{card.time}</span>
            </div>
          )}
          {card.mapUrl && (
            <a
              href={card.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1 text-xs bg-studio-accent text-white px-2 py-1 rounded hover:bg-studio-accent-light transition-colors"
            >
              <MapPin className="w-3 h-3" />
              Voir le lieu
            </a>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="text-red-400 hover:text-red-300 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

// Day Column Component
const DayColumn = ({ date, cards, onAddCard, onEditCard, onDeleteCard }) => {
  const dayNames = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'];
  const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
  
  const dayName = dayNames[date.getDay()];
  const dayNumber = date.getDate();
  const monthName = monthNames[date.getMonth()];
  const dateStr = date.toISOString().split('T')[0];

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${dateStr}`,
    data: { date: dateStr }
  });

  return (
    <div 
      ref={setNodeRef}
      className={`flex-shrink-0 w-80 bg-white/5 backdrop-blur-sm rounded-lg p-3 border-2 transition-all ${
        isOver ? 'border-studio-accent bg-studio-accent/10 scale-105' : 'border-white/10'
      }`}
    >
      <div className="mb-2">
        <div className="text-studio-accent-light text-xs font-medium">{dayName}</div>
        <div className="text-white text-base font-bold">{dayNumber} {monthName}</div>
      </div>
      
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 mb-2 min-h-[120px]">
          {cards.map((card) => (
            <DraggableCard key={card.id} card={card} onEdit={onEditCard} onDelete={onDeleteCard} />
          ))}
          {cards.length === 0 && (
            <div className="text-gray-500 text-center py-8 text-sm">
              Glissez une tâche ici
            </div>
          )}
        </div>
      </SortableContext>
      
      <button
        onClick={onAddCard}
        className="w-full bg-white/10 hover:bg-white/20 text-white px-2 py-1 rounded text-xs flex items-center justify-center gap-1 transition-colors border border-white/20"
      >
        <Plus className="w-3 h-3" />
        Ajouter une tâche
      </button>
    </div>
  );
};

// Needs Sidebar Component
const NeedsSidebar = ({ needs, onAddNeed, onDeleteNeed, isOpen, onClose }) => {
  const [newNeed, setNewNeed] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const addNeed = () => {
    if (newNeed.trim()) {
      onAddNeed(newNeed);
      setNewNeed('');
    }
  };

  return (
    <div className={`
      fixed lg:relative inset-y-0 left-0 z-40 bg-studio-dark border-r border-white/10
      transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      ${isMinimized ? 'w-12' : 'w-64'}
    `}>
      {isMinimized ? (
        <div className="h-full flex items-center justify-center">
          <button
            onClick={() => setIsMinimized(false)}
            className="text-studio-accent hover:text-studio-accent-light transition-colors p-2 rounded-lg hover:bg-white/10"
            title="Ouvrir Besoins"
          >
            <Package className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Package className="w-5 h-5 text-studio-accent" />
              <h2 className="text-base font-bold text-white">Besoins</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="hidden lg:block text-gray-400 hover:text-white transition-colors"
                title="Minimiser"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newNeed}
              onChange={(e) => setNewNeed(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addNeed()}
              placeholder="Ajouter un besoin..."
              className="flex-1 bg-white/5 border border-white/20 rounded px-2 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-studio-accent"
            />
            <button
              onClick={addNeed}
              className="bg-studio-accent text-white p-2 rounded-lg hover:bg-studio-accent-light transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {needs.map((need) => (
              <div
                key={need.id}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between group hover:bg-white/10 transition-colors"
              >
                <span className="text-white">{need.text}</span>
                <button
                  onClick={() => onDeleteNeed(need.id)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {needs.length === 0 && (
              <p className="text-gray-500 text-center py-8">Aucun besoin ajouté</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Todo Sidebar Component
const TodoSidebar = ({ todos, onAddTodo, onToggleTodo, onDeleteTodo, isOpen, onClose }) => {
  const [newTodo, setNewTodo] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);

  const addTodo = () => {
    if (newTodo.trim()) {
      onAddTodo(newTodo);
      setNewTodo('');
    }
  };

  return (
    <div className={`
      fixed lg:relative inset-y-0 right-0 z-40 bg-studio-dark border-l border-white/10
      transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
      ${isMinimized ? 'w-12' : 'w-64'}
    `}>
      {isMinimized ? (
        <div className="h-full flex items-center justify-center">
          <button
            onClick={() => setIsMinimized(false)}
            className="text-studio-accent hover:text-studio-accent-light transition-colors p-2 rounded-lg hover:bg-white/10"
            title="Ouvrir To-Do"
          >
            <CheckSquare className="w-5 h-5" />
          </button>
        </div>
      ) : (
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-5 h-5 text-studio-accent" />
              <h2 className="text-base font-bold text-white">To-Do</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsMinimized(true)}
                className="hidden lg:block text-gray-400 hover:text-white transition-colors"
                title="Minimiser"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Nouvelle tâche..."
              className="flex-1 bg-white/5 border border-white/20 rounded px-2 py-1.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-studio-accent"
            />
            <button
              onClick={addTodo}
              className="bg-studio-accent text-white p-2 rounded-lg hover:bg-studio-accent-light transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="bg-white/5 backdrop-blur-sm rounded-lg p-3 flex items-center gap-3 group hover:bg-white/10 transition-colors"
              >
                <button
                  onClick={() => onToggleTodo(todo.id)}
                  className="flex-shrink-0 text-studio-accent hover:text-studio-accent-light transition-colors"
                >
                  {todo.completed ? (
                    <CheckSquare className="w-5 h-5" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>
                <span className={`flex-1 text-white ${todo.completed ? 'line-through opacity-50' : ''}`}>
                  {todo.text}
                </span>
                <button
                  onClick={() => onDeleteTodo(todo.id)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            {todos.length === 0 && (
              <p className="text-gray-500 text-center py-8">Aucune tâche</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Scouting (Repérages) Page Component
const ScoutingPage = ({ photos, onAddPhoto, onDeletePhoto, onUpdatePhoto }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [editingPhoto, setEditingPhoto] = useState(null);
  const [editForm, setEditForm] = useState({ location: '', description: '', sceneNumber: '' });

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    for (const file of files) {
      if (!file.type.startsWith('image/')) continue;

      const reader = new FileReader();
      reader.onload = async (event) => {
        const newPhoto = {
          id: generateId(),
          imageData: event.target.result,
          location: '',
          description: '',
          sceneNumber: '',
          uploadDate: new Date().toISOString()
        };
        await onAddPhoto(newPhoto);
      };
      reader.readAsDataURL(file);
    }
    
    setUploading(false);
    e.target.value = '';
  };

  const startEdit = (photo) => {
    setEditingPhoto(photo.id);
    setEditForm({
      location: photo.location || '',
      description: photo.description || '',
      sceneNumber: photo.sceneNumber || ''
    });
  };

  const saveEdit = async () => {
    if (editingPhoto) {
      const photo = photos.find(p => p.id === editingPhoto);
      await onUpdatePhoto(editingPhoto, { ...photo, ...editForm });
      setEditingPhoto(null);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Repérages</h2>
              <p className="text-gray-400">Photos des lieux de tournage</p>
            </div>
            <label className="bg-studio-accent hover:bg-studio-accent-light text-white px-6 py-3 rounded-lg cursor-pointer flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95">
              <Upload className="w-5 h-5" />
              {uploading ? 'Upload...' : 'Ajouter des photos'}
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>
        </div>

        {photos.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-12 border border-white/20 text-center">
            <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">Aucune photo de repérage</h3>
            <p className="text-gray-400 mb-6">Commencez par ajouter des photos des lieux de tournage</p>
            <label className="inline-flex items-center gap-2 bg-studio-accent hover:bg-studio-accent-light text-white px-6 py-3 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              Ajouter des photos
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:border-studio-accent/50 transition-all group">
                <div className="relative aspect-video bg-black/50 cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                  <img 
                    src={photo.imageData} 
                    alt={photo.location || 'Repérage'}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="w-8 h-8 text-white" />
                  </div>
                </div>
                
                {editingPhoto === photo.id ? (
                  <div className="p-4 space-y-2">
                    <input
                      type="text"
                      value={editForm.sceneNumber}
                      onChange={(e) => setEditForm({...editForm, sceneNumber: e.target.value})}
                      placeholder="N° de scène"
                      className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-accent"
                    />
                    <input
                      type="text"
                      value={editForm.location}
                      onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                      placeholder="Lieu"
                      className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-accent"
                    />
                    <textarea
                      value={editForm.description}
                      onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                      placeholder="Description..."
                      className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-accent min-h-[60px]"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={saveEdit}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        Sauvegarder
                      </button>
                      <button
                        onClick={() => setEditingPhoto(null)}
                        className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded text-sm transition-colors"
                      >
                        Annuler
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-4">
                    {photo.sceneNumber && (
                      <div className="text-xs text-studio-accent-light font-semibold mb-1">
                        Scène {photo.sceneNumber}
                      </div>
                    )}
                    {photo.location && (
                      <div className="flex items-center gap-1 text-white font-semibold mb-1">
                        <MapPin className="w-4 h-4 text-studio-accent" />
                        <span className="text-sm">{photo.location}</span>
                      </div>
                    )}
                    {photo.description && (
                      <p className="text-sm text-gray-400 mb-3 line-clamp-2">{photo.description}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">
                        {new Date(photo.uploadDate).toLocaleDateString('fr-FR')}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEdit(photo)}
                          className="text-studio-accent hover:text-studio-accent-light transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDeletePhoto(photo.id)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Photo Modal */}
        {selectedPhoto && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedPhoto(null)}>
            <div className="max-w-6xl max-h-[90vh] w-full">
              <div className="relative">
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
                >
                  <X className="w-8 h-8" />
                </button>
                <img 
                  src={selectedPhoto.imageData} 
                  alt={selectedPhoto.location || 'Repérage'}
                  className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                  onClick={(e) => e.stopPropagation()}
                />
                {(selectedPhoto.location || selectedPhoto.description) && (
                  <div className="mt-4 bg-white/10 backdrop-blur-lg rounded-lg p-4" onClick={(e) => e.stopPropagation()}>
                    {selectedPhoto.sceneNumber && (
                      <div className="text-studio-accent-light font-semibold mb-2">
                        Scène {selectedPhoto.sceneNumber}
                      </div>
                    )}
                    {selectedPhoto.location && (
                      <div className="flex items-center gap-2 text-white font-semibold mb-2">
                        <MapPin className="w-5 h-5 text-studio-accent" />
                        <span>{selectedPhoto.location}</span>
                      </div>
                    )}
                    {selectedPhoto.description && (
                      <p className="text-gray-300">{selectedPhoto.description}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Budget Sidebar Component
const BudgetSidebar = ({ budgetData, onUpdateBudget, onAddExpense, onDeleteExpense, onEditExpense, isOpen, onClose }) => {
  const [isMinimized, setIsMinimized] = useState(false);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [editingBudget, setEditingBudget] = useState(false);
  const [totalBudget, setTotalBudget] = useState(budgetData.total || 0);
  const [newExpense, setNewExpense] = useState({
    category: 'catering',
    description: '',
    amount: '',
    date: new Date().toISOString().split('T')[0]
  });

  const categories = [
    { id: 'catering', label: 'Catering', icon: '🍽️', color: 'green' },
    { id: 'equipment', label: 'Équipement', icon: '📹', color: 'blue' },
    { id: 'transport', label: 'Transport', icon: '🚗', color: 'yellow' },
    { id: 'location', label: 'Location', icon: '📍', color: 'purple' },
    { id: 'talent', label: 'Talent/Cast', icon: '🎭', color: 'pink' },
    { id: 'crew', label: 'Équipe', icon: '👥', color: 'indigo' },
    { id: 'other', label: 'Autre', icon: '💰', color: 'gray' }
  ];

  const expenses = budgetData.expenses || [];
  const totalSpent = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);
  const remaining = totalBudget - totalSpent;
  const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getExpensesByCategory = () => {
    const byCategory = {};
    categories.forEach(cat => {
      byCategory[cat.id] = {
        ...cat,
        expenses: expenses.filter(e => e.category === cat.id),
        total: expenses.filter(e => e.category === cat.id).reduce((sum, e) => sum + parseFloat(e.amount), 0)
      };
    });
    return byCategory;
  };

  const expensesByCategory = getExpensesByCategory();

  const handleAddExpense = () => {
    if (newExpense.description.trim() && newExpense.amount) {
      onAddExpense({
        id: generateId(),
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      });
      setNewExpense({
        category: 'catering',
        description: '',
        amount: '',
        date: new Date().toISOString().split('T')[0]
      });
      setShowAddExpense(false);
    }
  };

  const handleSaveBudget = () => {
    onUpdateBudget(parseFloat(totalBudget) || 0);
    setEditingBudget(false);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(amount);
  };

  if (isMinimized) {
    return (
      <div className="fixed lg:relative bottom-0 lg:inset-y-0 left-0 lg:left-auto right-0 lg:right-0 z-40 bg-studio-dark border-t lg:border-t-0 lg:border-l border-white/10 transform transition-all duration-300 ease-in-out h-16 lg:h-auto lg:w-16">
        <div className="h-full flex lg:flex-col items-center justify-center lg:py-6 gap-4 px-4 lg:px-0">
          <button
            onClick={() => setIsMinimized(false)}
            className="text-studio-accent hover:text-studio-accent-light transition-colors p-2 rounded-lg hover:bg-white/10"
            title="Agrandir"
          >
            <DollarSign className="w-6 h-6" />
          </button>
          <div className="text-white text-xs">
            Budget: {formatCurrency(remaining)} restant
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`
      fixed bottom-0 left-0 right-0 z-40 bg-studio-dark border-t border-white/10
      transform transition-all duration-300 ease-in-out
      ${isOpen ? 'translate-y-0' : 'translate-y-full'}
      h-[70vh] lg:h-[50vh] max-h-[600px]
    `}>
      <div className="h-full flex flex-col p-4 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-studio-accent" />
            <h2 className="text-base font-bold text-white">Budget</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(true)}
              className="hidden lg:block text-gray-400 hover:text-white transition-colors"
              title="Minimiser"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Budget Overview */}
        <div className="mb-6">
          <div className="bg-gradient-to-br from-studio-accent/20 to-purple-600/20 backdrop-blur-sm rounded-lg p-4 border border-studio-accent/30">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-300">Budget Total</span>
              {editingBudget ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(e.target.value)}
                    className="w-32 bg-white/5 border border-white/20 rounded px-2 py-1 text-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-accent"
                    autoFocus
                  />
                  <button onClick={handleSaveBudget} className="text-green-400 hover:text-green-300" title="Sauvegarder">
                    <CheckSquare className="w-4 h-4" />
                  </button>
                  <button onClick={() => {setEditingBudget(false); setTotalBudget(budgetData.total || 0);}} className="text-red-400 hover:text-red-300" title="Annuler">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => setEditingBudget(true)} 
                  className="flex items-center gap-2 text-white hover:text-studio-accent-light transition-colors group"
                  title="Cliquez pour modifier le budget total"
                >
                  <span className="text-2xl font-bold">{formatCurrency(budgetData.total || 0)}</span>
                  <Edit2 className="w-4 h-4 text-gray-400 group-hover:text-studio-accent transition-colors" />
                </button>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Dépensé</span>
                <span className="text-red-400 font-semibold">{formatCurrency(totalSpent)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Restant</span>
                <span className={`font-semibold ${remaining >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {formatCurrency(remaining)}
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3">
              <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${
                    percentageUsed > 90 ? 'bg-red-500' : percentageUsed > 70 ? 'bg-yellow-500' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentageUsed, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>0%</span>
                <span className="font-semibold">{percentageUsed.toFixed(1)}%</span>
                <span>100%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add Expense Button */}
        <button
          onClick={() => setShowAddExpense(!showAddExpense)}
          className="w-full bg-studio-accent hover:bg-studio-accent-light text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors mb-4"
        >
          <Plus className="w-4 h-4" />
          Ajouter une dépense
        </button>

        {/* Add Expense Form */}
        {showAddExpense && (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 mb-4 border border-white/20">
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-studio-accent"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>
              ))}
            </select>
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
              placeholder="Description..."
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-studio-accent"
            />
            <input
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
              placeholder="Montant (€)"
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white mb-2 focus:outline-none focus:ring-2 focus:ring-studio-accent"
            />
            <input
              type="date"
              value={newExpense.date}
              onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
              className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white mb-3 focus:outline-none focus:ring-2 focus:ring-studio-accent"
            />
            <div className="flex gap-2">
              <button
                onClick={handleAddExpense}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded transition-colors"
              >
                Ajouter
              </button>
              <button
                onClick={() => setShowAddExpense(false)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white px-3 py-2 rounded transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        )}

        {/* Expenses by Category */}
        <div className="flex-1 overflow-y-auto space-y-3">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Dépenses par catégorie</h3>
          {Object.values(expensesByCategory)
            .filter(cat => cat.total > 0)
            .sort((a, b) => b.total - a.total)
            .map((cat) => (
            <div key={cat.id} className="bg-white/5 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{cat.icon}</span>
                  <span className="text-white font-semibold">{cat.label}</span>
                </div>
                <span className="text-studio-accent-light font-bold">{formatCurrency(cat.total)}</span>
              </div>
              <div className="space-y-1 pl-7">
                {cat.expenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between text-sm group py-1">
                    <div className="flex-1">
                      <div className="text-gray-300">{expense.description}</div>
                      <div className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString('fr-FR')}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-400">{formatCurrency(expense.amount)}</span>
                      <button
                        onClick={() => onDeleteExpense(expense.id)}
                        className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-300 transition-all"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {expenses.length === 0 && (
            <p className="text-gray-500 text-center py-8">Aucune dépense enregistrée</p>
          )}
        </div>
      </div>
    </div>
  );
};

// Main Dashboard Component
const Dashboard = ({ onLogout }) => {
  const [cards, setCards] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [todos, setTodos] = useState([]);
  const [budgetData, setBudgetData] = useState({ total: 0, expenses: [] });
  const [scoutingPhotos, setScoutingPhotos] = useState([]);
  const [currentView, setCurrentView] = useState('planning'); // 'planning' or 'scouting'
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [budgetSidebarOpen, setBudgetSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [startDate, setStartDate] = useState('2026-01-05');
  const [numDays, setNumDays] = useState(3);
  const [showDateConfig, setShowDateConfig] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cardsData, needsData, todosData, budgetExpenses, budgetTotal, scoutingData, savedStartDate, savedNumDays] = await Promise.all([
          api.getCards(),
          api.getNeeds(),
          api.getTodos(),
          api.getBudgetExpenses(),
          api.getSetting('budget_total'),
          api.getScoutingPhotos(),
          api.getSetting('start_date'),
          api.getSetting('num_days')
        ]);

        setCards(cardsData);
        setNeeds(needsData);
        setTodos(todosData);
        setBudgetData({
          total: parseFloat(budgetTotal) || 0,
          expenses: budgetExpenses
        });
        setScoutingPhotos(scoutingData);
        if (savedStartDate) setStartDate(savedStartDate);
        if (savedNumDays) setNumDays(parseInt(savedNumDays));
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    
    // Polling pour rafraîchir les données toutes les 3 secondes
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Save settings to API
  useEffect(() => {
    if (!loading) {
      api.setSetting('start_date', startDate);
    }
  }, [startDate, loading]);

  useEffect(() => {
    if (!loading) {
      api.setSetting('num_days', numDays.toString());
    }
  }, [numDays, loading]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Generate dates based on configuration
  const getDates = () => {
    const dates = [];
    const start = new Date(startDate);
    for (let i = 0; i < numDays; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const dates = getDates();

  const getCardsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return cards.filter(card => card.date === dateStr);
  };

  const addCard = async (date) => {
    const dateStr = date.toISOString().split('T')[0];
    const newCard = {
      id: generateId(),
      date: dateStr,
      title: 'Nouvelle tâche',
      description: '',
      time: '',
      mapUrl: '',
      category: 'other',
    };
    setCards([...cards, newCard]);
    await api.createCard(newCard);
  };

  const editCard = async (updatedCard) => {
    setCards(cards.map(c => c.id === updatedCard.id ? updatedCard : c));
    await api.updateCard(updatedCard.id, updatedCard);
  };

  const deleteCard = async (id) => {
    setCards(cards.filter(c => c.id !== id));
    await api.deleteCard(id);
  };

  // Needs callbacks
  const addNeed = async (text) => {
    const newNeed = { id: generateId(), text };
    setNeeds([...needs, newNeed]);
    await api.createNeed(newNeed);
  };

  const deleteNeed = async (id) => {
    setNeeds(needs.filter(n => n.id !== id));
    await api.deleteNeed(id);
  };

  // Todos callbacks
  const addTodo = async (text) => {
    const newTodo = { id: generateId(), text, completed: false };
    setTodos([...todos, newTodo]);
    await api.createTodo(newTodo);
  };

  const toggleTodo = async (id) => {
    const todo = todos.find(t => t.id === id);
    if (todo) {
      const updatedTodo = { ...todo, completed: !todo.completed };
      setTodos(todos.map(t => t.id === id ? updatedTodo : t));
      await api.updateTodo(id, updatedTodo);
    }
  };

  const deleteTodo = async (id) => {
    setTodos(todos.filter(t => t.id !== id));
    await api.deleteTodo(id);
  };

  // Budget callbacks
  const updateBudgetTotal = async (total) => {
    setBudgetData({ ...budgetData, total });
    await api.setSetting('budget_total', total.toString());
  };

  const addExpense = async (expense) => {
    setBudgetData({
      ...budgetData,
      expenses: [...budgetData.expenses, expense]
    });
    await api.createBudgetExpense(expense);
  };

  const deleteExpense = async (id) => {
    setBudgetData({
      ...budgetData,
      expenses: budgetData.expenses.filter(e => e.id !== id)
    });
    await api.deleteBudgetExpense(id);
  };

  const editExpense = async (updatedExpense) => {
    setBudgetData({
      ...budgetData,
      expenses: budgetData.expenses.map(e => e.id === updatedExpense.id ? updatedExpense : e)
    });
    await api.updateBudgetExpense(updatedExpense.id, updatedExpense);
  };

  // Scouting callbacks
  const addScoutingPhoto = async (photo) => {
    setScoutingPhotos([...scoutingPhotos, photo]);
    await api.createScoutingPhoto(photo);
  };

  const deleteScoutingPhoto = async (id) => {
    setScoutingPhotos(scoutingPhotos.filter(p => p.id !== id));
    await api.deleteScoutingPhoto(id);
  };

  const updateScoutingPhoto = async (id, updatedPhoto) => {
    setScoutingPhotos(scoutingPhotos.map(p => p.id === id ? updatedPhoto : p));
    await api.updateScoutingPhoto(id, updatedPhoto);
  };

  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    
    if (!over) {
      setActiveId(null);
      return;
    }

    const activeCard = cards.find(c => c.id === active.id);
    if (!activeCard) {
      setActiveId(null);
      return;
    }

    let targetDate = null;

    // Check if dropped on a day column
    if (over.id.toString().startsWith('droppable-')) {
      targetDate = over.data?.current?.date;
    }
    // Check if dropped on another card
    else if (active.id !== over.id) {
      const overCard = cards.find(c => c.id === over.id);
      if (overCard) {
        targetDate = overCard.date;
      }
    }

    if (targetDate && activeCard.date !== targetDate) {
      const updatedCard = { ...activeCard, date: targetDate };
      setCards(cards.map(c => 
        c.id === active.id ? updatedCard : c
      ));
      await api.updateCard(activeCard.id, updatedCard);
    }
    
    setActiveId(null);
  };

  return (
    <div className="h-screen flex flex-col bg-gradient-to-br from-studio-darker via-studio-dark to-studio-darker">
      {loading ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-white text-xl">Chargement...</div>
        </div>
      ) : (
        <>
      {/* Header */}
      <header className="bg-studio-darker/80 backdrop-blur-lg border-b border-white/10 px-4 lg:px-6 py-2.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="lg:hidden text-white hover:text-studio-accent transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-studio-accent" />
              <h1 className="text-lg lg:text-xl font-bold sci-fi-title" data-text="JEUNE PATRON PRODUCTION">
                Jeune Patron Production
              </h1>
            </div>
            {/* Navigation Tabs */}
            <div className="hidden lg:flex items-center gap-2 ml-8">
              <button
                onClick={() => setCurrentView('planning')}
                className={`px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  currentView === 'planning' 
                    ? 'bg-studio-accent text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Planning
              </button>
              <button
                onClick={() => setCurrentView('scouting')}
                className={`px-3 py-1.5 rounded-lg transition-colors text-sm ${
                  currentView === 'scouting' 
                    ? 'bg-studio-accent text-white' 
                    : 'bg-white/10 text-gray-400 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4 inline mr-2" />
                Repérages
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDateConfig(!showDateConfig)}
              className="hidden lg:flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Calendar className="w-4 h-4" />
              Dates
            </button>
            <button
              onClick={() => setBudgetSidebarOpen(!budgetSidebarOpen)}
              className="hidden lg:flex items-center gap-2 text-sm bg-green-600/20 hover:bg-green-600/30 text-green-400 px-4 py-2 rounded-lg transition-colors border border-green-500/30"
            >
              <DollarSign className="w-4 h-4" />
              <span className="hidden sm:inline">Budget</span>
            </button>
            {/* Mobile menu */}
            <div className="lg:hidden relative">
              <button
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className="text-white hover:text-studio-accent transition-colors"
              >
                <Menu className="w-6 h-6" />
              </button>
              {rightSidebarOpen && (
                <div className="absolute right-0 top-12 bg-studio-darker border border-white/20 rounded-lg shadow-xl p-2 min-w-[200px] z-50">
                  <button
                    onClick={() => {setCurrentView('planning'); setRightSidebarOpen(false);}}
                    className={`w-full text-left px-4 py-2 rounded-lg mb-1 ${
                      currentView === 'planning' ? 'bg-studio-accent text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Calendar className="w-4 h-4 inline mr-2" />
                    Planning
                  </button>
                  <button
                    onClick={() => {setCurrentView('scouting'); setRightSidebarOpen(false);}}
                    className={`w-full text-left px-4 py-2 rounded-lg mb-1 ${
                      currentView === 'scouting' ? 'bg-studio-accent text-white' : 'text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Camera className="w-4 h-4 inline mr-2" />
                    Repérages
                  </button>
                  <button
                    onClick={() => {setBudgetSidebarOpen(!budgetSidebarOpen); setRightSidebarOpen(false);}}
                    className="w-full text-left px-4 py-2 rounded-lg text-green-400 hover:bg-white/10"
                  >
                    <DollarSign className="w-4 h-4 inline mr-2" />
                    Budget
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={onLogout}
              className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Date Configuration Panel */}
      {showDateConfig && (
        <div className="bg-studio-darker/95 backdrop-blur-lg border-b border-white/10 px-6 py-3">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Date de début :</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="bg-white/5 border border-white/20 rounded px-3 py-1.5 text-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-accent"
              />
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-300">Nombre de jours :</label>
              <input
                type="number"
                min="1"
                max="14"
                value={numDays}
                onChange={(e) => setNumDays(Math.max(1, Math.min(14, parseInt(e.target.value) || 1)))}
                className="bg-white/5 border border-white/20 rounded px-3 py-1.5 text-white text-sm w-20 focus:outline-none focus:ring-2 focus:ring-studio-accent"
              />
            </div>
            <button
              onClick={() => setShowDateConfig(false)}
              className="ml-auto text-sm bg-studio-accent hover:bg-studio-accent-light text-white px-4 py-1.5 rounded transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Only show on planning view */}
        {currentView === 'planning' && (
          <NeedsSidebar 
            needs={needs} 
            onAddNeed={addNeed}
            onDeleteNeed={deleteNeed}
            isOpen={leftSidebarOpen}
            onClose={() => setLeftSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        {currentView === 'planning' ? (
          <main className="flex-1 overflow-x-auto overflow-y-hidden p-3">
            <div className="mb-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold text-white mb-0.5">Planning</h2>
                  <p className="text-gray-400 text-xs">Glissez-déposez les tâches entre les jours</p>
                </div>
                <button
                  onClick={() => setShowDateConfig(!showDateConfig)}
                  className="lg:hidden flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  <Calendar className="w-4 h-4" />
                  Configurer les dates
                </button>
              </div>
            </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-3 pb-3">
              {dates.map((date) => {
                const dayCards = getCardsForDate(date);
                return (
                  <div key={date.toISOString()} className="flex-shrink-0 w-80">
                    <DayColumn
                      date={date}
                      cards={dayCards}
                      onAddCard={() => addCard(date)}
                      onEditCard={editCard}
                      onDeleteCard={deleteCard}
                    />
                    <SortableContext items={dayCards.map(c => c.id)} strategy={verticalListSortingStrategy}>
                      <div className="hidden">
                        {dayCards.map((card) => (
                          <div key={card.id} />
                        ))}
                      </div>
                    </SortableContext>
                  </div>
                );
              })}
            </div>
            
            <DragOverlay>
              {activeId ? (
                <div className="bg-studio-accent/50 backdrop-blur-sm rounded-lg p-4 border-2 border-studio-accent rotate-3 shadow-xl">
                  <div className="text-white font-bold">
                    {cards.find(c => c.id === activeId)?.title}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        </main>
        ) : (
          <ScoutingPage 
            photos={scoutingPhotos}
            onAddPhoto={addScoutingPhoto}
            onDeletePhoto={deleteScoutingPhoto}
            onUpdatePhoto={updateScoutingPhoto}
          />
        )}

        {/* Right Sidebar - Only show on planning view */}
        {currentView === 'planning' && (
          <TodoSidebar 
            todos={todos} 
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onDeleteTodo={deleteTodo}
            isOpen={rightSidebarOpen}
            onClose={() => setRightSidebarOpen(false)}
          />
        )}
      </div>

      {/* Budget Sidebar (Bottom on mobile, Right on desktop) */}
      <BudgetSidebar
        budgetData={budgetData}
        onUpdateBudget={updateBudgetTotal}
        onAddExpense={addExpense}
        onDeleteExpense={deleteExpense}
        onEditExpense={editExpense}
        isOpen={budgetSidebarOpen}
        onClose={() => setBudgetSidebarOpen(false)}
      />

      {/* Mobile overlay */}
      {(leftSidebarOpen || rightSidebarOpen || budgetSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
            setBudgetSidebarOpen(false);
          }}
        />
      )}
        </>
      )}
    </div>
  );
};

// Main App Component
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const authStatus = localStorage.getItem('orgaclip-auth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    localStorage.setItem('orgaclip-auth', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('orgaclip-auth');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <LoginScreen onLogin={handleLogin} />;
  }

  return <Dashboard onLogout={handleLogout} />;
}

export default App;
