"use strict";

/*------------renderProducts--------------*/
const productsContainer = document.querySelector("#products-container");

getProducts();

async function getProducts() {
  const response = await fetch("./js/products.json");
  const productsArray = await response.json();
  console.log(productsArray);

  renderProducts(productsArray);
}

function renderProducts(productsArray) {
  productsArray.forEach(function (item) {
    const productHTML = `
     <div class="col-md-6">
              <div class="card mb-4" data-id="${item.id}">
                <img
                  class="product-img"
                  src="img/roll/${item.imgSrc}"
                  alt=${item.title}
                />
                <div class="card-body text-center">
                  <h4 class="item-title">${item.title}</h4>
                  <p>
                    <small data-items-in-box class="text-muted">${item.itemsInBox} шт.</small>
                  </p>

                  <div class="details-wrapper">
                    <div class="items counter-wrapper">
                      <div class="items__control" data-action="minus">-</div>
                      <div class="items__current" data-counter>1</div>
                      <div class="items__control" data-action="plus">+</div>
                    </div>

                    <div class="price">
                      <div class="price__weight">${item.weight}г.</div>
                      <div class="price__currency">${item.price} ₽</div>
                    </div>
                  </div>

                  <button
                    data-cart
                    type="button"
                    class="btn btn-block btn-outline-warning"
                  >
                    + в корзину
                  </button>
                </div>
              </div>
            </div>
`;
    productsContainer.insertAdjacentHTML("beforeend", productHTML);
  });
}
/*------------renderProducts--------------*/

/*-----counter.js------*/

window.addEventListener("click", function (event) {
  if (
    event.target.dataset.action === "minus" ||
    event.target.dataset.action === "plus"
  ) {
    const counterWrapper = event.target.closest(".counter-wrapper");
    const counter = counterWrapper.querySelector("[data-counter]");

    if (event.target.dataset.action === "minus") {
      if (
        event.target.closest(".cart-item") &&
        parseInt(counter.innerText) === 1
      ) {
        event.target.closest(".cart-item").remove();
        toggleCartStatus();
        calcCartPriceAndDelivery();
      } else if (Number.parseInt(counter.innerText) > 1) {
        counter.innerText = --counter.innerText;
        calcCartPriceAndDelivery();
      }
    }

    if (event.target.dataset.action === "plus") {
      if (Number.parseInt(counter.innerText) <= 9) {
        counter.innerText = ++counter.innerText;
        calcCartPriceAndDelivery();
      } else {
        alert(
          "Для заказа более 10 единиц - позвоните 8-999-555-55-55. Промо код - Регина небо коптит!"
        );
      }
    }
  }
});

/*-----counter.js------*/

/*----cart-----*/
window.addEventListener("click", function (e) {
  if (e.target.hasAttribute("data-cart")) {
    const card = e.target.closest(".card");
    const cartWrapper = document.querySelector(".cart-wrapper");

    const productInfo = {
      id: card.dataset.id,
      imgSrc: card.querySelector(".product-img").getAttribute("src"),
      title: card.querySelector(".item-title").innerText,
      itemsInBox: card.querySelector("[data-items-in-box]").innerText,
      weight: card.querySelector(".price__weight").innerText,
      price: card.querySelector(".price__currency").innerText,
      counter: card.querySelector("[data-counter]").innerText,
    };

    const itemInCart = cartWrapper.querySelector(
      `[data-id="${productInfo.id}"]`
    );

    if (itemInCart) {
      const counterEl = itemInCart.querySelector("[data-counter]");
      counterEl.innerText =
        parseInt(counterEl.innerText) + parseInt(productInfo.counter);
    } else {
      const cartItemHTML = `
    <div class="cart-item" data-id=${productInfo.id}>
                  <div class="cart-item__top">
                    <div class="cart-item__img">
                      <img src=${productInfo.imgSrc} alt=${productInfo.title} />
                      </div>
                      <div class="cart-item__desc">
                      <div class="cart-item__title">${productInfo.title}</div>
                      <div class="cart-item__weight">${productInfo.itemsInBox} / ${productInfo.weight}</div>
                      
                      <!-- cart-item__details -->
                      <div class="cart-item__details">
                      <div class="items items--small counter-wrapper">
                      <div class="items__control" data-action="minus">
                      -
                      </div>
                      <div class="items__current" data-counter="">${productInfo.counter}</div>
                      <div class="items__control" data-action="plus">+</div>
                      </div>
                      
                      <div class="price">
                      <div class="price__currency">${productInfo.price}</div>
                      </div>
                      </div>
                      <!-- // cart-item__details -->
                      <div class="current-summ"></div> 
                    </div>
                  </div>
                </div>
    `;

      cartWrapper.insertAdjacentHTML("beforeend", cartItemHTML);
    }
    card.querySelector("[data-counter]").innerText = 1;
    calcCartPriceAndDelivery();
    toggleCartStatus();
  }
});
/*----cart-----*/

/*-------toggleCartStatus -------*/
function toggleCartStatus() {
  const cartItems = document.querySelectorAll(".cart-item");
  const cartEmpty = document.querySelector("[data-cart-empty]");
  const cartTotal = document.querySelector(".cart-total");
  const orderForm = document.querySelector("#order-form");

  if (cartItems.length > 0) {
    cartEmpty.classList.add("none");
    cartTotal.classList.remove("none");
    orderForm.classList.remove("none");
  } else {
    cartEmpty.classList.remove("none");
    cartTotal.classList.add("none");
    orderForm.classList.add("none");
  }
}
/*-------toggleCartStatus-------*/

/*-------calcCartPriceAndDelivery-------*/
function calcCartPriceAndDelivery() {
  /*--------------------------calcCartPrice-----------------------------*/
  const cartItems = document.querySelectorAll(".cart-item");
  const totalPrice = document.querySelector(".total-price");
  const deliveryCost = document.querySelector(".delivery-cost");

  let totalPriceFromItems = 0;

  cartItems.forEach(function (item) {
    const amountEl = item.querySelector("[data-counter]");
    const priceEl = item.querySelector(".price__currency");
    const currentSumm = item.querySelector(".current-summ");
    /*--------------------------------------------------------*/
    const currentPrice =
      parseInt(amountEl.innerText) * parseInt(priceEl.innerText);
    currentSumm.innerText = `Сумма: ${currentPrice} ₽`;
    /*-------------------------------------------------------*/
    totalPriceFromItems += currentPrice;
  });

  totalPrice.innerText = totalPriceFromItems;

  /*----------------------------delivery---------------------------------*/
  if (totalPrice.innerText >= 1000) {
    deliveryCost.classList.add("free");
    deliveryCost.innerText = "Бесплатно";
  } else {
    deliveryCost.classList.remove("free");
    deliveryCost.innerText = "250 ₽";
  }
}
/*-------calcCartPriceAndDelivery-------*/
