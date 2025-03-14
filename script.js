let productsGrid = document.getElementById('productsGrid')
let productsArray = []
let productList = []

const url = "https://marketplacedatabase-be89.restdb.io/rest/product"
const my_headers = {
    "Content-Type": "application/json",
    "x-apikey": "6767fd07e70533e463358497",
    "cache-control": "no-cache"
}

fetch(url, {
    method: "GET",
    headers: my_headers
})
.then(async function(response) {
    const result = await response.json()
    productList = result

    for(let i = 0; i < result.length; i++) {
        let product = result[i]

        let productElem = document.createElement('div')
        productElem.classList.add('product')
        result[i].desciption.length > 25 ? result[i].desciption = `${result[i].desciption.slice(0, 25)}...` : result[i].desciption
        productElem.innerHTML = 
            `<div class="photo-container"><img class='product-photo' src='${result[i].photo_url}' alt='${result[i].name}'></div>
            <h2 class='product-name'>${result[i].name}</h2>
            <a href="https://github.com/HayvenX">Seller profile</a>
            <p class='product-price'>$${result[i].price}</p>
            <button onclick="addProductToCart(${i}, this)" class="cardBtn">Buy</button>`
        
        productsGrid.append(productElem)
        productsArray.push(productsGrid[i])
    
        const button = productElem.querySelector('.cardBtn')
        const inCart = cart.some(p => p._id === product._id)

        if (inCart) {
            button.classList.add('productInCart')
            button.textContent = "In the cart"
        }

        button.onclick = () => addProductToCart(i, button)
    }
})

// CART ----------------

let cardBtn = document.getElementsByClassName('cardBtn')
let cartProd = document.getElementById('cartProducts')
let cartStatus = document.getElementById('cartStatus')
let products = document.getElementById('products')
const cartImg = document.getElementById('cartImg')
let alertText = document.getElementById('alertText')
let textContainer = document.getElementById('textContainer')
const exit = document.getElementById('exit')
const modalOverlay = document.getElementById('modalOverlay')
const openModalButton = document.getElementById('cartBtn')
const closeModalButton = exit
const searchInput = document.getElementById('productSearch')

let paidPurchase = false

searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase()
    const products = document.querySelectorAll('.product')
    products.forEach(product => {
        const productName = product.querySelector('.product-name').textContent.toLowerCase()
        product.style.display = productName.includes(searchTerm) ? 'block' : 'none'
    })
})

openModalButton.addEventListener('click', function OpenModalButton() {
    modalOverlay.classList.add('active')
    document.body.style.overflow = 'hidden'

    setTimeout(() => {
        let allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            if (button.id !== 'buyAllBtn') {
                button.setAttribute('disabled', 'true')
            }
        })
    }, 0)

    if(paidPurchase) {
        cartImg.setAttribute('src', 'img/cartImg.svg')
        alertText.textContent = 'Cart is empty'
        paidPurchase = false
    }
    cartProd.appendChild(exit)
    cartStatus.appendChild(alertText)
})
closeModalButton.addEventListener('click', () => {
    modalOverlay.classList.remove('active')
    document.body.style.overflow = 'visible'

    setTimeout(() => {
        let allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            button.removeAttribute('disabled')
        })
    }, 0)
})
modalOverlay.addEventListener('click', (event) => {
if (event.target === modalOverlay) {
    modalOverlay.classList.remove('active')
    document.body.style.overflow = 'visible'

    setTimeout(() => {
        let allButtons = document.querySelectorAll('button');
        allButtons.forEach(button => {
            button.removeAttribute('disabled')
        })
    }, 0)
}
})

let cart = []
{
    let tmp = localStorage.getItem('cart')
    if(tmp) {
        cart = JSON.parse(tmp)
        cart.length ? redrawCartProducts() : null
    }
}

function addProductToCart(id, btn) {
    openModalButton.click()
    
    let product = productList[id]

    if(cart.some(p => p._id === product._id)) {
        btn.classList.add('productInCart')
        btn.textContent = "In the cart"
        return
    }
    
    cart.push(product)
    drawCartProducts(id)
    localStorage.setItem("cart", JSON.stringify(cart))

    btn.classList.add('productInCart')
    btn.textContent = "In the cart"
}

function drawCartProducts(id) { 
    alertText.textContent == "" ? textContainer.innerHTML = "" : null
    
    paidPurchase = false
    exit.style.marginTop = '-23%'
    cartImg.remove()
    alertText.textContent = ''
    cartStatus.style.display = 'none'
    
    let sum = 0
    products.innerHTML += `<div class="cartProduct"> 
                                <img src="${productList[id].photo_url}" class="cartProductImg"> 
                                <h4 class="productName">${productList[id].name.length > 12 ? productList[id].name = `${productList[id].name.slice(0, 12)}...` : productList[id].name}</h4>
                                <h3 class="productPrice">$${productList[id].price}</h3>
                            </div>`
    
    const cartProduct = document.createElement('div')
    cartProduct.classList.add('cartProduct')

    for(let i = 0; i < cart.length; i++) {
        sum += productList[id].price
    }

    textContainer.innerHTML += `<input type="text" placeholder="Full Name" class="infoInput">
                                <input placeholder="Adress" class="infoInput"><br>
                                <input type="number" placeholder="Phone Number" class="infoInput">
                                <input type="text" placeholder="Post Office Number" class="infoInput">`

    textContainer.innerHTML += `<p>Total Price: $${sum}</p>
                                <div id="buyBtnContainer">
                                    <button onclick="buyAll()" id="buyAllBtn">Buy All</button>
                                </div>`
}

function redrawCartProducts() {
    alertText.textContent == "" ? textContainer.innerHTML = "" : null

    exit.style.marginTop = '-23%'
    cartImg.remove()
    alertText.textContent = ''
    cartStatus.style.display = "none"

    let sum = 0
    products.innerHTML = ""

    for(let i = 0; i < cart.length; i++) {
        products.innerHTML += `<div class="cartProduct">
                                    <img src="${cart[i].photo_url}" class="cartProductImg">
                                    <h4 class="productName">${cart[i].name > 12 ? cart[i].name.length = `${cart[i].name.slice(0, 12)}...` : cart[i].name}</h4>
                                    <h3 class="productPrice">$${cart[i].price}</h3>
                                </div>`
        sum += cart[i].price
    }
    
    textContainer.innerHTML += `<input placeholder="Full Name" class="infoInput">
                                <input placeholder="Adress" class="infoInput"><br>
                                <input placeholder="Phone Number" class="infoInput">
                                <input placeholder="Post Office Number" class="infoInput">`

    textContainer.innerHTML += `<p>Total Price: $${sum}</p>
                                <div id="buyBtnContainer">
                                    <button onclick="buyAll()" id="buyAllBtn">Buy All</button>
                                </div>`
}

function buyAll() {
    cart = []
    paidPurchase = true
    cartProd.appendChild(exit)
    exit.style.marginTop = '-41%'
    cartStatus.style.display = "flex"
    products.innerHTML = ""
    textContainer.innerHTML = ""
    cartStatus.appendChild(cartImg)
    cartStatus.appendChild(alertText)
    cartImg.setAttribute('src', 'img/card.svg')
    alertText.textContent = 'Money was withdrawn from your credit card'
    localStorage.setItem("cart", '[]')

    let cardButtons = document.querySelectorAll('.cardBtn')
    
    cardButtons.forEach(btn => {
        btn.classList.remove('productInCart')
        btn.textContent = "Buy"
    })
}