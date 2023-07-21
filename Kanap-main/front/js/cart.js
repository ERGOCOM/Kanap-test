let cart = [];

// Ecoute de l'évenement sur l'envoi du formulaire 
takeItems();
const form = document.querySelector(".cart__order__form");
form.addEventListener("submit", (e) => sendForm(e));


// Recupération localstorage création d"un tableau avec fusion de l'api
function takeItems() {
  const promises = [];
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

// Affichage des produits dans le panier
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

//Calcul de la quantité totale des articles
function showTotalQuantity() {
  const totalQuantity = document.querySelector("#totalQuantity");
  const total = cart.reduce((total, item) => total + item.quantity, 0);
  totalQuantity.textContent = total;
}

//Calcul du prix total des articles 
function showTotalPrice() {
  const totalPrice = document.querySelector("#totalPrice");
  const total = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  totalPrice.textContent = total;
}

// Création du contenu de la description
function makeCartContent(item) {
  const cardItemContent = document.createElement("div");
  cardItemContent.classList.add("cart__item__content");

  const description = makeDescription(item);
  const settings = makeSettings(item);

  cardItemContent.appendChild(description);
  cardItemContent.appendChild(settings);
  return cardItemContent;
}

// Création des contenus des settings
function makeSettings(item) {
  const settings = document.createElement("div");
  settings.classList.add("cart__item__content__settings");

  addQuantity(settings, item);
  addDelete(settings, item);
  return settings;
}

// Création du bouton supprimer 
function addDelete(settings, item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__content__settings__delete");
  div.addEventListener("click", () => deleteItem(item));

  const p = document.createElement("p");
  p.textContent = "Supprimer";
  div.appendChild(p);
  settings.appendChild(div);
}

// Suppression de l'article et nouveau calcul (prix et quantité)
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

//Suppression d'un article en fonction de l'id et color
function deleteArticle(item) {
  const eraseArticle = document.querySelector(
    `article[data-id="${item.id}"][data-color="${item.color}"]`
  );
  eraseArticle.remove();
}

// Création de l'input quantité et possibilité de changer la quantité
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

// Nouveau calcul des quantités et du prix total
function newPriceQuantity(id, newValue, item) {
  console.log("newPriceQuantity", id, newValue, item);
  const itemNewValue = cart.find((cartItem) => cartItem.id === id);
  itemNewValue.quantity = Number(newValue);
  item.quantity = itemNewValue.quantity;
  showTotalQuantity();
  showTotalPrice();
  saveNewData(item);
}

//Suppression de l'article dans le localStorage
function deleteData(item) {
  const key = `${item.id}-${item.color}`;
  localStorage.removeItem(key);
}

// Sauvegarde du nouveau calcul dans le localStorage
function saveNewData(item) {
  const dataToSave = JSON.stringify(item);
  const key = `${item.id}-${item.color}`;
  localStorage.setItem(key, dataToSave);
}

// Création du contenu de la description
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

//Rattachement et affichage des articles
function showArticle(article) {
  document.querySelector("#cart__items").appendChild(article);
}
// Création de l'article
function makeArticle(item) {
  const article = document.createElement("article");
  article.classList.add("cart__item");
  article.dataset.id = item.id;
  article.dataset.color = item.color;
  return article;
}

// Création de l'image
function makeImage(item) {
  const div = document.createElement("div");
  div.classList.add("cart__item__img");

  const image = document.createElement("img");
  image.src = item.imageUrl;
  image.alt = item.altTxt;
  div.appendChild(image);
  return div;
}

// POST du formulaire et création d'un bon de commande , Redirection vers la page confirmation
function sendForm(e) {
  e.preventDefault()
  if (cart.length === 0) {
    alert("Votre panier est vide")
    return
  }

  if (notCompleteForm()) return
  if (notValidFirstName()) return
  if (notValidLastName()) return
  if (notValidAdress()) return
  if (notValidCity()) return
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


// Vérification des saisies du prénom à l'aide de regex
function notValidFirstName() {
  const firstName = document.querySelector("#firstName").value
  const regex = /^[a-z ,.'-]+$/
  if (regex.test(firstName) === false) {
        const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg")
        firstNameErrorMsg.textContent = "Veuillez entrer un prénom valide"
      return true
  }
  return false
}

// Vérification des saisies du nom à l'aide de regex
function notValidLastName() {
  const lastName = document.querySelector("#lastName").value
  const regex = /^[A-Za-z\é\è\ê\ë\ï\ä\-]+$/
  if (regex.test(lastName) === false) {
    const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg")
    lastNameErrorMsg.textContent = "Veuillez entrer un nom valide"
    return true
  }
  return false
}

// Vérification des saisies de l'adresse à l'aide de regex
function notValidAdress() {
  const address = document.querySelector("#address").value
  const regex = /^[0-9]{1,3}(?:(?:[,. ]){1}[-a-zA-Zàâäéèêëïîôöùûüç]+)+$/
  if (regex.test(address) === false) {
    const addressErrorMsg = document.querySelector("#addressErrorMsg")
    addressErrorMsg.textContent = "Veuillez entrer une adresse valide"
    return true
  }
  return false
}

// Vérification des saisies de la ville à l'aide de regex
function notValidCity() {
  const city = document.querySelector("#city").value
  const regex = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/
  if (regex.test(city) === false) {
    const cityErrorMsg = document.querySelector("#cityErrorMsg")
    cityErrorMsg.textContent = "Veuillez entrer une ville valide"
    return true
  }
  return false
}

// Vérification des saisies de l'email à l'aide de regex
function notValidEmail() {
  const email = document.querySelector("#email").value
  const regex = /^[A-Za-z0-9+_.-]+@(.+)$/
  if (regex.test(email) === false) {
    const emailErrorMsg = document.querySelector("#emailErrorMsg")
    emailErrorMsg.textContent = "Veuillez entrer un email valide"
    return true
  }
  return false
}

// Vérification du remplissage complet du formulaire
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

// Création des éléments pour le formulaire
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

//Récuperation des ids du Localstorage
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