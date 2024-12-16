import { 
    getFinalPrice,
    getFinalPriceDecorated,
    countProductsAmount,
    returnCorrectWord,
    countFinalSumm,
    emptyCartInfo,
    make_array,
    returnCartValues,
    findParent,
    plusToCart,
    minusToCart,
    body_lock,
    body_unlock
} from './functions.min.js'

document.addEventListener('DOMContentLoaded', () => {

    // Костыль при загрузе для телефонов - выставление размера первого слайда на главной странице для мобильных телефонов

    if (document.querySelector('.main-page-header') && window.screen.width < 650) {
        let vh = window.innerHeight * 0.01;
        document.querySelector('.main-page-screen').style.setProperty('--vh', `${vh}px`);

        window.addEventListener('resize', () => {
            document.querySelector('.main-page-screen').style.setProperty('--vh', `${vh}px`);
        })
    }

    // Костыль: если главная и страница загружается посередине
    if (document.querySelector('.main-page-header')) {
        setTimeout(() => {
            window.pageYOffset > 5 ? document.querySelector('.nav').classList.add('nav-static') : ''
        }, 50)
    }

    // Показать сайт уже загруженным, без рывков

    document.body.style.opacity = 1

    // Меню

    document.querySelector('.menu-area-w').addEventListener('click', () => {

        let target = event.target.parentElement

        if (target.parentElement.querySelector('.menu-icon').classList.contains('open')) {

            setTimeout(() => {
                document.querySelector('.nav-list').style.opacity = 0
                target.parentElement.querySelector('.menu-icon').classList.remove('open')
            }, 0)

            setTimeout(() => {
                document.querySelector('.nav-list').removeAttribute('style')
            }, 150)
        }

        else {

            setTimeout(() => {
                document.querySelector('.nav-list').style.display = 'block'
                target.parentElement.querySelector('.menu-icon').classList.add('open')
            }, 0)
            
            setTimeout(() => {
                document.querySelector('.nav-list').style.opacity = 1
            }, 10)
        }
    });

    // Формы

    (function() {

        if (!document.querySelector('.order-form')) return false

            // Маска телефона

            let im = new Inputmask("+7 (999) 999-99-99")
                im.mask(document.querySelector('.form-order-input-phone'))

            // Отправка формы

        document.querySelector('.form-order-btn').addEventListener('click', () => {

            let valid = 0,
            form = findParent (event.target, 'order-form'),
            name = form.querySelector('input[name="name"]').value,
            email = form.querySelector('input[name="email"]').value,
            phone = form.querySelector('input[name="phone"]').value,
            textarea = form.querySelector('textarea'),
            str = 'name=' + name + '&email=' + email + '&phone=' + phone,
            target = event.target

            if (target.classList.contains('blocked')) return false

                if (textarea.value == '' || textarea.value.length < 3) {

                    textarea.style.border =  '2px solid red'

                    setTimeout(() => {
                        textarea.removeAttribute('style')
                    }, 1000)
                    valid += 1
                }

                if (!form.querySelector('input[name="phone"]').inputmask.isComplete()) {
                    form.querySelector('input[name="phone"]').style.border =  '2px solid red'
                    setTimeout(() => {
                        form.querySelector('input[name="phone"]').removeAttribute('style')
                    }, 1000)
                    valid += 1
                }

                if (valid) return false
                    target.classList.add('blocked')
                
                target.innerText = "Отправка..."

                form.querySelectorAll('input[name="radio"]').forEach(item => {
                    item.checked ? str += '&type_of_connect=' + item.parentElement.querySelector('span').innerText : ''
                })

                form.querySelectorAll('input[name="radio-2"]').forEach(item => {
                    item.checked ? str += '&type_of_call=' + item.parentElement.querySelector('span').innerText : ''
                })

                str += '&comment=' + textarea.value

                sendForm (str, '/libs/send-contacts-form.php', target)
                .then(result => {
                    try {
                        ym(95872157,'reachGoal','contacts_send')
                    }catch(e){}
                })
            })

            // Сброс полей

        document.querySelector('.form-order-input-phone').addEventListener('click', () => {
            event.target.style = 'border-color: rgb(179,147,121)'
        })

        document.querySelector('.form-order-input-phone').addEventListener('input', () => {
            event.target.style = 'border-color: rgb(179,147,121)'
        })
    })();

    // Всплывающие формы, конец

    // Скроллинг при нажатии на элементы

    if (document.querySelectorAll('.scroll-to').length) {
        document.querySelectorAll('.scroll-to').forEach(item => {
            item.addEventListener('click', () => {
                event.preventDefault()
                window.scrollTo({
                    top: document.getElementById(item.getAttribute('data-scroll-to')).offsetTop,
                    behavior: 'smooth'
                })
            })
        })
    }


    // Скроллинг и фиксация меню
    if (window.screen.width > 649 || document.querySelector('.main-page-header')) {
        let time = 0

        document.addEventListener('scroll', () => {
            window.pageYOffset > 5 && time ? document.querySelector('.nav').classList.add('nav-static') : document.querySelector('.nav').classList.remove('nav-static')
            time = 1
        })
    }

    document.body.addEventListener('click', () => {

        // Цели
        try {
            event.target.classList.contains('top-contact-link-telegramm') ? ym(95872157,'reachGoal','top_telegram') : ''
            event.target.classList.contains('top-contact-link-whatsapp') ? ym(95872157,'reachGoal','top_wa') : ''
            event.target.classList.contains('top-contact-link-chat') ? ym(95872157,'reachGoal','top_chat') : ''
            event.target.classList.contains('footer-contact-link-telegramm') ? ym(95872157,'reachGoal','bottom_telegram') : ''
            event.target.classList.contains('footer-contact-link-whatsapp') ? ym(95872157,'reachGoal','bottom_wa') : ''
            event.target.classList.contains('footer-contact-link-chat') ? ym(95872157,'reachGoal','bottom_chat') : ''
        }catch(e){}

    // Плюс-минус в карточке товара

        (() => {

            if (!document.querySelector('.item-amount-plus') || !document.querySelector('.item-amount-minus')) return false

                if (event.target.classList.contains('item-amount-minus')) {

                    let parent = findParent(event.target, 'product-card'),
                    valueInput = parent.querySelector('.item-amount-value')

                    if (valueInput.value <= 1) return false
                        valueInput.value = +valueInput.value - 1

                    if (parent.classList.contains('item-in-cart')) {
                        minusToCart (parent.getAttribute('data-id'))
                        returnCartValues ()

                        cartAddNotification (`
                            -1 шт удален из заказа
                            `)
                    }
                }

                if (event.target.classList.contains('item-amount-plus')) {

                    let parent = findParent(event.target, 'product-card'),
                    valueInput = parent.querySelector('.item-amount-value')

                    if (valueInput.value >= 99) return false
                        valueInput.value = +valueInput.value + 1

                    if (parent.classList.contains('item-in-cart')) {
                        plusToCart (parent.getAttribute('data-id'))
                        returnCartValues ()

                        cartAddNotification (`
                            +1 шт добавлен к заказу
                            `)
                    }
                }
            })();

        // Плюс-минус на странице товара

            (() => {

                if (!document.querySelector('.amount-select-minus') || !document.querySelector('.amount-select-plus')) return false

                    if (event.target.classList.contains('amount-select-minus')) {

                        let parent = findParent(event.target, 'product-description'),
                        valueInput = parent.querySelector('.amount-select-value')

                        if (valueInput.value <= 1) return false
                            valueInput.value = +valueInput.value - 1

                        if (parent.querySelector('.product-item-add-cart').classList.contains('added-to-cart-w')) {

                            minusToCart (parent.querySelector('.order-button-cart').getAttribute('data-id'))
                            returnCartValues ()

                            cartAddNotification (`
                                -1 шт удален из заказа
                                `)
                        }
                    }

                    if (event.target.classList.contains('amount-select-plus')) {

                        let parent = findParent(event.target, 'product-description'),
                        valueInput = parent.querySelector('.amount-select-value')

                        if (valueInput.value >= 99) return false
                            valueInput.value = +valueInput.value + 1

                        if (parent.querySelector('.product-item-add-cart').classList.contains('added-to-cart-w')) {

                            plusToCart (parent.querySelector('.order-button-cart').getAttribute('data-id'))
                            returnCartValues ()

                            cartAddNotification (`
                                +1 шт добавлен к заказу
                                `)
                        }
                    }
                })();
        })

    // конец

    // На странице товара:
;(function(){
    if (!document.querySelector('.order-button-cart')) return false

        let btn = document.querySelector('.order-button-cart')

    if (productInCart (btn.getAttribute('data-id'))) {
        btn.innerText = ''
        btn.classList.add('added-to-cart')
        document.querySelector('.product-item-add-cart').classList.add('added-to-cart-w')
        btn.insertAdjacentHTML('beforeend', '<a href = "/cart" class = "order-button-cart-link">Товар в корзине. Перейти →</a>')
        document.querySelector('.amount-select-value').setAttribute("value", productInCart (btn.getAttribute('data-id')).amount)
    }

    if (!productInCart (btn.getAttribute('data-id'))) {

        document.querySelector('.order-button-cart').addEventListener('click', () => {

            if (event.target.classList.contains('added-to-cart')) return false

                btn.innerText = ''
            btn.classList.add('added-to-cart')
            document.querySelector('.product-item-add-cart').classList.add('added-to-cart-w')
            btn.insertAdjacentHTML('beforeend', '<a href = "/cart" class = "order-button-cart-link">Товар в корзине. Перейти →</a>')
            addToCart (event.target.getAttribute('data-id'), document.querySelector('.amount-select-value').value, event.target.getAttribute('data-price'))
            returnCartValues ()
            cartAddNotification('Товар добавлен в корзину!')
        })
    }
})();

;(function(){

// Фильтры на странице Каталог

    let products = document.querySelectorAll('.product-card'),
    allFilters = document.querySelectorAll('.filter-item:not(.all-filter-item)'),
    filtersBrands = document.querySelectorAll('.filters-brand-item'),
    filtersWeights = document.querySelectorAll('.filters-weight-item')

    if (products.length == 0 || allFilters.length == 0) return false

    // Нажатие на фильтры Брендов
        filtersBrands.forEach(item => {
            item.addEventListener('click', () => {

            // Нажимаем или отжимаем фильтр
                event.target.classList.contains('active') ? event.target.classList.remove('active') : event.target.classList.add('active')

            // Определяем нажатые фильтры по брендам
                let brandValues = [],
                weightValues = []

                filtersBrands.forEach(item => {
                    item.classList.contains('active') ? brandValues.push(item.getAttribute('data-brand')) : ''
                })

                filtersWeights.forEach(item => {
                    item.classList.contains('active') ? weightValues.push(item.getAttribute('data-weight')) : ''
                })

                brandValues.length ?
                event.target.parentElement.querySelector('.filter-item').classList.remove('active') :
                event.target.parentElement.querySelector('.filter-item').classList.add('active')

            // Фильтруем товары
                show_filtered_products (products, brandValues, weightValues)

                document.querySelectorAll('.assortment-item:not(.hidden)').length ?
                document.querySelector('.no-products-warning').innerText = '' :
                document.querySelector('.no-products-warning').innerText = 'Ничего не нашлось...'
            })
        })

    // Нажатие на фильтры вариантов веса
    filtersWeights.forEach(item => {
        item.addEventListener('click', () => {

                // Нажимаем или отжимаем фильтр
            event.target.classList.contains('active') ? event.target.classList.remove('active') : event.target.classList.add('active')

                // Определяем нажатые фильтры по Весу/Объему
            let brandValues = [],
            weightValues = []

            filtersBrands.forEach(item => {
                item.classList.contains('active') ? brandValues.push(item.getAttribute('data-brand')) : ''
            })

            filtersWeights.forEach(item => {
                item.classList.contains('active') ? weightValues.push(item.getAttribute('data-weight')) : ''
            })

                // Кнопка Все
            weightValues.length ?
            event.target.parentElement.querySelector('.filter-item').classList.remove('active') :
            event.target.parentElement.querySelector('.filter-item').classList.add('active')

                // Фильтруем товары
            show_filtered_products (products, brandValues, weightValues)

            document.querySelectorAll('.assortment-item:not(.hidden)').length ?
            document.querySelector('.no-products-warning').innerText = '' :
            document.querySelector('.no-products-warning').innerText = 'Ничего не нашлось...'
        })
    })

    // Кнопка Все

    document.querySelectorAll('.all-filter-item').forEach((item, index) => {

        item.addEventListener('click', () => {

                // Определяем нажатые фильтры по Весу/Объему
            let brandValues = [],
            weightValues = []

            if (index == 1) {
                filtersBrands.forEach(item => {
                    item.classList.contains('active') ? brandValues.push(item.getAttribute('data-brand')) : ''
                })
            }

            if (index == 0) {
                filtersWeights.forEach(item => {
                    item.classList.contains('active') ? weightValues.push(item.getAttribute('data-weight')) : ''
                })
            }

            event.target.parentElement.querySelectorAll('.filter-item').forEach((item, index) => {
                index == 0 ? item.classList.add('active') : item.classList.remove('active')
            })

                // Фильтруем товары
            show_filtered_products (products, brandValues, weightValues)
        })
    })


    // Сбросить все фильтры

    document.querySelector('.clear-filters').addEventListener('click', () => {

        filters.forEach(item => {
            item.classList.remove('active')
        })
        products.forEach(item => {
            item.classList.remove('hidden')
        })

        let url = new URL(location)
        url.searchParams.delete("weight")
        url.searchParams.delete("brand")
        history.pushState({}, "", url)
    })

    function show_filtered_products (products, brandFilters = [], weightFilters = []) {

        products.forEach(item => {

            // Если ничего не выбрано
            if (!brandFilters.length && !weightFilters.length) {
                item.classList.remove('hidden')
                return
            }

            item.classList.add('hidden')

            if (brandFilters.length) {

                brandFilters.includes(item.getAttribute('data-brand')) ? item.classList.remove('hidden') : ''

                if (!weightFilters.length) {
                    return
                }

                brandFilters.includes(item.getAttribute('data-brand')) && weightFilters.includes(item.getAttribute('data-weight')) ? item.classList.remove('hidden') : item.classList.add('hidden')
                return
            }

            !brandFilters.length && weightFilters.includes(item.getAttribute('data-weight')) ? item.classList.remove('hidden') : ''
        })
    }

})();


// Фильтры, конец


// Все по корзине товаров и добавлению в нее

;(() => {

    returnCartValues ()

    // Проверить товары, которые уже в корзине и пометить на странице
    
    document.querySelectorAll('.product-card').forEach(item => {

        let order = JSON.parse(localStorage.getItem('order'))
        if (order && order != null) {
            for (let i = 0; i < order.length; i++) {
                if (order[i].id == item.getAttribute('data-id')) {
                    item.classList.add('item-in-cart')
                    item.querySelector('.item-order-btn').innerText = ''
                    item.querySelector('.item-amount-value').value = order[i].amount
                    item.querySelector('.item-order-btn').insertAdjacentHTML('beforeend', `<a href = "/cart">В корзине →</a>`)
                }
            }
        }
    })
    
    if (document.querySelectorAll('.item-order-btn')) {
        document.querySelectorAll('.item-order-btn').forEach(item => {
            item.addEventListener('click', () => {

                let product = findParent (event.target, 'product-card')

                if (!product.getAttribute('data-id')) return false

                    if (!product.classList.contains('item-in-cart')) {

                        product.classList.add('item-in-cart')
                        addToCart (product.getAttribute('data-id'), product.querySelector('.item-amount-value').value, product.getAttribute('data-price'))
                        cartAddNotification('Товар добавлен в корзину!')

                    // Поменять данные в шапке

                        returnCartValues ()

                        event.target.innerText = ''
                        event.target.insertAdjacentHTML('beforeend', `<a href = "/cart">В корзине →</a>`)

                        try {
                            ym(95872157,'reachGoal','order_button_cart')
                        }catch(e){}

                        return false
                    }
                })
        })
    }
})();

// Все по корзине товаров и добавлению в нее, конец

     // Добавление, маски, чата и каруселей
    (() => {

        setTimeout(() => {

            //addJsToDom("/node_modules/@glidejs/glide/dist/glide.min.js")
            //addCssToDom("/chat/chat.css")

            //if (!isMyScriptLoaded('https://bluebeans.ru/plugins/Inputmask-5.x/dist/inputmask.min.js')) {
            //    addJsToDom("../plugins/Inputmask-5.x/dist/inputmask.min.js")
            //}
            //addJsToDom("/chat/chat.js")
            //addJsToDom("../js/carousels.min.js")
        })

        function addCssToDom(url) {
            const style = document.createElement('link')
                style.rel   = 'stylesheet'
                style.type  = 'text/css'
                style.href  = url
                document.head.appendChild(style)
        }
        function addJsToDom(url) {

            const script = document.createElement('script')
                script.src = url
                script.type = 'module'
                document.body.append(script)
        }
        function isMyScriptLoaded(url) {
            let scripts = document.getElementsByTagName('script');
            for (let i = scripts.length; i--;) {
                if (scripts[i].src == url) return true;
            }
            return false;
        }
    })();
    // Добавление чата, конец

})

    // Подписка на рассылку 

