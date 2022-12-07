import {addLocalStorage, removeLocalStorage, clearLocalStorage} from '../local-storage.js';


// const clearLocalStorage = () => {
//   for (let i = 0; i < localStorage.length;) {
//     let key = localStorage.key(i);
//     localStorage.removeItem(key);
//   }
// };

// clearLocalStorage();



class Cart {
  constructor(items) {

    // all products from local storage
    this.items = items;

    this.itemsSimple;
    this.itemsExtended;

    // view
    this.$containerSimples;
    this.$tableBodySimple;

  }

  // add items 
  populateCart() {

    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let storageItem = JSON.parse(localStorage.getItem(key));
      let item = {
        id: storageItem.id,
        name: storageItem.name,
        color: storageItem.color,
        size: storageItem.size,
        quantity: storageItem.quantity,
        price: storageItem.price
      }
  
      this.items.push(item);
    }

    console.log(this.items);
  
  }


  // methods for simple cart
  createHtmlSimple () {
    return `<div class="p-2 text-center bg-light">Cart:</div>
    <table class="table table-bordered">
      <thead>
        <th scope="col">Item</th>
        <th scope="col">Quantity</th>
        <th scope="col">Price</th>
        <th scope="col"></th>
      </thead>
      <tbody>
      </tbody>

    </table> <!-- table -->

    <div class="mt-3" id="cart-buttons">
      <a href="checkout.html" class="btn btn-primary px-3">Checkout</a>
      <button type="button" class="btn btn-secondary px-3" id="clear-cart">Clear cart</button>
    </div>`;
  }

  createTbodyHtmlSimple (itemSimple) {
    return `<td>${itemSimple.name}</td>
    <td>${itemSimple.quantity}</td>
    <td>${itemSimple.price.toFixed(2)}</td>
    <td><button class="btn-close" aria-label="Close"></button></td>`;
  }

  renderRowsSimple () {

    // clear cart
    while (this.$tableBodySimple.firstChild) {
      this.$tableBodySimple.removeChild(this.$tableBodySimple.firstChild);
    }

    // prepare a new array from items for displaying
    this.itemsSimple = this.items.reduce( (accumulator, currentItem) => {
      if (accumulator.length == 0) {
        return [...accumulator, {name: currentItem.name, quantity: currentItem.quantity, price: currentItem.price}];
      } else {
        let res;
        let duplicate = accumulator.find(e => e.name == currentItem.name);
          duplicate == undefined
            ? (res = true)
            : (res = false);
        if (res) {
          return [...accumulator, {name: currentItem.name, quantity: currentItem.quantity, price: currentItem.price}];
        } else {
          duplicate.quantity += currentItem.quantity;
          duplicate.price += currentItem.price;
          return accumulator;
        }
      }
    },[] );


    // Make rows out of itemsSimple, append

    this.itemsSimple.forEach((itemSimple) => {
      let rowEl = document.createElement('tr');
      rowEl.innerHTML = this.createTbodyHtmlSimple(itemSimple);
  
      let deleteBtnEl = rowEl.querySelector('button');
      deleteBtnEl.addEventListener('click', () => {

        // delete from local storage
        removeLocalStorage(itemSimple.name.replace(' ', '').toLowerCase());

        // update cart data and rows
        this.updateCart();
      });

      this.$tableBodySimple.append(rowEl);
    });

  }

  renderSimple () {
    // make container
    this.$containerSimple = document.createElement('div');
    this.$containerSimple.classList.add('col-3');
    this.$containerSimple.setAttribute('id', 'cart');

    // populate with html
    this.$containerSimple.innerHTML = this.createHtmlSimple();
    this.$tableBodySimple = this.$containerSimple.querySelector('tbody');

    // clear cart button functionality
    let buttonEl = this.$containerSimple.querySelector('#clear-cart');
    buttonEl.addEventListener('click', () => {
      clearLocalStorage();

      this.updateCart();
    })

    this.renderRowsSimple();
  }


  updateCart () {
    this.items = [];

    // update items from local storage
    this.populateCart();

    // re-render tdoby
    this.renderRowsSimple();
  }

}


function populateCart() {

  let productsArr = [];

  if (localStorage.length > 0) {
    for (let i = 0; i < localStorage.length; i++) {
      let key = localStorage.key(i);
      let storageItem =JSON.parse(localStorage.getItem(key));
      let item = {
        id: storageItem.id,
        name: storageItem.name,
        color: storageItem.color,
        size: storageItem.size,
        quantity: storageItem.quantity,
        price: storageItem.price
      }

      productsArr.push(item);
    }
  }

  return productsArr;
}


const cart = new Cart([]);
cart.populateCart();
cart.renderSimple();


export {cart};