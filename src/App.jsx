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
      <div ref={setNodeRef} style={style} className="bg-white/10 backdrop-blur-sm rounded-xl p-3 sm:p-4 border border-white/20 mb-3 shadow-lg">
        <input
          type="text"
          value={editedCard.title}
          onChange={(e) => setEditedCard({ ...editedCard, title: e.target.value })}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm sm:text-base mb-2.5 focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent transition-all"
          placeholder="Titre de la tâche"
        />
        <textarea
          value={editedCard.description}
          onChange={(e) => setEditedCard({ ...editedCard, description: e.target.value })}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm sm:text-base mb-2.5 focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent min-h-[80px] resize-y transition-all"
          placeholder="Description détaillée..."
        />
        <input
          type="time"
          value={editedCard.time}
          onChange={(e) => setEditedCard({ ...editedCard, time: e.target.value })}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm sm:text-base mb-2.5 focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent transition-all"
        />
        <input
          type="url"
          value={editedCard.mapUrl}
          onChange={(e) => setEditedCard({ ...editedCard, mapUrl: e.target.value })}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm sm:text-base mb-3 focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent transition-all"
          placeholder="https://maps.google.com/..."
        />
        <select
          value={editedCard.category}
          onChange={(e) => setEditedCard({ ...editedCard, category: e.target.value })}
          className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2.5 text-white text-sm sm:text-base mb-3 focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent transition-all"
        >
          <option value="shooting">🎬 Tournage (Violet)</option>
          <option value="catering">🍽️ Catering (Vert)</option>
          <option value="travel">🚗 Déplacement (Bleu)</option>
          <option value="meeting">👥 Réunion (Jaune)</option>
          <option value="red">🔴 Rouge</option>
          <option value="orange">🟠 Orange</option>
          <option value="pink">🩷 Rose</option>
          <option value="indigo">🟣 Indigo</option>
          <option value="teal">🩵 Turquoise</option>
          <option value="other">⚪ Autre (Gris)</option>
        </select>
        <div className="flex gap-2 sm:gap-3">
          <button
            onClick={handleSave}
            className="flex-1 bg-studio-accent text-white px-4 py-2.5 rounded-lg hover:bg-studio-accent-light transition-all transform hover:scale-105 active:scale-95 font-medium text-sm sm:text-base shadow-lg"
          >
            ✓ Enregistrer
          </button>
          <button
            onClick={handleCancel}
            className="flex-1 bg-white/10 text-white px-4 py-2.5 rounded-lg hover:bg-white/20 transition-all font-medium text-sm sm:text-base"
          >
            ✕ Annuler
          </button>
        </div>
      </div>
    );
  }

  const categoryColors = {
    shooting: 'bg-purple-600/30 border-purple-400/50 hover:border-purple-400',
    catering: 'bg-green-600/30 border-green-400/50 hover:border-green-400',
    travel: 'bg-blue-600/30 border-blue-400/50 hover:border-blue-400',
    meeting: 'bg-yellow-600/30 border-yellow-400/50 hover:border-yellow-400',
    other: 'bg-gray-600/30 border-gray-400/50 hover:border-gray-400',
    red: 'bg-red-600/30 border-red-400/50 hover:border-red-400',
    orange: 'bg-orange-600/30 border-orange-400/50 hover:border-orange-400',
    pink: 'bg-pink-600/30 border-pink-400/50 hover:border-pink-400',
    indigo: 'bg-indigo-600/30 border-indigo-400/50 hover:border-indigo-400',
    teal: 'bg-teal-600/30 border-teal-400/50 hover:border-teal-400',
  };

  const categoryLabels = {
    shooting: '🎬 Tournage',
    catering: '🍽️ Catering',
    travel: '🚗 Déplacement',
    meeting: '👥 Réunion',
    other: '⚪ Autre',
    red: '🔴 Rouge',
    orange: '🟠 Orange',
    pink: '🩷 Rose',
    indigo: '🟣 Indigo',
    teal: '🩵 Turquoise',
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`${categoryColors[card.category] || categoryColors.other} backdrop-blur-sm rounded-xl p-3 sm:p-3.5 border-2 mb-2.5 cursor-pointer hover:shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]`}
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1 flex-shrink-0 touch-none">
          <GripVertical className="w-5 h-5 text-gray-300 hover:text-white transition-colors" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-white text-sm sm:text-base leading-tight break-words">{card.title}</h3>
            <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full text-gray-300 whitespace-nowrap flex-shrink-0">
              {categoryLabels[card.category] || categoryLabels.other}
            </span>
          </div>
          {card.description && (
            <div className="mb-2">
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed break-words">
                {showFullDescription || card.description.length <= 80
                  ? card.description
                  : `${card.description.substring(0, 80)}...`}
              </p>
              {card.description.length > 80 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFullDescription(!showFullDescription);
                  }}
                  className="text-xs text-studio-accent-light hover:text-studio-accent transition-colors mt-1 font-medium"
                >
                  {showFullDescription ? '↑ Voir moins' : '↓ Voir plus...'}
                </button>
              )}
            </div>
          )}
          {card.time && (
            <div className="flex items-center gap-1.5 text-xs sm:text-sm text-gray-300 mb-2 bg-white/10 rounded-lg px-2 py-1 w-fit">
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span className="font-medium">{card.time}</span>
            </div>
          )}
          {card.mapUrl && (
            <a
              href={card.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm bg-studio-accent text-white px-3 py-1.5 rounded-lg hover:bg-studio-accent-light transition-all transform hover:scale-105 active:scale-95 font-medium shadow-md"
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Voir le lieu</span>
            </a>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(card.id);
          }}
          className="text-red-400 hover:text-red-300 transition-all transform hover:scale-110 active:scale-90 flex-shrink-0 p-1 hover:bg-red-500/20 rounded-lg"
          title="Supprimer"
        >
          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
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
  const isToday = new Date().toDateString() === date.toDateString();

  const { setNodeRef, isOver } = useDroppable({
    id: `droppable-${dateStr}`,
    data: { date: dateStr }
  });

  const taskCount = cards.length;

  return (
    <div 
      ref={setNodeRef}
      className={`flex-shrink-0 w-full sm:w-80 lg:w-96 bg-white/5 backdrop-blur-md rounded-xl p-4 border-2 transition-all ${
        isOver ? 'border-studio-accent bg-studio-accent/10 scale-[1.02] shadow-2xl' : isToday ? 'border-studio-accent/50 shadow-xl' : 'border-white/10 shadow-lg'
      }`}
    >
      <div className="mb-3 pb-3 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-studio-accent-light text-xs sm:text-sm font-semibold uppercase tracking-wide">{dayName}</div>
            <div className="text-white text-xl sm:text-2xl font-bold">
              {dayNumber} <span className="text-base sm:text-lg text-gray-400">{monthName}</span>
            </div>
          </div>
          {taskCount > 0 && (
            <div className="bg-studio-accent/20 text-studio-accent-light px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-studio-accent/30">
              {taskCount} {taskCount > 1 ? 'tâches' : 'tâche'}
            </div>
          )}
          {isToday && (
            <div className="bg-green-500/20 text-green-400 px-3 py-1.5 rounded-full text-xs sm:text-sm font-bold border border-green-500/30">
              Aujourd'hui
            </div>
          )}
        </div>
      </div>
      
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 mb-3 min-h-[140px] max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-1">
          {cards.map((card) => (
            <DraggableCard key={card.id} card={card} onEdit={onEditCard} onDelete={onDeleteCard} />
          ))}
          {cards.length === 0 && (
            <div className="text-gray-400 text-center py-12 text-sm sm:text-base">
              <Plus className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 opacity-50" />
              <p className="font-medium">Aucune tâche</p>
              <p className="text-xs mt-1 opacity-75">Glissez ou ajoutez une tâche</p>
            </div>
          )}
        </div>
      </SortableContext>
      
      <button
        onClick={onAddCard}
        className="w-full bg-white/10 hover:bg-studio-accent text-white px-3 py-2.5 rounded-lg text-sm sm:text-base flex items-center justify-center gap-2 transition-all transform hover:scale-105 active:scale-95 border border-white/20 hover:border-studio-accent font-medium shadow-md"
      >
        <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
        <span>Ajouter une tâche</span>
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
      ${isMinimized ? 'w-12 lg:w-12' : 'w-64 lg:w-56'}
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
        <div className="h-full flex flex-col p-3">
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
              className="flex-shrink-0 bg-studio-accent text-white p-2 rounded-lg hover:bg-studio-accent-light transition-colors"
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
      ${isMinimized ? 'w-12 lg:w-12' : 'w-64 lg:w-56'}
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
        <div className="h-full flex flex-col p-3">
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
              className="flex-shrink-0 bg-studio-accent text-white p-2 rounded-lg hover:bg-studio-accent-light transition-colors"
            >
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
  const [categories, setCategories] = useState(['Extérieur', 'Intérieur', 'Décor', 'Autres']);
  const [selectedCategory, setSelectedCategory] = useState('Tous');
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryInput, setShowCategoryInput] = useState(false);
  const [editForm, setEditForm] = useState({ location: '', description: '', sceneNumber: '', category: 'Autres' });

  // Charger les catégories depuis les settings
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const savedCategories = await api.getSetting('scouting_categories');
        console.log('📂 Catégories chargées depuis DB:', savedCategories);
        if (savedCategories) {
          const parsed = JSON.parse(savedCategories);
          if (Array.isArray(parsed) && parsed.length > 0) {
            console.log('✅ Application des catégories:', parsed);
            setCategories(parsed);
          }
        }
      } catch (error) {
        console.error('Error loading categories:', error);
      }
    };
    loadCategories();
  }, []);

  const handleFileUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploading(true);
    
    const uploadPromises = files.map((file) => {
      return new Promise((resolve) => {
        if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
          resolve();
          return;
        }

        // Pour les vidéos, pas de compression
        if (file.type.startsWith('video/')) {
          const reader = new FileReader();
          reader.onload = async (event) => {
            const newPhoto = {
              id: generateId(),
              imageData: event.target.result,
              location: '',
              description: '',
              sceneNumber: '',
              category: selectedCategory || 'Autres',
              mediaType: 'video',
              uploadDate: new Date().toISOString()
            };
            await onAddPhoto(newPhoto);
            resolve();
          };
          reader.readAsDataURL(file);
          return;
        }

        // Pour les images, compression avant upload
        const img = new Image();
        img.onload = async () => {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          // Limiter la taille max à 1920px
          let width = img.width;
          let height = img.height;
          const maxSize = 1920;
          
          if (width > maxSize || height > maxSize) {
            if (width > height) {
              height = (height / width) * maxSize;
              width = maxSize;
            } else {
              width = (width / height) * maxSize;
              height = maxSize;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);
          
          // Compression en JPEG qualité 0.8
          const compressedData = canvas.toDataURL('image/jpeg', 0.8);
          
          const newPhoto = {
            id: generateId(),
            imageData: compressedData,
            location: '',
            description: '',
            sceneNumber: '',
            category: selectedCategory || 'Autres',
            mediaType: 'image',
            uploadDate: new Date().toISOString()
          };
          await onAddPhoto(newPhoto);
          resolve();
        };
        
        const reader = new FileReader();
        reader.onload = (e) => {
          img.src = e.target.result;
        };
        reader.readAsDataURL(file);
      });
    });
    
    await Promise.all(uploadPromises);
    setUploading(false);
    e.target.value = '';
  };

  const startEdit = (photo) => {
    setEditingPhoto(photo.id);
    setEditForm({
      location: photo.location || '',
      description: photo.description || '',
      sceneNumber: photo.sceneNumber || '',
      category: photo.category || 'Autres'
    });
  };

  const saveEdit = async () => {
    if (editingPhoto) {
      const photo = photos.find(p => p.id === editingPhoto);
      await onUpdatePhoto(editingPhoto, { ...photo, ...editForm });
      setEditingPhoto(null);
    }
  };

  const addCategory = async () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      const updatedCategories = [...categories, newCategory.trim()];
      setCategories(updatedCategories);
      console.log('➕ Sauvegarde nouvelle catégorie:', updatedCategories);
      await api.setSetting('scouting_categories', JSON.stringify(updatedCategories));
      setNewCategory('');
      setShowCategoryInput(false);
    }
  };

  const deleteCategory = async (categoryToDelete) => {
    if (categories.length <= 1) return; // Garder au moins une catégorie
    if (categoryToDelete === 'Autres') return; // Ne pas supprimer la catégorie par défaut
    
    // Réassigner toutes les photos de cette catégorie à "Autres"
    photos.forEach(photo => {
      if (photo.category === categoryToDelete) {
        onUpdatePhoto(photo.id, { ...photo, category: 'Autres' });
      }
    });
    
    const updatedCategories = categories.filter(cat => cat !== categoryToDelete);
    setCategories(updatedCategories);
    console.log('🗑️ Sauvegarde après suppression:', updatedCategories);
    await api.setSetting('scouting_categories', JSON.stringify(updatedCategories));
    if (selectedCategory === categoryToDelete) {
      setSelectedCategory('Tous');
    }
  };

  const filteredPhotos = selectedCategory === 'Tous' 
    ? photos 
    : photos.filter(p => (p.category || 'Autres') === selectedCategory);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-bold text-white mb-2">Repérages</h2>
              <p className="text-gray-400">Photos et vidéos des lieux de tournage</p>
            </div>
            <label className="bg-studio-accent hover:bg-studio-accent-light text-white px-6 py-3 rounded-lg cursor-pointer flex items-center gap-2 transition-all transform hover:scale-105 active:scale-95">
              <Upload className="w-5 h-5" />
              {uploading ? 'Upload...' : 'Ajouter photos/vidéos'}
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Categories */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setSelectedCategory('Tous')}
              className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                selectedCategory === 'Tous'
                  ? 'bg-studio-accent text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              Tous ({photos.length})
            </button>
            {categories.map((cat) => (
              <div key={cat} className="relative group">
                <button
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm transition-all ${
                    selectedCategory === cat
                      ? 'bg-studio-accent text-white'
                      : 'bg-white/10 text-gray-300 hover:bg-white/20'
                  }`}
                >
                  {cat} ({photos.filter(p => (p.category || 'Autres') === cat).length})
                </button>
                {cat !== 'Autres' && categories.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(`Supprimer la catégorie "${cat}" ?\n\nLes photos seront déplacées dans "Autres".`)) {
                        deleteCategory(cat);
                      }
                    }}
                    className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-xs hover:bg-red-600"
                    title="Supprimer la catégorie"
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
            {showCategoryInput ? (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addCategory()}
                  placeholder="Nouvelle catégorie..."
                  className="bg-white/5 border border-white/20 rounded px-2 py-1 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-studio-accent"
                  autoFocus
                />
                <button
                  onClick={addCategory}
                  className="bg-studio-accent hover:bg-studio-accent-light text-white px-3 py-1 rounded text-sm"
                >
                  OK
                </button>
                <button
                  onClick={() => { setShowCategoryInput(false); setNewCategory(''); }}
                  className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-sm"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowCategoryInput(true)}
                className="px-3 py-1.5 rounded-lg text-sm bg-white/10 text-gray-300 hover:bg-white/20 transition-all flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Nouvelle catégorie
              </button>
            )}
          </div>
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm rounded-lg p-12 border border-white/20 text-center">
            <Camera className="w-16 h-16 text-gray-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-white mb-2">
              {selectedCategory === 'Tous' ? 'Aucune photo de repérage' : `Aucun média dans "${selectedCategory}"`}
            </h3>
            <p className="text-gray-400 mb-6">Commencez par ajouter des photos ou vidéos des lieux de tournage</p>
            <label className="inline-flex items-center gap-2 bg-studio-accent hover:bg-studio-accent-light text-white px-6 py-3 rounded-lg cursor-pointer transition-colors">
              <Upload className="w-5 h-5" />
              Ajouter photos/vidéos
              <input
                type="file"
                multiple
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhotos.map((photo) => (
              <div key={photo.id} className="bg-white/5 backdrop-blur-sm rounded-lg overflow-hidden border border-white/20 hover:border-studio-accent/50 transition-all group">
                <div className="relative aspect-video bg-black/50 cursor-pointer" onClick={() => setSelectedPhoto(photo)}>
                  {photo.mediaType === 'video' ? (
                    <>
                      <video 
                        src={photo.imageData} 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        Vidéo
                      </div>
                    </>
                  ) : (
                    <img 
                      src={photo.imageData} 
                      alt={photo.location || 'Repérage'}
                      className="w-full h-full object-cover"
                    />
                  )}
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
                    <select
                      value={editForm.category}
                      onChange={(e) => setEditForm({...editForm, category: e.target.value})}
                      className="w-full bg-white/5 border border-white/20 rounded px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-accent"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
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
                {selectedPhoto.mediaType === 'video' ? (
                  <video 
                    src={selectedPhoto.imageData} 
                    controls
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                ) : (
                  <img 
                    src={selectedPhoto.imageData} 
                    alt={selectedPhoto.location || 'Repérage'}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
                    onClick={(e) => e.stopPropagation()}
                  />
                )}
                {(selectedPhoto.location || selectedPhoto.description || selectedPhoto.category) && (
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
                    {selectedPhoto.category && (
                      <div className="mt-2 inline-block bg-studio-accent/20 text-studio-accent-light px-3 py-1 rounded-full text-sm">
                        {selectedPhoto.category}
                      </div>
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
  const [numDays, setNumDays] = useState(5);
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
    
    // Polling pour rafraîchir les données toutes les 10 secondes (au lieu de 3)
    const interval = setInterval(loadData, 10000);
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
    console.log('📸 Tentative ajout photo, taille:', photo.imageData.length, 'caractères');
    setScoutingPhotos([...scoutingPhotos, photo]);
    try {
      const result = await api.createScoutingPhoto(photo);
      console.log('✅ Photo ajoutée avec succès:', result);
    } catch (error) {
      console.error('❌ Erreur ajout photo:', error);
      // Retirer la photo du state si erreur
      setScoutingPhotos(scoutingPhotos.filter(p => p.id !== photo.id));
    }
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
      <header className="bg-studio-darker/80 backdrop-blur-lg border-b border-white/10 px-2 sm:px-4 lg:px-6 py-2 sm:py-2.5 shadow-lg">
        <div className="flex items-center justify-between max-w-[2000px] mx-auto">
          <div className="flex items-center gap-1.5 sm:gap-3 flex-1 min-w-0">
            {/* Menu burger Besoins (gauche) - seulement sur planning */}
            {currentView === 'planning' && (
              <button
                onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                className="lg:hidden text-white hover:text-studio-accent transition-colors p-1.5 hover:bg-white/10 rounded-lg flex-shrink-0"
                aria-label="Besoins"
                title="Besoins"
              >
                <Package className="w-5 h-5" />
              </button>
            )}
            
            {/* Logo */}
            <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
              <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-studio-accent flex-shrink-0" />
              <h1 className="text-xs sm:text-lg lg:text-xl font-bold sci-fi-title truncate" data-text="JEUNE PATRON PRODUCTION">
                <span className="hidden sm:inline">Jeune Patron Production</span>
                <span className="sm:hidden">JP</span>
              </h1>
            </div>
            
            {/* Navigation Tabs - Desktop */}
            <div className="hidden md:flex items-center gap-2 ml-4 lg:ml-8">
              <button
                onClick={() => setCurrentView('planning')}
                className={`px-3 lg:px-4 py-2 rounded-lg transition-all text-sm lg:text-base font-medium transform hover:scale-105 active:scale-95 ${
                  currentView === 'planning' 
                    ? 'bg-studio-accent text-white shadow-lg' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                <span className="hidden lg:inline">Planning</span>
                <span className="lg:hidden">Plan</span>
              </button>
              <button
                onClick={() => setCurrentView('scouting')}
                className={`px-3 lg:px-4 py-2 rounded-lg transition-all text-sm lg:text-base font-medium transform hover:scale-105 active:scale-95 ${
                  currentView === 'scouting' 
                    ? 'bg-studio-accent text-white shadow-lg' 
                    : 'bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white'
                }`}
              >
                <Camera className="w-4 h-4 inline mr-2" />
                <span className="hidden lg:inline">Repérages</span>
                <span className="lg:hidden">Photos</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            {/* Icônes Navigation - Mobile uniquement */}
            <button
              onClick={() => setCurrentView('planning')}
              className={`md:hidden p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95 ${
                currentView === 'planning' 
                  ? 'bg-studio-accent text-white shadow-lg' 
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              aria-label="Planning"
              title="Planning"
            >
              <Calendar className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentView('scouting')}
              className={`md:hidden p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95 ${
                currentView === 'scouting' 
                  ? 'bg-studio-accent text-white shadow-lg' 
                  : 'bg-white/10 text-gray-400 hover:text-white'
              }`}
              aria-label="Repérages"
              title="Repérages"
            >
              <Camera className="w-5 h-5" />
            </button>
            
            {/* Budget - Mobile avec icône seulement */}
            <button
              onClick={() => setBudgetSidebarOpen(!budgetSidebarOpen)}
              className="p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95 bg-green-600/20 hover:bg-green-600/30 text-green-400 border border-green-500/30 shadow-md md:px-3 md:py-1.5 md:gap-1.5"
              aria-label="Budget"
              title="Budget"
            >
              <DollarSign className="w-4 h-4 md:w-4 md:h-4" />
              <span className="hidden md:inline text-sm font-medium">Budget</span>
            </button>
            
            {/* Config dates - Desktop */}
            <button
              onClick={() => setShowDateConfig(!showDateConfig)}
              className="hidden lg:flex items-center gap-2 text-sm bg-white/10 hover:bg-white/20 text-white px-3 lg:px-4 py-1.5 rounded-lg transition-all transform hover:scale-105 active:scale-95 font-medium shadow-md"
            >
              <Calendar className="w-4 h-4" />
              <span className="hidden xl:inline">Configurer dates</span>
              <span className="xl:hidden">Dates</span>
            </button>
            
            {/* Todo - Mobile avec icône seulement */}
            {currentView === 'planning' && (
              <button
                onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                className="lg:hidden p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95 bg-white/10 hover:bg-white/20 text-white"
                aria-label="To-Do"
                title="To-Do"
              >
                <CheckSquare className="w-5 h-5" />
              </button>
            )}
            
            {/* Déconnexion - Réduit */}
            <button
              onClick={onLogout}
              className="p-1.5 sm:p-2 rounded-lg transition-all transform hover:scale-110 active:scale-95 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/30 shadow-md"
              aria-label="Déconnexion"
              title="Déconnexion"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Date Configuration Panel */}
      {showDateConfig && (
        <div className="bg-studio-darker/95 backdrop-blur-lg border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4 shadow-lg animate-fadeIn">
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-3 sm:gap-4 max-w-[2000px] mx-auto">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <label className="text-xs sm:text-sm text-gray-300 font-medium whitespace-nowrap">Date de début :</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full sm:w-auto bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent transition-all"
              />
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full sm:w-auto">
              <label className="text-xs sm:text-sm text-gray-300 font-medium whitespace-nowrap">Nombre de jours :</label>
              <input
                type="number"
                min="1"
                max="14"
                value={numDays}
                onChange={(e) => setNumDays(Math.max(1, Math.min(14, parseInt(e.target.value) || 1)))}
                className="w-full sm:w-24 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-studio-accent focus:border-transparent transition-all"
              />
            </div>
            <button
              onClick={() => setShowDateConfig(false)}
              className="w-full sm:w-auto sm:ml-auto text-sm bg-studio-accent hover:bg-studio-accent-light text-white px-4 sm:px-6 py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 font-medium shadow-md"
            >
              ✓ Valider
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
          <main className="flex-1 overflow-hidden p-3 sm:p-4 lg:p-6">
            <div className="mb-3 sm:mb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div>
                  <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                    📅 Planning de Production
                  </h2>
                  <p className="text-gray-400 text-xs sm:text-sm">
                    👆 Cliquez sur une tâche pour l'éditer • 🖐️ Glissez-déposez pour réorganiser
                  </p>
                </div>
                <button
                  onClick={() => setShowDateConfig(!showDateConfig)}
                  className="lg:hidden flex items-center gap-2 text-xs sm:text-sm bg-white/10 hover:bg-white/20 text-white px-3 sm:px-4 py-2 rounded-lg transition-all transform hover:scale-105 active:scale-95 font-medium shadow-md w-full sm:w-auto justify-center"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Configurer les dates</span>
                </button>
              </div>
            </div>
          
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-3 sm:gap-4 pb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-studio-accent/50 scrollbar-track-transparent">
              {dates.map((date) => {
                const dayCards = getCardsForDate(date);
                return (
                  <div key={date.toISOString()} className="flex-shrink-0 w-full sm:w-80 lg:w-96">
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
                <div className="bg-studio-accent/80 backdrop-blur-md rounded-xl p-4 sm:p-5 border-2 border-studio-accent rotate-3 shadow-2xl transform scale-105">
                  <div className="text-white font-bold text-sm sm:text-base">
                    🎯 {cards.find(c => c.id === activeId)?.title}
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