if (document.querySelector('.subscribe-email-button')) {

    document.querySelector('.subscribe-email-button').addEventListener('click', () => {

        let target = event.target,
        str = ''

        if (target.parentElement.querySelector('.subscribe-email').value.indexOf('@') == -1) {

            target.parentElement.querySelector('.subscribe-email').classList.add('subscribe-email-wrong')
            setTimeout(() => {
                target.parentElement.querySelector('.subscribe-email').classList.remove('subscribe-email-wrong')
            }, 1000)
            return false
        }

        str += 'email=' + target.parentElement.querySelector('.subscribe-email').value

        sendForm (str, '/libs/subscribe_emails.php', target)
        .then(result => {
            try {
                ym(95872157,'reachGoal','email_subscribe')
            }catch(e){}
        })
    })
}

    // Подписка на рассылку, конец


    // Форма Есть пожелания? на главной

if (document.querySelector('.reviews-form-send')) {

    document.querySelector('.reviews-form-send').addEventListener('click', () => {

        event.preventDefault()

        let form = event.target.parentElement,
        name = form.querySelector('input[name="name"]').value,
        email = form.querySelector('input[name="email"]').value,
        textarea = form.querySelector('textarea'),
        str = 'name=' + name + '&email=' + email,
        target = event.target

        if (target.classList.contains('blocked')) return false

            if (textarea.value == '' || textarea.value.length < 3) {

                textarea.style.outline =  '1px solid red'

                setTimeout(() => {
                 textarea.removeAttribute('style')
             }, 1000)

                return false
            }

            if (!form.querySelector('.checkbox').checked) {
                form.querySelector('.agree-text').style.color = 'red'
                return false
            }

            target.classList.add('blocked')

            target.innerText = 'Отправка..'

            str += '&comment=' + textarea.value

            sendCommentData (str, '/libs/send-comment.php', target)
            .then(result => {
                try {
                    ym(95872157,'reachGoal','any_wishes')
                }catch(e){}
            })
        })

    document.getElementById('checkbox').addEventListener('change', () => {
        document.querySelector('.agree-text').style.color = 'black'
    })
}


