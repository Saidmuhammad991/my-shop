// ========== Общие переменные ==========
let products = JSON.parse(localStorage.getItem('products') || '[]');

// ========== Отображение товаров ==========
function renderProducts() {
  const container = document.getElementById('product-list');
  if (!container) return;

  container.innerHTML = '';
  products.forEach(p => {
    const div = document.createElement('div');
    div.className = 'product';

    const media = p.image.startsWith("data:video")
      ? `<video src="${p.image}" controls width="100%"></video>`
      : `<img src="${p.image}" alt="${p.name}">`;

    div.innerHTML = `
      ${media}
      <h2>${p.name}</h2>
      <p>${p.price} сум</p>
    `;
    container.appendChild(div);
  });
}

// ========== Добавление товара ==========
function addProduct() {
  const name = document.getElementById('name').value.trim();
  const price = document.getElementById('price').value.trim();
  const file = document.getElementById('file').files[0];

  if (!name || !price || !file) {
    alert("Заполните все поля и выберите фото или видео");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    const imageData = e.target.result;

    products.push({ name, price, image: imageData });
    localStorage.setItem('products', JSON.stringify(products));
    renderProducts();
    renderAdminList();
    clearForm();
  };
  reader.readAsDataURL(file);
}

// ========== Удаление товара ==========
function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  renderProducts();
  renderAdminList();
}

// ========== Список товаров в админке ==========\\
function renderAdminList() {
  const list = document.getElementById('admin-list');
  if (!list) return;

  list.innerHTML = '';
  products.forEach((p, i) => {
    const li = document.createElement('li');
    li.innerHTML = `
      ${p.name} – ${p.price} сум
      <button onclick="deleteProduct(${i})">Удалить</button>
    `;
    list.appendChild(li);
  });
}

// ========== Очистка формы ==========\\
function clearForm() {
  document.getElementById('name').value = '';
  document.getElementById('price').value = '';
  document.getElementById('file').value = '';
}

// ========== Запуск ==========\\
window.addEventListener('DOMContentLoaded', () => {
  renderProducts();
  renderAdminList();
});
function checkout() {
  const username = document.getElementById('tg-username').value.trim();

  if (!username.startsWith('@')) {
    alert("Пожалуйста, введите ваш Telegram username (начинается с @)");
    return;
  }

  let message = `🛒 Новый заказ от ${username}:\n\n`;
  cart.forEach(item => {
    message += `📦 ${item.name} — ${item.price} сум\n`;
  });

  const total = cart.reduce((sum, item) => sum + parseInt(item.price), 0);
  message += `\n💰 Итого: ${total} сум`;

  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: message
    })
  }).then(res => {
    if (res.ok) {
      alert("Заказ отправлен! Мы с вами свяжемся в Telegram ❤️");
      localStorage.removeItem('cart');
      cart = [];
      renderCart();
    } else {
      alert("Ошибка отправки заказа 😢");
    }
  });
}



//======================go go ========================//