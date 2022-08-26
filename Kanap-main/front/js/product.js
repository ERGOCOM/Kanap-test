// Récupération de la valeur "id" dans l'URL
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
  
  fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((res) => takeData(res));
  
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
  
  function makeImage(imageUrl, altTxt) {
    const image = document.createElement("img");
    image.src = imageUrl;
    image.alt = altTxt;
    const parent = document.querySelector(".item__img");
    parent.appendChild(image);
  }
  
  function makeTitle(name) {
    document.querySelector("#title").textContent = name;
  }
  
  function makePrice(price) {
    document.querySelector("#price").textContent = price;
  }
  
  function makeDescription(description) {
    document.querySelector("#description").textContent = description;
  }
  
  function makeColors(colors) {
    const select = document.querySelector("#colors");
  
    colors.forEach((color) => {
      const option = document.createElement("option");
      option.value = color;
      option.textContent = color;
      select.appendChild(option);
    });
  }
  
  const button = document.querySelector("#addToCart");
  if (button != null) {
    button.addEventListener("click", (e) => {
      const color = document.querySelector("#colors").value;
      const quantity = document.querySelector("#quantity").value;
      addCart(color, quantity);
    });
  }
  
  function addCart(color, quantity) {
    const data = {
      name: dataName,
      id: id,
      color: color,
      quantity: parseInt(quantity),
      price: itemPrice,
      imageUrl: imgUrl,
      altTxt: altText,
    }
    localStorage.setItem(`${id}-${color}`, JSON.stringify(data));
  }