/** Обработка форм, конец  */

function getClickedElementIndex(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (event.target == arr[i]) return i;
    }
}


async function sendCommentData (str, url, target) {

    let response = await fetch(url, {
        method: 'POST',
        headers: {  
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
        },
        body: str
    })

    if (response.ok) {
        target.innerText = 'Успешно!'

        setTimeout(() => {
            target.innerText = 'Отправить!'
            target.classList.remove('blocked')
        }, 8000)

        ym(95872157,'reachGoal','send_review')
        return 'Успешно'
    }

    if (!response.ok) {

        target.innerText = 'Ошибка!'

        setTimeout(() => {
            target.innerText = 'Отправить!'
            target.classList.remove('blocked')
        }, 8000)
        return 'Ошибка'
    }
}

async function sendForm (str, url, target) {

    let response = await fetch(url, {
        method: 'POST',
        headers: {  
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
        },
        body: str
    })

    let result = await response

    if (result.ok) {
        target.innerText = 'Успешно!'

        setTimeout(() => {
            target.innerText = 'Отправить!'
            target.classList.remove('blocked')
        }, 8000)
        return 'Успешно'
    }

    if (!result.ok) {

        target.innerText = 'Ошибка!'

        setTimeout(() => {
            target.innerText = 'Отправить!'
            target.classList.remove('blocked')
        }, 8000)
        return 'Ошибка'
    }
}

