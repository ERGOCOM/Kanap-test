function getCart() {
  if (!localStorage.getItem("kanap")) {
    localStorage.setItem("kanap", JSON.stringify({}));
  }
  return JSON.parse(localStorage.getItem("kanap"));
}
function setCart(cart) {
  localStorage.setItem("kanap", JSON.stringify(cart));
}
