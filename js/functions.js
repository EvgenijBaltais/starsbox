// Функция, которая считает стоимость со скидкой или без с округлением в пользу клиента единым числом без деления на разряды

export function getFinalPrice (price, saleSize = 0) {
    return saleSize ? Math.floor(price - (price / 100 * saleSize)) : parseInt(price)
}

// Функция, которая считает стоимость со скидкой или без с округлением в пользу клиента с делением на разряды для вывода

export function getFinalPriceDecorated (price, saleSize = 0, amount = 1) {
    return saleSize ? ((Math.floor(price - (price / 100 * saleSize))) * amount).toLocaleString() : (parseInt(price) * amount).toLocaleString()
}

export function countProductsAmount (products) {
    let amount = 0
    for (let i = 0; i < products.length; i++) {
        amount += products[i].amount
    } 
    return amount
}

        // Вернуть правильное склонение

export function returnCorrectWord (value) {
    value = value.toString()

    value == 0 ? value = ' товаров' : ''
    value < 20 && value.slice(-2) == 1 ? value = ' товар' : ''
    value < 20 && value.slice(-2) >= 2 && value.slice(-2) <= 4 ? value = ' товара' : ''
    value <= 20 && value.slice(-2) > 4 && value.slice(-2) <= 20 ? value = ' товаров' : ''
    value > 20 && value.slice(-1) == 1 ? value = ' товар' : ''
    value > 20 && value.slice(-1) >= 2 && value.slice(-1) <= 4 ? value = ' товара' : ''
    value > 20 && value.slice(-1) >= 5 && value.slice(-1) <= 9 ? value = ' товаров' : ''
    value > 20 && value.slice(-1) == 0 ? value = ' товаров' : ''

    return value
}

// Функция подсчитывает финальную сумму в корзине из данных localstorage

export function countFinalSumm (order_data) {

    let final_summ = 0 // со скидкой

    order_data.forEach(item => {
        final_summ += getFinalPrice (item.price, item.sale) * item.amount
    })

    return final_summ
}

export function emptyCartInfo () {

    document.querySelector('.cart-preloader') ? document.querySelector('.cart-preloader').remove() : ''
    document.querySelector('.cart-wrapper') ? document.querySelector('.cart-wrapper').remove() : ''
    document.querySelector('.cart-final') ? document.querySelector('.cart-final').remove() : ''

    document.querySelector('.cart-section').insertAdjacentHTML('afterbegin', `
        <div class = "empty-cart-info">
        <p class="simply-text">В корзине пока пусто...</p>
        <a class="simply-link right-margin-20" href = "/">На главную</a>
        <a class="simply-link" href = "/catalog">В каталог</a>
        </div>
    `)
}

export function make_array (products) {
    let arr = [],
    obj = {}

    products.forEach(item => {
        obj = {}
        obj.id = item['id']
        obj.amount = item['amount']
        obj.price = getFinalPrice (item['price'], item['sale'])
        arr.push(obj)
    })

    return arr
}

// Вывести данные по товарам в корзине в шапке

export function returnCartValues () {
    let data = JSON.parse(localStorage.getItem('order')) || []

    let summ = 0,
    amount = 0

    for (let i = 0; i < data.length; i++) {
        summ += data[i].amount * data[i].price
        amount += data[i].amount
    }

    amount > 0 ? document.querySelector('.cart-block').classList.add('active') : document.querySelector('.cart-block').classList.remove('active')

    document.querySelector('.cart-num').innerText = amount
    document.querySelector('.cart-price-text').innerText = returnCorrectWord (amount)
    document.querySelector('.cart-price-value').innerText = summ.toLocaleString()

     // На странице корзины
    document.querySelector('.common-title-bold') ? document.querySelector('.common-title-bold').innerText = amount + ' ' + returnCorrectWord (amount) : ''
    document.getElementById('final-price') ? document.getElementById('final-price').innerText = summ.toLocaleString() + ' ₽' : ''
    document.getElementById('final-price') ? document.getElementById('final-price').setAttribute('data-price', summ) : ''

    document.querySelector('.cart-block').classList.add('visible')
}

// Прибавить товар в корзине

export function plusToCart (id, amount = 1) {

    let order = JSON.parse(localStorage.getItem('order'))

    if (!order || order == null) return false

        for (let i = 0; i < order.length; i++) {
            if (order[i].id == id) {
                order[i].amount = parseInt(order[i].amount) + amount
                break
            }
        }

        localStorage.setItem('order', JSON.stringify(order))
        return true
}

export function minusToCart (id, amount = 1) {

    let order = JSON.parse(localStorage.getItem('order'))

    if (!order || order == null) return false

        for (let i = 0; i < order.length; i++) {
            if (order[i].id == id) {
                order[i].amount -= amount
                break
            }
        }

        localStorage.setItem('order', JSON.stringify(order))
        return true
}

export function findParent (el, cls) {
    while ((el = el.parentElement) && !el.classList.contains(cls));
    return el;
}

export function body_lock() {

    let body = document.body;
    if (!body.classList.contains('scroll-locked')) {
        let bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
        document.querySelector('.nav').classList.contains('nav-static') ? document.querySelector('.nav').classList.add('nav-static-temporary') : ''
        body.classList.add('scroll-locked');
        body.style.top = "-" + bodyScrollTop + "px";
        body.setAttribute("data-popup-scrolltop", bodyScrollTop)
    }
}

export function body_unlock() {
    let body = document.body;
    if (body.classList.contains('scroll-locked')) {
        let bodyScrollTop = document.body.getAttribute("data-popup-scrolltop");
        document.querySelector('.nav').classList.contains('nav-static-temporary') ? document.querySelector('.nav').classList.remove('nav-static-temporary') : ''
        body.classList.remove('scroll-locked');
        body.style.top = "";
        body.removeAttribute("data-popup-scrolltop")
        window.scrollTo(0, bodyScrollTop)
    }
}