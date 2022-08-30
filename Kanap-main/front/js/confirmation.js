const orderId = putorderId()
showorderId(orderId)
eraseCache()

function putorderId() {
  const queryString = window.location.search
  const urlParams = new URLSearchParams(queryString)
  return urlParams.get("orderId")
}

function showorderId(orderId) {
  const orderIdElement = document.getElementById("orderId")
  orderIdElement.textContent = orderId
}

function eraseCache() {
  const cache = window.localStorage
  cache.clear()
}