const orderId = putorderId()
showorderId(orderId)
eraseCache()

// Recupération de l'orderID dans le local Storage

function putorderId() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  return urlParams.get("orderId")
}

// Création de l'orderID 

function showorderId(orderId) {
  const orderIdElement = document.getElementById("orderId")
  orderIdElement.textContent = orderId
}

//Suppression dans le localStorage
function eraseCache() {
  const cache = window.localStorage
  cache.clear()
}