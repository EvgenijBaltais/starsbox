import { 
    getFinalPrice,
    getFinalPriceDecorated,
    countProductsAmount,
    countFinalSumm,
    emptyCartInfo,
    returnCorrectWord,
    make_array,
    findParent,
    plusToCart,
    minusToCart,
    returnCartValues
}
from './functions.min.js'

document.addEventListener('DOMContentLoaded', () => {

    // Если нет заказа в корзине

    if (!localStorage.getItem('order')) {
        setTimeout(() => {
            emptyCartInfo()
        }, 500)
    }

    // Если есть заказ в корзине

    (() => {

        if (!localStorage.getItem('order')) return false

            let order = JSON.parse(localStorage.getItem('order')),
            summ = 0,
            final_summ = 0, // со скидкой
            products = []

            fetch('/php/cart_data.php', {
                method: 'POST',
                headers: {  
                    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
                },
                body: JSON.stringify({order: order})
            }).then( (response) => {
             return response.text()
         }).then((data) => {

            products = JSON.parse(data)
            products = products.data

            for (let key in order) {

                products.forEach(item => {
                    if (+order[key].id == +item.id) {
                        item.amount = +order[key].amount
                    }
                })
            }

                // Считаем общие суммы

            products.forEach(item => {
                summ += item.price
                final_summ += getFinalPrice (item.price, item.sale) * item.amount
            })

            setTimeout(() => {

                document.querySelector('.cart-preloader').remove()

                document.querySelector('.cart-section').insertAdjacentHTML('beforeend', `
                    <div class="cart-wrapper-w"><div class="cart-wrapper"></div><div class="cart-final"></div></div>
                    `)

                products.forEach(item => {

                    document.querySelector('.cart-wrapper').insertAdjacentHTML('beforeend', `

                        <div class = "cart-item" data-id = "${item.id}">
                        <div class = "cart-remove" data-id = ${item.id} title = "Удалить товар из корзины"></div>
                        <div class="product-cart-pic">
                        <a href = "/catalog/${item.url_name}" target = "_blank" class = "product-cart-pic-link">
                        <img src="/images/catalog/brands/${item.id}/1_s.png" alt="" class = "product-cart-pic-img">
                        </a>
                        </div>
                        <div class = "product-cart-content">
                        <div class="product-cart-title">
                        <a href = "/catalog/${item.url_name}" target = "_blank" class = "product-cart-title-link thin-font-style">
                        <span class = "product-cart-title-span">${item.category}</span> <span class = "product-cart-title-span bold-text-600">${item.brand} ${item.name}, <span class = "product-cart-item-weight">${item.weight}</span></span>
                        </a>
                        </div>
                        <div class = "cart-in-stock">
                        <span>В наличии</span>
                        </div>
                        <div class="product-cart-bottom">
                        <div class="product-cart-bottom__left">
                        <div class = "item-plus-minus">
                        <div class = "cart-item-amount-minus">–</div>
                        <div class = "cart-item-amount-val-block">
                        <label for = "num-${item.id}">
                        <input type="text" name = "cart-item-amount-value" class = "cart-item-amount-value" readonly = "readonly" value = "${item.amount}" id = "num-${item.id}" aria-label="Количество товаров для заказа">
                        </label>
                        </div>
                        <div class = "cart-item-amount-plus">+</div>
                        </div>
                        </div>
                        <div class="product-cart-bottom__right">
                        <div class = "product-cart-bottom-div">
                        ${item.sale > 0 ? `<span class = "product-cart-bottom-full" data-fullprice="${item.price}">${getFinalPriceDecorated (item.price, 0, item.amount)} ₽</span>` : ''}
                        <span class = "product-cart-bottom-span" data-price = ${getFinalPrice (item.price, item.sale)}>
                        ${getFinalPriceDecorated (item.price, item.sale, item.amount)}
                        </span>
                        <span class = "product-cart-bottom-span product-cart-bottom-r"> ₽</span>
                        </div>
                        </div>
                        </div>
                        </div>
                        </div>
                        `)
                })

                document.querySelector('.cart-final').insertAdjacentHTML('beforeend', `
                    <div class = "common-title">
                    <span class = "common-title-thin">В корзине:</span>
                    <span class = "common-title-bold">${countProductsAmount (products)} ${returnCorrectWord(countProductsAmount (products))}</span>
                    </div>
                    <div class = "cart-all-in-stock">Все товары в наличии</div>
                    <div class = "cart-common">
                    <span class = "cart-common-thin">Итого:</span>
                    <span class = "cart-common-bold final-price" id = "final-price" data-price = "${countFinalSumm(products)}">${countFinalSumm(products).toLocaleString()} ₽</span>
                    <br><br><span class = ""><i>+ стоимость доставки</i></span>
                    </div>
                    <div class="send-order send-order-result">
                    Оформить заказ
                    </div>
                    `)
            }, 300)
})

document.body.addEventListener('click', () => {

    if (event.target.classList.contains('send-order-result')) {

        event.preventDefault()

        try {
            ym(95872157,'reachGoal','send_order_result')
        }catch(e){}

        if (document.querySelector('.cart-order-ww')) {

            setTimeout(() => {
                document.querySelector('.cart-order-ww').scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                })
            }, 10)

            return false
        }

        document.querySelector('.cart-section').insertAdjacentHTML('beforeend', `
            <div class = "cart-order-ww">
            <p class = "h2-title">Почти готово! Осталось только указать данные и оплатить:</p>
            <div class = "cart-order-register">
            <form name = "cart-order-register-form" class = "cart-order-register-form">
            <div class = "cart-order-input-w">
            <label>
            <p class = "cart-order-p">Ваше имя (по желанию):</p>
            <input type = "name" name = "name" class = "cart-order-input" placeholder="Имя">
            </label>
            </div>
            <div class = "cart-order-input-w">
            <label>
            <p class = "cart-order-p">Ваш email (по желанию):</p>
            <input type = "email" name = "email" class = "cart-order-input" placeholder="Email">
            </label>
            </div>
            <div class = "cart-order-input-w">
            <label>
            <p class = "cart-order-p">Ваш телефон (для уточнения заказа и доставки):</p>
            <input type = "phone" name = "phone" class = "cart-order-input required-field" placeholder="+7 (___) ___-__-__">
            </label>
            </div>
            <div class = "cart-order-input-w">
            <label>
            <p class = "cart-order-p">Любые комментарии по заказу:</p>
            <textarea name = "textarea" class = "cart-order-textarea required-field" placeholder="Введите текст"></textarea>
            <label>
            </div>

            <div class = "pay-radio pay-radio-1">
                <div class = "contact-method-form-2">
                    <p class = "cart-order-p">Как доставить?</p>
                    <div class = "pay-radio-div">
                        <label class="contact-label">
                            <input type="radio" name="radio-1" class = "cart-radio cart-radio-c" checked>
                            <span>Курьером</span>
                        </label>
                    </div>
                    <div class = "pay-radio-div">
                        <label class="contact-label">
                            <input type="radio" name="radio-1" class = "cart-radio cart-radio-p">
                            <span>В пункт выдачи заказов Яндекс Доставки</span>
                        </label>
                    </div>
                </div>
            </div>

            <div class = "pay-radio pay-radio-2">
                <div class = "contact-method-form-2">
                    <p class = "cart-order-p">Удобнее оплатить:</p>
                    <div class = "pay-radio-div">
                        <label class="contact-label">
                            <input type="radio" name="radio-2" class = "cart-radio cart-radio-1" checked>
                            <span>Наличными или переводом при получении</span>
                        </label>
                    </div>
                    <div class = "pay-radio-div">
                        <label class="contact-label">
                            <input type="radio" name="radio-2" class = "cart-radio cart-radio-2">
                            <span>Сейчас на сайте</span>
                        </label>
                    </div>
                </div>
            </div>
            <div class="agree-block agree-block-final">
            <label for="checkbox" class="checkbox-label">
            <input type="checkbox" id="checkbox" class="checkbox" checked>
            <span class="checkbox-view">
            <svg class="checkbox-icon" xmlns="http://www.w3.org/2000/svg" width="18" viewBox="0 0 511.985 511.985">
            <path fill="#000" d="M500.088 83.681c-15.841-15.862-41.564-15.852-57.426 0L184.205 342.148 69.332 227.276c-15.862-15.862-41.574-15.862-57.436 0-15.862 15.862-15.862 41.574 0 57.436l143.585 143.585c7.926 7.926 18.319 11.899 28.713 11.899 10.394 0 20.797-3.963 28.723-11.899l287.171-287.181c15.862-15.851 15.862-41.574 0-57.435z"/>
            </svg>
            </span>
            <span class = "agree-text">Согласен на обработку персональных данных</span>
            </label>
            </div>
            <button class = "cart-form-send btn-10px">Отправить заявку!</button>
            </form>
            </div>
            </div>
            `)

        setTimeout(() => {
            document.querySelector('.cart-order-ww').scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }, 10)

    // Кнопка оплаты - изменение текста

        document.querySelectorAll('.cart-radio').forEach(item => {
            item.addEventListener('change', () => { 
                event.target.classList.contains('cart-radio-1') ?
                document.querySelector('.cart-form-send').innerText = 'Отправить заявку и оплатить при получении' :
                document.querySelector('.cart-form-send').innerText = 'Оплатить онлайн'
            })
        })

    // Кнопка доставки - изменение условий оплаты

        document.querySelectorAll('input[name="radio-1"]').forEach(item => {
            item.addEventListener('change', () => {

                let parent = findParent(event.target, 'cart-order-register-form'),
                    sentBtn = parent.querySelector('.cart-form-send'),
                    payRadioBtn = parent.querySelector('.pay-radio-2')

                if (event.target.classList.contains('cart-radio-p')) {
                    sentBtn.innerText = 'Оплатить онлайн'
                    payRadioBtn.querySelector('.pay-radio-div').insertAdjacentHTML('beforeend', `<div class = "pay-radio-blocked"></div>`)
                    payRadioBtn.querySelector('.cart-radio-2').checked = true
                    return false
                }

                sentBtn.innerText = 'Отправить заявку и оплатить при получении'
                payRadioBtn.querySelector('.pay-radio-blocked').remove()
                payRadioBtn.querySelector('.cart-radio-1').checked = true
            })
        })

                    // Маска телефона

        new Inputmask("+7 (999) 999-99-99").mask(document.querySelector('input[name="phone"]'))

                    // Отправка заявки

        let sending = 0

        document.querySelector('.cart-form-send').addEventListener('click', () => {

            event.preventDefault()

            if (sending) return false

                let btn = event.target,
                    form = event.target.parentElement,
                    phone = form.querySelector('input[name="phone"]'),
                    invalid_fields = 0

            if (!phone.inputmask.isComplete()) {
                phone.parentElement.parentElement.classList.add('input-w-false')
                phone.parentElement.querySelector('.cart-order-p').innerText = "Пожалуйста, введите номер телефона:"
                phone.parentElement.querySelector('.cart-order-p').style.color = "red"
                invalid_fields++
                event.target.innerText = "Некорректно введен телефон..."
            }

            if (!document.getElementById('checkbox').checked) {
                document.querySelector('.agree-text').style.color = 'red'
                invalid_fields++
            }

            if (invalid_fields) return false

                sending += 1

            btn.innerText = 'Отправка...'

                        // Сбор данных корзины 

            let items = {}

            document.querySelectorAll('.cart-item').forEach((item, index) => {

                items[index] = {}

                items[index].name = item.querySelector('.product-cart-title-link').innerText
                items[index].amount = item.querySelector('.cart-item-amount-value').value
                items[index].weight = item.querySelector('.product-cart-item-weight').innerText
                items[index].price = item.querySelector('.product-cart-bottom-span').getAttribute('data-price') * items[index].amount
            })

            fetch("/libs/send-cart.php", {
                method: "POST",
                body: JSON.stringify({
                    name: form.querySelector('input[name="name"]').value,
                    email: form.querySelector('input[name="email"]').value,
                    phone: phone.value,
                    textarea: form.querySelector('textarea').value,
                    payment: form.querySelector('input[name="radio-2"]:checked').parentElement.querySelector('span').innerText,
                    order: localStorage.order,
                    items: items,
                    final_price: document.getElementById('final-price').getAttribute('data-price')
                }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
            })
            .then(response => {
                if (!response.ok) throw Error(response.statusText)
                    //response.ok ? btn.innerText = 'Успешно!' : ''
                    response.ok ? btn.innerText = 'Ошибка отправки' : ''

                try {
                    ym(95872157,'reachGoal','send_cart')
                    ym(95872157,'reachGoal','cart_form_send')
                }catch(e){}
            })
            .catch(error => {
                console.log(error)
                btn.innerText = 'Ошибка отправки =('
            })
        })

        document.getElementById('checkbox').addEventListener('change', () => {
            document.querySelector('.agree-text').style.color = 'black'
        })

        document.querySelector('.cart-order-register-form').querySelectorAll('input[name="phone"]').forEach(item => {

            item.addEventListener('focus', () => {
                event.target.parentElement.parentElement.classList.remove('input-w-false')
                event.target.parentElement.querySelector('.cart-order-p').innerText = "Ваш телефон (для уточнения заказа и доставки):"
                event.target.parentElement.querySelector('.cart-order-p').removeAttribute('style')
                document.querySelector('.cart-form-send').innerText = "Отправить заявку!"
            })

            item.addEventListener('keydown', () => {
                event.target.parentElement.parentElement.classList.remove('input-w-false')
                event.target.parentElement.querySelector('.cart-order-p').innerText = "Ваш телефон (для уточнения заказа и доставки):"
                event.target.parentElement.querySelector('.cart-order-p').removeAttribute('style')
                document.querySelector('.cart-form-send').innerText = "Отправить заявку!"
            })
        })
    }

                // Если изменение количества позиций в корзине

    let row, span

    if (event.target.classList.contains('cart-amount-plus')) {

        row = event.target.parentElement.parentElement
        span = row.querySelector('.cart-amount-span')

        if (parseInt(span.innerText) >= 99) return false

            span.innerText = parseInt(span.innerText) + 1 + ' шт.'

                    // Обновление данных в localstorage

        for (let i = 0; i < products.length; i++) {
         +products[i].id == +row.getAttribute('data-id') ? products[i].amount = parseInt(span.innerText) : ''
     }

     products.length ? localStorage.setItem('order', JSON.stringify(make_array (products))) : localStorage.removeItem('order')
     products.length ? returnCartValues () : ''

                    // Обновление финальной суммы

     row.querySelector('.cart-summ').innerText = (parseInt(span.innerText) * parseInt(row.querySelector('.cart-price-fullprice').getAttribute('data-fullprice'))).toLocaleString() + ' р.'
     document.getElementById('final-price').innerText = (countFinalSumm(products)).toLocaleString() + ' р.'
     document.getElementById('final-price').setAttribute('data-price', countFinalSumm(products))
 }

 if (event.target.classList.contains('cart-amount-minus')) {

    row = event.target.parentElement.parentElement
    span = row.querySelector('.cart-amount-span')

    if (parseInt(span.innerText) <= 1) return false

        span.innerText = parseInt(span.innerText) - 1 + ' шт.'

                    // Обновление данных в localstorage

    for (let i = 0; i < products.length; i++) {
        +products[i].id == +row.getAttribute('data-id') ? products[i].amount = parseInt(span.innerText) : ''
    }

    products.length ? localStorage.setItem('order', JSON.stringify(make_array (products))) : localStorage.removeItem('order')
    products.length ? returnCartValues () : ''

                    // Обновление финальной суммы

    row.querySelector('.cart-summ').innerText = (parseInt(span.innerText) * parseInt(row.querySelector('.cart-price-fullprice').getAttribute('data-fullprice'))).toLocaleString() + ' р.'
    document.getElementById('final-price').innerText = (countFinalSumm(products)).toLocaleString() + ' р.'
    document.getElementById('final-price').setAttribute('data-price', countFinalSumm(products))
}

// Плюс-минус в корзине товаров

(() => {

    if (!document.querySelector('.cart-section')) return false

        if (event.target.classList.contains('cart-item-amount-minus')) {

            let parent = findParent(event.target, 'cart-item'),
            valueInput = parent.querySelector('.cart-item-amount-value')

            if (valueInput.value <= 1) return false
                valueInput.value = +valueInput.value - 1

            minusToCart (parent.getAttribute('data-id'))
            returnCartValues ()

            parent.querySelector('.product-cart-bottom-span').innerText = (parent.querySelector('.product-cart-bottom-span').getAttribute('data-price') * valueInput.value).toLocaleString()
            
            parent.querySelector('.product-cart-bottom-full') ? 
                parent.querySelector('.product-cart-bottom-full').innerText = (parent.querySelector('.product-cart-bottom-full').getAttribute('data-fullprice') * valueInput.value).toLocaleString() + ' ₽'
                : ''
        }

        if (event.target.classList.contains('cart-item-amount-plus')) {

            let parent = findParent(event.target, 'cart-item'),
            valueInput = parent.querySelector('.cart-item-amount-value')

            if (valueInput.value >= 99) return false
                valueInput.value = +valueInput.value + 1

            plusToCart (parent.getAttribute('data-id'))
            returnCartValues ()

            parent.querySelector('.product-cart-bottom-span').innerText = (parent.querySelector('.product-cart-bottom-span').getAttribute('data-price') * valueInput.value).toLocaleString()

            parent.querySelector('.product-cart-bottom-full') ? 
                parent.querySelector('.product-cart-bottom-full').innerText = (parent.querySelector('.product-cart-bottom-full').getAttribute('data-fullprice') * valueInput.value).toLocaleString() + ' ₽'
                : ''
        }
    })();

        // Удаление столбца

        if (event.target.classList.contains('cart-remove')) {

            let order = JSON.parse(localStorage.getItem('order'))

            for (let i = 0; i < order.length; i++) {
                order[i].id == event.target.getAttribute('data-id') ? order.splice(i, 1) : ''
            }

            order.length ? localStorage.setItem('order', JSON.stringify(make_array (order))) : localStorage.removeItem('order')
            order.length ? returnCartValues () : ''

            event.target.parentElement.remove()

            if (document.querySelectorAll('.cart-item').length) return false

                emptyCartInfo ()
                returnCartValues ()

            document.querySelector('.cart-order-ww') ? document.querySelector('.cart-order-ww').remove() : ''
        }
    })
})();

})
