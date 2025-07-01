// Seletores de elementos DOM
const DOM = {
  form: document.getElementById('manutForm'),
  historyTable: document.querySelector('.historico table'),
  tbody: document.getElementById('listaManutencoes'),
  inputs: {
    painel: document.getElementById('painel'),
    descricao: document.getElementById('descricao')
  }
};

// Estado da aplicação
const state = {
  manutencoes: JSON.parse(localStorage.getItem('manutencoes')) || [],
  isLoading: false
};

// Inicializa a aplicação
document.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  setupEventListeners();
  renderHistoryTable();
}

function setupEventListeners() {
  DOM.form.addEventListener('submit', handleFormSubmit);
}

async function handleFormSubmit(event) {
  event.preventDefault();
  
  try {
    const formData = getFormData();
    validateFormData(formData);
    
    addManutencao(formData);
    saveToLocalStorage();
    renderHistoryTable();
    
    showSuccessMessage('Manutenção registrada com sucesso!');
    DOM.form.reset();
  } catch (error) {
    showErrorMessage(error.message);
  }
}

// Funções auxiliares
function getFormData() {
  return {
    painel: DOM.inputs.painel.value.trim(),
    descricao: DOM.inputs.descricao.value.trim(),
    data: new Date().toISOString()
  };
}

function validateFormData(data) {
  if (!data.painel) throw new Error('Nome do painel é obrigatório');
  if (!data.descricao) throw new Error('Descrição da manutenção é obrigatória');
  if (data.descricao.length < 10) throw new Error('Descrição muito curta (mínimo 10 caracteres)');
}

function addManutencao(manutencao) {
  state.manutencoes.unshift(manutencao); // Adiciona no início do array
}

function saveToLocalStorage() {
  localStorage.setItem('manutencoes', JSON.stringify(state.manutencoes));
}

function renderHistoryTable() {
  DOM.tbody.innerHTML = '';
  
  state.manutencoes.forEach(manutencao => {
    const row = document.createElement('tr');
    
    row.innerHTML = `
      <td>${manutencao.painel}</td>
      <td>${manutencao.descricao}</td>
      <td>${formatDate(manutencao.data)}</td>
    `;
    
    DOM.tbody.appendChild(row);
  });
}

function formatDate(dateString) {
  const options = { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return new Date(dateString).toLocaleDateString('pt-BR', options);
}

function showSuccessMessage(message) {
  const alert = document.createElement('div');
  alert.className = 'alert success';
  alert.textContent = message;
  document.body.prepend(alert);
  
  setTimeout(() => alert.remove(), 3000);
}

function showErrorMessage(message) {
  const alert = document.createElement('div');
  alert.className = 'alert error';
  alert.textContent = message;
  document.body.prepend(alert);
  
  setTimeout(() => alert.remove(), 3000);
}