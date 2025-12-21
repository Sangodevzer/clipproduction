// API client for backend communication
const API_URL = import.meta.env.PROD ? '' : 'http://localhost:3000';

export const api = {
  // Cards
  async getCards() {
    const response = await fetch(`${API_URL}/api/cards`);
    return response.json();
  },

  async createCard(card) {
    const response = await fetch(`${API_URL}/api/cards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    });
    return response.json();
  },

  async updateCard(id, card) {
    const response = await fetch(`${API_URL}/api/cards/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card)
    });
    return response.json();
  },

  async deleteCard(id) {
    const response = await fetch(`${API_URL}/api/cards/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Needs
  async getNeeds() {
    const response = await fetch(`${API_URL}/api/needs`);
    return response.json();
  },

  async createNeed(need) {
    const response = await fetch(`${API_URL}/api/needs`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(need)
    });
    return response.json();
  },

  async deleteNeed(id) {
    const response = await fetch(`${API_URL}/api/needs/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Todos
  async getTodos() {
    const response = await fetch(`${API_URL}/api/todos`);
    return response.json();
  },

  async createTodo(todo) {
    const response = await fetch(`${API_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    return response.json();
  },

  async updateTodo(id, todo) {
    const response = await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(todo)
    });
    return response.json();
  },

  async deleteTodo(id) {
    const response = await fetch(`${API_URL}/api/todos/${id}`, {
      method: 'DELETE'
    });
    return response.json();
  },

  // Settings
  async getSetting(key) {
    const response = await fetch(`${API_URL}/api/settings/${key}`);
    const data = await response.json();
    return data.value;
  },

  async setSetting(key, value) {
    const response = await fetch(`${API_URL}/api/settings/${key}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ value })
    });
    return response.json();
  }
};