// Добавить товар в корзину

function addToCart (id, amount, price) {

    let order = JSON.parse(localStorage.getItem('order'))

    if (order && order != null) {

        let id_isset = 0

        for (let i = 0; i < order.length; i++) {
            if (order[i].id == id) {
                order[i].amount += parseInt(amount)
                order[i].price = parseInt(price)
                id_isset = 1
                break
            }
        }

        !id_isset ? order.push({'id': id, 'amount': parseInt(amount), 'price': parseInt(price) }) : ''

        localStorage.setItem('order', JSON.stringify(order))
        return false
    }

    order = []
    order.push({'id': id, 'amount': parseInt(amount), 'price': parseInt(price)})
    localStorage.setItem('order', JSON.stringify(order))

    return false
}

function productInCart (id) {

    let order = JSON.parse(localStorage.getItem('order')),
    order_item = false

    if (order && order != null) {

        for (let i = 0; i < order.length; i++) {
            if (order[i].id == id) {
                order_item = order[i]
                break
            }
        }
    }

    return order_item
}

function cartAddNotification (text) {

    document.querySelector('.cart-warnings').insertAdjacentHTML('afterbegin', `
        <div class="cart-add-warning">${text}</div>
        `)

    setTimeout(() => {
        document.querySelectorAll('.cart-add-warning')[document.querySelectorAll('.cart-add-warning').length - 1].remove()
    }, 1000)
}
