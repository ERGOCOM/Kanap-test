let cart = [];

takeItems();
const form = document.querySelector(".cart__order__form");
form.addEventListener("submit", (e) => sendForm(e));

function takeItems() {
  const numberOfItems = localStorage.length;
  for (let i = 0; i < numberOfItems; i++) {
    const item = localStorage.getItem(localStorage.key(i));
    const itemObject = JSON.parse(item);
    const id = itemObject.id;
    promises[i] =  fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json());
  }
  Promise.all(promises).then((values) => {
    for (let i = 0; i < numberOfItems; i++) {
      const cartItem = localStorage.getItem(localStorage.key(i));
      const cartItemObject = JSON.parse(cartItem);
      const item =  {...values[i], ...cartItemObject};
      cart.push(item);
    }
    cart.forEach((item) => showItem(item));
  });
  
  
}

function showItem(item) {
  const article = makeArticle(item);
  const imageDiv = makeImage(item);
  article.appendChild(imageDiv);
  const cardItemContent = makeCartContent(item);
  article.appendChild(cardItemContent);
  showArticle(article);
  showTotalQuantity();
  showTotalPrice();
}

function showTotalQuantity() {
  const totalQuantity = document.querySelector("#totalQuantity");
  const total = cart.reduce((total, item) => total + item.quantity, 0);
  totalQuantity.textContent = total;
}

function showTotalPrice() {
  const totalPrice = document.querySelector("#totalPrice");
  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  totalPrice.textContent = total;
}

function makeCartContent(item) {
  const cardItemContent = document.createElement("div");
  cardItemContent.classList.add("cart__item__content");

  const description = makeDescription(item);
  const settings = makeSettings(item);

  cardItemContent.appendChild(description);
  cardItemContent.appendChild(settings);
  return cardItemContent;
}

function makeSettings(item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  addQuantity(settings, item);
  addDelete(settings, item);
  return settings;
}

function addDelete(settings, item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  div.addEventListener("click", () => deleteItem(item));

  const p = document.createElement("p");
  p.textContent = "Supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}
function deleteItem(item) {
  const itemToDelete = cart.findIndex(
    (product) => product.id === item.id && product.color === item.color
  );
  cart.splice(itemToDelete, 1);
  showTotalPrice();
  showTotalQuantity();
  deleteData(item);
  deleteArticle(item);
}
function deleteArticle(item) {
  const eraseArticle = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  eraseArticle.remove();
}

function addQuantity(settings, item) {
  const quantity = document.createElement("div");
  quantity.classList.add("cart__item__content__settings__quantity");
  const p = document.createElement("p");
  p.textContent = "Qté : ";
  quantity.appendChild(p);
  const input = document.createElement("input");
  input.type = "number";
  input.classList.add("itemQuantity");
  input.name = "itemQuantity";
  input.min = "1";
  input.max = "100";
  input.value = item.quantity;
  input.addEventListener("input", () =>
    newPriceQuantity(item.id, input.value, item)
  );

  quantity.appendChild(input);
  settings.appendChild(quantity);
}

function newPriceQuantity(id, newValue, item) {
  console.log("newPriceQuantity", id, newValue, item);
  const itemNewValue = cart.find((cartItem) => cartItem.id === id);
  itemNewValue.quantity = Number(newValue);
  item.quantity = itemNewValue.quantity;
  showTotalQuantity();
  showTotalPrice();
  saveNewData(item);
}

function deleteData(item) {
  const key = `${item.id}-${item.color}`;
  localStorage.removeItem(key);
}

function saveNewData(item) {
  const dataToSave = JSON.stringify(item);
  const key = `${item.id}-${item.color}`;
  localStorage.setItem(key, dataToSave);
}

function makeDescription(item) {
  const description = document.createElement("div");
  description.classList.add("cart__item__content__description");

  const h2 = document.createElement("h2");
  h2.textContent = item.name;
  const p = document.createElement("p");
  p.textContent = item.color;
  const p2 = document.createElement("p");
  p2.textContent = item.price + " €";

  description.appendChild(h2);
  description.appendChild(p);
  description.appendChild(p2);
  return description;
}

function showArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}
function makeArticle(item) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}
function makeImage(item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__img");

  const image = document.createElement("img");
  image.src = item.imageUrl;
  image.alt = item.altTxt;
  div.appendChild(image);
  return div;
}

function sendForm(e) {
  e.preventDefault()
  if (cart.length === 0) {
    alert("Votre panier est vide")
    return
  }

  if (notCompleteForm()) return
  if (notValidEmail()) return

  const body = makeRequest();
  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      const orderId = data.orderId;
      console.log("data: ", data);
      window.location.href = "./confirmation.html" + "?orderId=" + orderId;
    });
}

function notValidEmail() {
  const email = document.querySelector("#email").value
  const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
  if (regex.test(email) === false) {
    alert("Entrez un email valide")
    return true
  }
  return false
}

function notCompleteForm() {
  const form = document.querySelector(".cart__order__form")
  const inputs = form.querySelectorAll("input")
  inputs.forEach((input) => {
    if (input.value === "") {
      alert("Remplissez tous les champs")
      return true
    }
    return false
  })
}

function makeRequest() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;
  const body = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: takeIds(),
  };
  return body;
}

function takeIds() {
  const numberOfProducts = localStorage.length;
  const ids = [];
  for (let i = 0; i < numberOfProducts; i++) {
    const key = localStorage.key(i);
    const id = key.split("-")[0];
    ids.push(id);
  }
  return ids;
}
