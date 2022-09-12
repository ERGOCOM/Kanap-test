// // Localisation et récuperation de l'URL de la page produit
function getUrlParams() {
    return new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(prop),
    });
  }
  
  function getQueryParam(param) {
    const params = getUrlParams();
    return params[param];
  }
  
  const id = getQueryParam("id");
  if (id != null) {
    let itemPrice = 0;
    let imgUrl, altText, dataName;
  }
  
  // Récupération des données de l'API + ID
  fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((res) => takeData(res));
  
  // Création du produit et appel des fonctions
  function takeData(sofa) {
    console.log(sofa);
    const { imageUrl, altTxt, name, description, price, colors } = sofa;
    itemPrice = price;
    imgUrl = imageUrl;
    altText = altTxt;
    dataName = name;
    makeImage(imageUrl, altTxt);
    makeTitle(name);
    makePrice(price);
    makeDescription(description);
    makeColors(colors);
  }
  
  // Création de l'image
  function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = altTxt;
    const parent = document.querySelector(".item__img");
    parent.appendChild(image);
  }
  
  // Création du titre
  function makeTitle(name) {
    document.querySelector("#title").textContent = name;
  }
  
  // Création du prix
  function makePrice(price) {
    document.querySelector("#price").textContent = price;
  }
  
  // Création de la déscription
  function makeDescription(description) {
    document.querySelector("#description").textContent = description;
  }
  
  // Création de la couleur et de ses options 
  function makeColors(colors) {
    const select = document.querySelector("#colors");
  
    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    });
  }
  
  // Création d'un évenement "click" sur le boutton "ajouter au panier"
  const button = document.querySelector("#addToCart");
  if (button != null) {
    button.addEventListener("click", (e) => {
      const color = document.querySelector("#colors").value;
      const quantity = document.querySelector("#quantity").value;
      addCart(color, quantity);
    });
  }
  
  // Sauvegarde de certaunes informations dans le localStorage
  function addCart(color, quantity) {
    const data = {
      id: id,
      color: color,
      quantity: parseInt(quantity),
    }
    localStorage.setItem(`${id}-${color}`, JSON.stringify(data));
  }
