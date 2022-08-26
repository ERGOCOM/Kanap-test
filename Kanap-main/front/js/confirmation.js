const idOrder = putIdOrder()
showIdOrder(idOrder)
eraseCache()

function putIdOrder() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  return urlParams.get("orderId")
}

function showIdOrder(idOrder) {
  const orderIdElement = document.getElementById("orderId")
  orderIdElement.textContent = idOrder
}

function eraseCache() {
  const cache = window.localStorage
  cache.clear()
}