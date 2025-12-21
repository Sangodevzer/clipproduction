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
  ChevronRight
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
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-studio-accent p-4 rounded-full mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold sci-fi-title mb-2" data-text="JEUNE PATRON PRODUCTION">
              Jeune Patron Production
            </h1>
            <p className="text-gray-300 text-center">Gestion de Production de Clips</p>
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
      className={`${categoryColors[card.category] || categoryColors.other} backdrop-blur-sm rounded-lg p-4 border-2 mb-3 cursor-pointer hover:shadow-lg transition-all min-h-[120px]`}
      onClick={() => setIsEditing(true)}
    >
      <div className="flex items-start gap-2">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing mt-1">
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-white mb-1">{card.title}</h3>
          {card.description && (
            <div>
              <p className="text-sm text-gray-300 mb-2">
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
            <div className="flex items-center gap-1 text-xs text-gray-300 mb-1">
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
      className={`flex-shrink-0 w-80 bg-white/5 backdrop-blur-sm rounded-lg p-4 border-2 transition-all ${
        isOver ? 'border-studio-accent bg-studio-accent/10 scale-105' : 'border-white/10'
      }`}
    >
      <div className="mb-4">
        <div className="text-studio-accent-light text-sm font-medium">{dayName}</div>
        <div className="text-white text-2xl font-bold">{dayNumber} {monthName}</div>
      </div>
      
      <SortableContext items={cards.map(c => c.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2 mb-4 min-h-[200px]">
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
        className="w-full bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-colors border border-white/20"
      >
        <Plus className="w-4 h-4" />
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
      ${isMinimized ? 'w-16' : 'w-80'}
    `}>
      {isMinimized ? (
        <div className="h-full flex flex-col items-center py-6 gap-4">
          <button
            onClick={() => setIsMinimized(false)}
            className="text-studio-accent hover:text-studio-accent-light transition-colors p-2 rounded-lg hover:bg-white/10"
            title="Agrandir"
          >
            <Package className="w-6 h-6" />
          </button>
          <div className="text-white text-xs writing-mode-vertical transform rotate-180">
            Besoins ({needs.length})
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Package className="w-6 h-6 text-studio-accent" />
              <h2 className="text-xl font-bold text-white">Besoins</h2>
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
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-studio-accent"
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
      ${isMinimized ? 'w-16' : 'w-80'}
    `}>
      {isMinimized ? (
        <div className="h-full flex flex-col items-center py-6 gap-4">
          <button
            onClick={() => setIsMinimized(false)}
            className="text-studio-accent hover:text-studio-accent-light transition-colors p-2 rounded-lg hover:bg-white/10"
            title="Agrandir"
          >
            <CheckSquare className="w-6 h-6" />
          </button>
          <div className="text-white text-xs writing-mode-vertical transform rotate-180">
            To-Do ({todos.filter(t => !t.completed).length}/{todos.length})
          </div>
        </div>
      ) : (
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CheckSquare className="w-6 h-6 text-studio-accent" />
              <h2 className="text-xl font-bold text-white">To-Do</h2>
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
              className="flex-1 bg-white/5 border border-white/20 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-studio-accent"
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

// Main Dashboard Component
const Dashboard = ({ onLogout }) => {
  const [cards, setCards] = useState([]);
  const [needs, setNeeds] = useState([]);
  const [todos, setTodos] = useState([]);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [startDate, setStartDate] = useState('2026-01-05');
  const [numDays, setNumDays] = useState(5);
  const [showDateConfig, setShowDateConfig] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cardsData, needsData, todosData, savedStartDate, savedNumDays] = await Promise.all([
          api.getCards(),
          api.getNeeds(),
          api.getTodos(),
          api.getSetting('start_date'),
          api.getSetting('num_days')
        ]);

        setCards(cardsData);
        setNeeds(needsData);
        setTodos(todosData);
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
      <header className="bg-studio-darker/80 backdrop-blur-lg border-b border-white/10 px-4 lg:px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
              className="lg:hidden text-white hover:text-studio-accent transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-2">
              <Calendar className="w-6 h-6 text-studio-accent" />
              <h1 className="text-xl lg:text-2xl font-bold sci-fi-title" data-text="JEUNE PATRON PRODUCTION">
                Jeune Patron Production
              </h1>
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
              onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
              className="lg:hidden text-white hover:text-studio-accent transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={onLogout}
              className="text-sm bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Déconnexion
            </button>
          </div>
        </div>
      </header>

      {/* Date Configuration Panel */}
      {showDateConfig && (
        <div className="bg-studio-darker/95 backdrop-blur-lg border-b border-white/10 px-6 py-4">
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
        {/* Left Sidebar */}
        <NeedsSidebar 
          needs={needs} 
          onAddNeed={addNeed}
          onDeleteNeed={deleteNeed}
          isOpen={leftSidebarOpen}
          onClose={() => setLeftSidebarOpen(false)}
        />

        {/* Calendar Board */}
        <main className="flex-1 overflow-x-auto overflow-y-hidden p-4 lg:p-6">
          <div className="mb-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-2">Planning</h2>
                <p className="text-gray-400">Glissez-déposez les tâches entre les jours</p>
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
            <div className="flex gap-4 pb-4">
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

        {/* Right Sidebar */}
        <TodoSidebar 
          todos={todos} 
          onAddTodo={addTodo}
          onToggleTodo={toggleTodo}
          onDeleteTodo={deleteTodo}
          isOpen={rightSidebarOpen}
          onClose={() => setRightSidebarOpen(false)}
        />
      </div>

      {/* Mobile overlay */}
      {(leftSidebarOpen || rightSidebarOpen) && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => {
            setLeftSidebarOpen(false);
            setRightSidebarOpen(false);
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
