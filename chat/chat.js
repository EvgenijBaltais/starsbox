document.addEventListener('DOMContentLoaded', () => {

	fetch('/php/chat_products_from_db.php', {
		method: 'POST',
		headers: {  
		    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
		},
		body: 'get_data=1'
	}).then( (response) => {

		if (!response.ok) {
			return 'Ошибка'
		}

		if (response.ok) {
			return response.text()
		}
	}).then((data) => {

		if (data == 'Ошибка') return false
		if (!JSON.parse(data).length) return false

		;(function(){
			show_chat (JSON.parse(data))
		})();
	})


function show_chat (products) {

	let brands = []

	products.forEach(item => {
		brands.includes(item.brand) ? '' : brands.push(item.brand)
	})

	// Создание чата

	document.body.insertAdjacentHTML('beforeend', `
		<div class = "chat-closed"></div>
		<div class = "dialog">
			<p class = "ask-manager">Консультант</p>
			<div class="chat-close"></div>
			<div class = "dialog-wrapper"></div>
		</div>`)

	const dialog = document.querySelector('.dialog'),
		dialogContentArea = document.querySelector('.dialog-wrapper'),
		dialogIcon = document.querySelector('.chat-closed')

	document.querySelector('.chat-closed').addEventListener('click', () => {
		openChat (dialog, dialogIcon)
		defaultTalkStep_1 ()
	})

	document.querySelector('.chat-close').addEventListener('click', () => {
		closeChat (dialog, dialogIcon)
	})

	if (window.screen.width > 480) {
		setTimeout(() => {
			openChat (dialog, dialogIcon)
			defaultTalkStep_1 ()
		}, 5000)
	}


	// Вызов чата с кнопки в хедере и футере
	
	document.querySelectorAll('.top-contact-link-chat').forEach(item => {

		item.addEventListener('click', () => {

			dialogContentArea.innerHTML = ''
			openChat (dialog, dialogIcon)
			addFastOrderStep_7 ()

			scrollChat (document.querySelectorAll('.manager-phrase'))
		})
	})

	// Быстрый заказ в карточке

	document.querySelectorAll('.one-click-order').forEach(item => {

		item.addEventListener('click', () => {
			openChat (dialog, dialogIcon)

			let card = event.target.parentElement.parentElement

			addFastOrderStep_1 (
				card.getAttribute('data-id'),
				card.getAttribute('data-weight'),
				card.querySelector('img').getAttribute('src'),
				card.querySelector('.item-title-text').innerText,
				card.querySelector('.item-amount-value').value,
				card.getAttribute('data-price')
			)

			try {
        		ym(95872157,'reachGoal','one_click_order')
    		}catch(e){}
		})
	})

	// Всякие вспомогательные действия в чате

	document.body.addEventListener('click', () => {

		// Прибавление и убавление товаров
		let val = 1,
			num,
			price

		if (event.target.classList.contains('step-order-select')) {

			num = event.target.parentElement.querySelector('.step-order-num-a')
			price = event.target.parentElement.parentElement.querySelector('.order-price-val')

			if (event.target.classList.contains('step-order-minus')) {

				if (parseInt(num.innerText) <= 1) return false
				
				val = parseInt(num.innerText) - 1
				num.innerText = val + ' шт.'
				price.innerText = (parseInt(price.getAttribute('data-default-value')) * val).toLocaleString('ru')  + ' ₽'
			}

			if (event.target.classList.contains('step-order-plus')) {

				if (parseInt(num.innerText) >= 99) return false
				
				val = parseInt(num.innerText) + 1
				num.innerText = val + ' шт.'
				price.innerText = (parseInt(price.getAttribute('data-default-value')) * val).toLocaleString('ru')  + ' ₽'
			}
		}

		// Конец

		// Шаг подтвердите выбор
		

		// Если все верно, то далее
		if (event.target.classList.contains('fast-order-ok')) {

			addActiveClass (event.target)

			removeSteps (event.target)
			addFastOrderStep_2()
			scrollChat (document.querySelectorAll('.manager-phrase'))
		}

		// Если есть вопросы то показываем контакты
		if (event.target.classList.contains('fast-order-no')) {

			addActiveClass (event.target)

			removeSteps (event.target)
			addFastOrderStep_6 ()
			scrollChat (document.querySelectorAll('.manager-phrase'))	
		}

		// Шаг подтвердите выбор, конец..


		// Знаю что хочу
		if (event.target.classList.contains('start-talk-ok')) {

			addActiveClass (event.target)

			removeSteps (event.target)
			defaultTalkStep_2 ()
		}


		// Что у вас есть?
		if (event.target.classList.contains('start-talk-no')) {

			addActiveClass (event.target)

			removeSteps (event.target)
			dontKnowStep_1 ()
		}


		// Какие есть бренды?
		if (event.target.classList.contains('consult-order-ok')) {

			addActiveClass (event.target)

			removeSteps (event.target)
			defaultTalkStep_2 ()
		}

		// Какие есть вкусы?
		if (event.target.classList.contains('consult-order-no')) {

			addActiveClass (event.target)

			removeSteps (event.target)
			showTastes_1 ()
		}


		// Хочу получить консультацию в чате или по телефону

		if (event.target.classList.contains('consult-order-discuss')) {

			event.target.parentElement.querySelectorAll('.step-manager-btn').forEach(item => {
				item.classList.remove('active')
			})

			event.target.classList.add('active')

			removeSteps (event.target)
			addFastOrderStep_6 ()
		}


		// Сделан выбор бренда

		if (event.target.classList.contains('step-manager-btn-around')) {

			document.querySelectorAll('.step-manager-btn-around').forEach(item => {
				item.classList.remove('active')
			})

			event.target.classList.add('active')

			removeSteps (event.target)

			defaultTalkStep_3 (event.target)
		}

		// Сделан выбор вкуса
		// 
		if (event.target.classList.contains('step-manager-btn-taste')) {

			document.querySelectorAll('.step-manager-btn-taste').forEach(item => {
				item.classList.remove('active')
			})

			event.target.classList.add('active')

			showTastes_2 (event.target)
		}


		// Выбран бренд и вид кофе

		if (event.target.classList.contains('chat-assortiment-item-w')) {

			removeSteps (event.target)
			defaultTalkStep_4 (event.target)
		}


		// Шаг при выборе платежной системы

		if (event.target.classList.contains('fast-order-after') || event.target.classList.contains('fast-order-now')) {

			addActiveClass (event.target)

			// Выбор способа подтверждения и переход к следующему шагу

			let type_of_submit = ''
			document.querySelectorAll('.chat-contact-label input').forEach(item => {
				if (item.checked) {
					type_of_submit = item.parentElement.innerText
					return false
				}
			})

			addFastOrderStep_4 (type_of_submit)

			scrollChat (document.querySelectorAll('.manager-phrase'))
		}

		// Нажатие на кнопку готово после ввода адреса

		if (event.target.classList.contains('chat-ready-adress')) {

			// Проверка textarea на заполненность

			if (document.querySelector('.step-manager-textarea').value == '') {
				document.querySelector('.step-manager-textarea').style.border = '1px solid red'
				return false
			}

			// Проверка телефона на заполненность

			if (!document.querySelector('.step-manager-phone').inputmask.isComplete()) {
				document.querySelector('.step-manager-phone').style.border = '1px solid red'
				return false
			}

			event.target.classList.add('active')

			let result = true,
				order_number = 1,
				confirm_type = '',
				target = event.target

			document.querySelectorAll('.chat-contact-label input').forEach(item => {
				if (item.checked) {
					confirm_type = item.parentElement.innerText
					return false
				}
			})

			let dialog = document.querySelector('.dialog')

			let obj = {
				product_name: dialog.querySelector('.step-order-title').innerText,
				amount: parseInt(dialog.querySelector('.step-order-num-a').innerText),
				default_price: dialog.querySelector('.order-price-val').getAttribute('data-default-value'),
				get price() {return this.amount * this.default_price},
				when_pay: dialog.querySelector('.payment-time .active').innerText,
				client_name: dialog.querySelector('.step-manager-name').value,
				client_phone: dialog.querySelector('.step-manager-phone').value,
				adress: dialog.querySelector('.step-manager-textarea').value,
				confirmation: dialog.querySelector('.chat-radio-btns input[type="radio"]:checked').parentElement.querySelector('span').innerText,
				id: dialog.querySelector('.step-order-title').getAttribute('data-id')
			}

			sendForm (obj, '/libs/send-chat.php', target).then(response => {
				addFastOrderStep_5 (result, order_number, confirm_type)
				scrollChat (document.querySelectorAll('.manager-phrase'))
			})
		}

		// Нажатие на кнопку Отправить заказ в конце в диалоге без оплаты

		if (event.target.classList.contains('chat-ready-send')) {


			// Потом удалить это. И еще снизу в форме расскоментировать таймер

			// Проверка телефона на заполненность

			if (!document.querySelector('.step-manager-phone').inputmask.isComplete()) {
				document.querySelector('.step-manager-phone').style.border = '1px solid red'
				return false
			}

			let dialog = document.querySelector('.dialog'),
				target = event.target

			let obj = {
				product_name: dialog.querySelector('.step-order-title').innerText,
				amount: parseInt(dialog.querySelector('.step-order-num-a').innerText),
				default_price: dialog.querySelector('.order-price-val').getAttribute('data-default-value'),
				get price() {return this.amount * this.default_price},
				when_pay: dialog.querySelector('.payment-time .active').innerText,
				client_name: dialog.querySelector('.step-manager-name').value,
				client_phone: dialog.querySelector('.step-manager-phone').value,
				adress: 'Временно не работает',
				confirmation: 'Временно не работает',//dialog.querySelector('.chat-radio-btns input[type="radio"]:checked').parentElement.querySelector('span').innerText,
				id: dialog.querySelector('.step-order-title').getAttribute('data-id')
			}

			sendForm (obj, '/libs/send-chat.php', target).then(response => {
				target.innerText = 'Ошибка!'
				return false
				//addFastOrderStep_5 (result, order_number, confirm_type)
				//scrollChat (document.querySelectorAll('.manager-phrase'))
			})
			// Потом удалить это, конец


			/* Потом раскоммментить
			
			addActiveClass (event.target)
			addFastOrderStep_3 (event.target)
			scrollChat (document.querySelectorAll('.manager-phrase'))*/
		}

		if (event.target.classList.contains('chat-ready-send-callme')) {

			addActiveClass (event.target)
			addFastOrderStep_8 (event.target)
			scrollChat (document.querySelectorAll('.manager-phrase'))
		}

		// Конец

		if (event.target.classList.contains('send-request-in-chat')) {

			addFastOrderStep_7 ()
			scrollChat (document.querySelectorAll('.manager-phrase'))
		}

		// Конец
	})

	// конец..

function closeChat (dialog, icon) {

	window.screen.width < 480 ? body_unlock() : ''
	dialog.style.display = 'none'
	icon.style.display = 'block'
}

function openChat (dialog, icon) {

	window.screen.width < 480 ? body_lock() : ''
	icon.style.display = 'none'
	dialog.style.display = 'block'
}

/* Обычный диалог */

function defaultTalkStep_1 () {
	dialogContentArea.innerHTML = ''

	dialogContentArea.insertAdjacentHTML('beforeend',
		`
			${startDialogStepHtml()}
					<p class = "chat-down-p">Рады приветствовать вас!</p>
					<p class = "chat-down-p">Мы собрали для вас лучший кофе в зернах и готовы предложить что-нибудь интересное!</p>
					<p>Ищете что-то конкретное?</p>

					<div class = "step-manager-btns">
						<a class = "step-manager-btn start-talk-ok">Знаю что хочу</a>
						<a class = "step-manager-btn start-talk-no">Что у вас есть?</a>
					</div>
			${endDialogStepHtml()}
		`
	)
}

function defaultTalkStep_2 () {

	dialogContentArea.insertAdjacentHTML('beforeend',
		`
			${startDialogStepHtml()}
				<p class = "chat-down-p">Сегодня у нас представлены такие бренды:</p>
				<div class = "brands-assortiment"></div>
			${endDialogStepHtml()}
		`
	)

	let i = 0

	if (brands.length && i <= brands.length) {
		setTimeout(() => {
			const interval = setInterval(function() {
				document.querySelector('.brands-assortiment').insertAdjacentHTML('beforeend', `<a class = "step-manager-btn-around">${brands[i]}</a>`)
				scrollChat (document.querySelectorAll('.manager-phrase'))
				i++
				if (i >= brands.length) {
					clearInterval(interval)
					document.querySelector('.brands-assortiment').insertAdjacentHTML('beforeend', `<p class = "chat-up-p">Какой вас интересует?</p>`)
					scrollChat (document.querySelectorAll('.manager-phrase'))
				}
			}, 150)
		}, 150)
	}
}

function defaultTalkStep_3 (target) {

	if (!document.querySelector('.chat-assortiment-items')) {

		dialogContentArea.insertAdjacentHTML('beforeend',
			`
				${startDialogStepHtml()}
					<p class = "chat-down-p">Вот что у нас сегодня есть из <b>${target.innerText}</b>:</p>
					<div class = "chat-assortiment-items"></div>
				${endDialogStepHtml()}
			`
		)
	}

	scrollChat (document.querySelectorAll('.manager-phrase'))

	// перебрать массив products и brands и cформировать новый

	let products_by_brand = []

		products.forEach(item => {
			if (item.brand == target.innerText) {
				products_by_brand.push(item)
			}
		})

	let i = 0

	if (products_by_brand.length && i <= products_by_brand.length) {
		document.querySelector('.chat-assortiment-items').innerHTML = ''
		setTimeout(() => {
			let interval = setInterval(function() {
				document.querySelector('.chat-assortiment-items').insertAdjacentHTML('beforeend', `
					<div class = "chat-assortiment-item" data-id = "${products_by_brand[i].id}">
					    <div class = "chat-assortiment-item-w"></div>
						<img src="/images/catalog/brands/${products_by_brand[i].id}/1_s.png" class = "chat-assortiment-pic">
						<p class = "chat-assortiment-text">${products_by_brand[i].brand} ${products_by_brand[i].name}, ${products_by_brand[i].weight}</p>
						<p class = "chat-assortiment-text-pr">${getFinalPriceDecorated (products_by_brand[i].price, products_by_brand[i].sale)} ₽</p>
						<a class = "chat-assortiment-link">Заказать</a>
					</div>`)

				i++
				if (i >= products_by_brand.length) {
					clearInterval(interval)
					scrollChat (document.querySelectorAll('.manager-phrase'))
				}
			}, 150)
		}, 150)
	}
}

function showTastes_1 (target) {

	dialogContentArea.insertAdjacentHTML('beforeend',
		`
			${startDialogStepHtml()}
					<p class = "chat-down-p">Какой вкус предпочитаете?</p>
					<div class = "tastes-assortiment"></div>
			${endDialogStepHtml()}
		`
	)

	let tastes = []

	products.forEach(item => {

		if (tastes.includes(item.chat_tastes)) return
		tastes.push(item.chat_tastes)
	})

	let i = 0

	if (tastes.length && i <= tastes.length) {
		setTimeout(() => {
			const interval = setInterval(function() {
				document.querySelector('.tastes-assortiment').insertAdjacentHTML('beforeend', `<a class = "step-manager-btn-taste">${tastes[i]}</a>`)
				scrollChat (document.querySelectorAll('.manager-phrase'))
				i++
				if (i >= tastes.length) {
					clearInterval(interval)
					scrollChat (document.querySelectorAll('.manager-phrase'))
				}
			}, 150)
		}, 150)
	}
}

function showTastes_2 (target) {

	if (!document.querySelector('.chat-tastes-items')) {

		dialogContentArea.insertAdjacentHTML('beforeend',
			`
				${startDialogStepHtml()}
					<p class = "chat-down-p">Ваш любимый вкус ${target.innerText}. Вот что у нас есть для вас:</p>
					<div class = "chat-tastes-items"></div>
				${endDialogStepHtml()}
			`
		)
	}

	document.querySelector('.chat-tastes-items').parentElement.querySelector('.chat-down-p').innerHTML = `Ваш любимый вкус ${target.innerText}. Вот что у нас есть для вас:`

	scrollChat (document.querySelectorAll('.manager-phrase'))

	// найти все товары по выбранному вкусу

	let products_by_taste = []

		products.forEach(item => {
			if (item.chat_tastes == target.innerText) {
				products_by_taste.push(item)
			}
		})

	let i = 0

	if (products_by_taste.length && i <= products_by_taste.length) {
		document.querySelector('.chat-tastes-items').innerHTML = ''
		let interval = setInterval(function() {
			document.querySelector('.chat-tastes-items').insertAdjacentHTML('beforeend', `
				<div class = "chat-assortiment-item" data-id = "${products_by_taste[i].id}">
				    <div class = "chat-assortiment-item-w"></div>
					<img src="/images/catalog/brands/${products_by_taste[i].id}/1_s.png" class = "chat-assortiment-pic">
					<p class = "chat-assortiment-text">${products_by_taste[i].brand} ${products_by_taste[i].name}, ${products_by_taste[i].weight}</p>
					<p class = "chat-assortiment-text-pr">${getFinalPriceDecorated (products_by_taste[i].price, products_by_taste[i].sale)} ₽</p>
					<a class = "chat-assortiment-link">Заказать</a>
				</div>`)

			scrollChat (document.querySelectorAll('.manager-phrase'))
			i++
			if (i >= products_by_taste.length) {
				clearInterval(interval)
				scrollChat (document.querySelectorAll('.manager-phrase'))
			}
		}, 200)
	}
}


// Информация, по выбранному виду кофе
function defaultTalkStep_4 (target) {

	let product

	for (let i = 0; i < products.length; i++) {

		if (products[i].id == target.parentElement.getAttribute('data-id')) {
			product = products[i]
		}
	}

	dialogContentArea.insertAdjacentHTML('beforeend',
		`
			${startDialogStepHtmlFullWidth()}
					<p class = "chat-down-p">Ваш выбор:</p>
					<img src = "/images/catalog/brands/${product.id}/1_s.png" class = "step-order-pic">
					<p class = "step-order-title" data-id = "${product.id}">${product.brand} ${product.name}, ${product.weight}</p>
					<p class = "step-order-num">
						<span>Количество:&nbsp;</span>
						<a class = "step-order-num-a bold-text-600" data-default-value = "1">1 шт.</a>
						<a class = "step-order-select step-order-minus"></a>
						<a class = "step-order-select step-order-plus"></a>
					</p>
					<p class = "step-order-price">
						<span>Стоимость заказа:</span>&nbsp;
						<span class = "order-price-val bold-text-600" data-default-value = ${getFinalPrice (product.price, product.sale)}>${getFinalPriceDecorated (product.price, product.sale)} ₽</span>
					</p>
			${endDialogStepHtml()}
		`
	);

	scrollChat (document.querySelectorAll('.manager-phrase'))

	dialogContentArea.insertAdjacentHTML('beforeend',
		`	${startDialogStepHtmlFullWidth()}
				<span>Все верно?</span>
				<div class = "step-manager-btns">
					<a class = "step-manager-btn fast-order-ok">Все верно</a>
					<a class = "step-manager-btn fast-order-no">Есть вопросы</a>
				</div>
			${endDialogStepHtml()}
		`
	)
	//scrollChat (document.querySelectorAll('.manager-phrase'))
}

/* Обычный диалог, конец */

/* Ветка диалога, после нажатия "Что у вас есть?" */

function dontKnowStep_1 () {

	dialogContentArea.insertAdjacentHTML('beforeend', 
		`
			${startDialogStepHtmlFullWidth()}
					<p class="chat-down-p">В нашем ассортименте несколько десятков видов. Мы поможем вам определиться с выбором!</p>
					<p class="chat-down-p">
						Многие кофеманы выбирают продукцию любимого проверенного бренда.
						А кто-то любит пробовать разные вкусы в зависимости от настроения.
					</p>
					<p>Как выбираете кофе вы?</p>
					<div class = "step-manager-btns">
						<a class = "step-manager-btn consult-order-ok">Какие есть бренды?</a>
						<a class = "step-manager-btn consult-order-no">Какие есть вкусы?</a>
					</div>
					<div class = "step-manager-btns">
						<a class = "step-manager-btn consult-order-discuss">Хочу получить консультацию в чате или по телефону</a>
					</div>
			${endDialogStepHtml()}
		`
	)

	scrollChat (document.querySelectorAll('.manager-phrase'))
}

/* Ветка диалога, после нажатия "Что у вас есть?", конец */	

// Функция добавления шага в карточке товара

function addFastOrderStep_1 (id, weight, pic, title, num, price) {
	
	dialogContentArea.innerHTML = ''

	dialogContentArea.insertAdjacentHTML('beforeend',
		`${startDialogStepHtml()}
				<span>Добрый день! Ваш выбор:</span>
		${endDialogStepHtml()}
		${startDialogStepHtmlFullWidth()}
				<img src = "${pic}" class = "step-order-pic">
				<p class = "step-order-title" data-id = "${id}">${title}</p>
				<p class = "step-order-num">
					<span>Количество:&nbsp;</span>
					<a class = "step-order-num-a bold-text-600" data-default-value = ${num}>${num} шт.</a>
					<a class = "step-order-select step-order-minus"></a>
					<a class = "step-order-select step-order-plus"></a>
				</p>
				<p class = "step-order-price">
					<span>Стоимость заказа:</span>&nbsp;
					<span class = "order-price-val bold-text-600" data-default-value = ${getFinalPrice (price)}>${getFinalPriceDecorated (price)} ₽</span>
				</p>
		${endDialogStepHtml()}
		${startDialogStepHtmlFullWidth()}
				<span>Все верно?</span>
				<div class = "step-manager-btns">
					<a class = "step-manager-btn fast-order-ok">Все верно</a>
					<a class = "step-manager-btn fast-order-no">Есть вопросы</a>
				</div>
		${endDialogStepHtml()}
		`
	)
}

function addFastOrderStep_2 () {
	dialogContentArea.insertAdjacentHTML('beforeend',
		`${startDialogStepHtml()}
			<span>Отлично! Вам удобнее оплатить заказ сейчас на сайте или при получении товара?<br>
			Мы принимаем оплату любым удобным способом.</span>
			<div class = "step-manager-btns payment-time">
				<a class = "step-manager-btn fast-order-now">Сейчас</a>
				<a class = "step-manager-btn fast-order-after">При получении</a>
			</div>
		${endDialogStepHtml()}
		`
	)
}

function addFastOrderStep_3 (target) {

	if (!document.querySelector('.step-manager-phone').inputmask.isComplete()) {
		document.querySelector('.step-manager-phone').style.border = '1px solid red'
		return false
	}

	dialogContentArea.insertAdjacentHTML('beforeend',
		`${startDialogStepHtml()}
			<div class = "adress-textarea">
				<p class = "step-manager-adress-text bold-text-600">Адрес для доставки и любые комментарии:</p>
				<textarea name = "textarea" class = "step-manager-textarea"></textarea>
				<p class = "step-manager-adress-text margin-top-20px">Куда прислать подтверждение по заказу?</p>
				<form class = "chat-radio-btns" name = "chat-radio-btns">
					<label class="chat-contact-label">
						<input type="radio" name="radio" checked>
						<span>Telegram</span>
					</label>
					<label class="chat-contact-label">
						<input type="radio" name="radio">
						<span>Whatsapp</span>
					</label>
					<label class="chat-contact-label">
						<input type="radio" name="radio">
						<span>Email</span>
					</label>
					<label class="chat-contact-label">
						<input type="radio" name="radio">
						<span>Звонок</span>
					</label>
				</form>
				<a class = "chat-ready chat-ready-adress">Готово</a>
			</div>
		${endDialogStepHtml()}
		`
	)

	document.querySelector('.step-manager-textarea').addEventListener('keydown', () => {
		event.target.style.border = '1px solid rgb(199, 199, 199)'
	})
}


function addFastOrderStep_4 (submit_type) {

	if (document.querySelector('.chat-ready-send')) return false

	dialogContentArea.insertAdjacentHTML('beforeend',
		`${startDialogStepHtml()}
			<p class = "step-manager-adress-text">Для подтверждения заказа необходимы ваши контактные данные.
			<br>В следующем шаге перейдем к доставке.</p>
			<div class = "step-manager-inputs">
				<label class = "step-manager-label">
					<p class = "step-manager-label-p bold-text-600">Ваше имя (по желанию):</p>
					<input type = "text" name = "name" class = "step-manager-input step-manager-name" placeholder = "Имя">
				</label>
				<label class = "step-manager-label">
					<p class = "step-manager-label-p bold-text-600">Ваш телефон:</p>
					<input type = "text" name = "phone" class = "step-manager-input step-manager-phone" placeholder = "+7 (___) ___-__-__">
				</label>
				${submit_type == 'Email' ? `
					<label class = "step-manager-label">
						<p class = "step-manager-label-p bold-text-600">Ваш email:</p>
						<input type = "text" name = "name" class = "step-manager-input step-manager-email" placeholder = "Ваш email">
					</label>` : ''
				}
				<div class = "chat-agree-block">
					<p class = "chat-agree-text">* Нажимая на кнопку "Отправить", Вы даете согласие на обработку персональных данных</p>
				</div>
				<div class = "submit-btns">
					<a class = "chat-ready chat-ready-send">
						${document.querySelector('.fast-order-now').classList.contains('active') ? `Отправить` : `Отправить`}
					</a>
				</div>
			</div>
		${endDialogStepHtml()}
		`
	)

	addPhoneMask (document.querySelector('.step-manager-phone'))
}

function addFastOrderStep_5 (result, order_number, confirm_type) {

	dialogContentArea.insertAdjacentHTML('beforeend',
		`
			${startDialogStepHtml()}
				<p class = "step-manager-adress-text">Спасибо! Мы получили ваш заказ.</p>
				${confirm_type == 'Telegram' ?
					`<p class = "step-manager-adress-text">В ближайшее время пришлем вам подтверждение в Telegram!</p>`
				: ''}
				${confirm_type == 'Звонок' ?
					`<p class = "step-manager-adress-text">В ближайшее время перезвоним вам и подтвердим информацию!</p>`
				: ''}
				${confirm_type == 'Whatsapp' ?
					`<p class = "step-manager-adress-text">В ближайшее время пришлем вам подтверждение в Whatsapp!</p>`
				: ''}
				${confirm_type == 'Email' ?
					`<p class = "step-manager-adress-text">В ближайшее время пришлем вам подтверждение на Email!</p>`
				: ''}
			${endDialogStepHtml()}
		`
	)
}


function addFastOrderStep_6 () {

	dialogContentArea.insertAdjacentHTML('beforeend',
		`
			${startDialogStepHtml()}
				<p class = "step-manager-adress-text">Мы готовы ответить на все ваши вопросы любым удобным способом.</p>
				<div class = "we-are-in-messengers">
					<span class = "step-manager-title">В мессенджерах:</span>
					<p class = "messengers-items">
						<a href = "" class = "messengers-item-link telegram">Telegram</a>
						<a href = "" class = "messengers-item-link whatsapp">Whatsapp</a>
					</p>
				</div>
				<p class = "step-manager-phone-w">
					<span>Телефон: </span>
					<a href = "tel:+70000000000" class = "step-manager-phone-link">+7 (999) 000-00-00</a>
				</p>
				<p class = "step-manager-email-w">
					<span>Email: <span>
					<a href = "mailto:mail@bluebeans.ru" class = "step-manager-email-link">mail@bluebeans.ru</a>
				</p>
				<p>
					<span>Или <a class = "send-request-in-chat">оставить заявку</a> в чате и мы перезвоним вам.</span>
				</p>
			${endDialogStepHtml()}
		`
	)
	scrollChat (document.querySelectorAll('.manager-phrase'))	
}


function addFastOrderStep_7 () {

	if (document.querySelector('.step-manager-inputs')) return false

	dialogContentArea.insertAdjacentHTML('beforeend',
		`
			${startDialogStepHtml()}
				<p class = "step-manager-adress-text">Мы свяжемся с вами по номеру, который вы укажете ниже.</p>
				<div class = "step-manager-inputs">
					<label class = "step-manager-label">
						<p class = "step-manager-p bold-text-600">Ваше имя (по желанию):</p>
						<input type = "text" name = "name" class = "step-manager-input step-manager-name" placeholder = "Имя">
					</label>
					<label class = "step-manager-label">
						<p class = "step-manager-label-p bold-text-600">Ваш телефон:</p>
						<input type = "text" name = "phone" class = "step-manager-input step-manager-phone" placeholder = "+7 (___) ___-__-__">
					</label>
					<p class = "step-manager-label-p bold-text-600">Текст:</p>
					<textarea name = "textarea" class = "step-manager-textarea-request"></textarea>
					<div class = "chat-agree-block">
						<p class = "chat-agree-text">* Нажимая на кнопку "Отправить", Вы даете согласие на обработку персональных данных</p>
					</div>
					<div class = "submit-btns">
						<a class = "chat-ready-request chat-ready-send-callme">Отправить</a>
					</div>
				</div>
			${endDialogStepHtml()}
		`
	)
	addPhoneMask (document.querySelector('.step-manager-phone'))
}

function addFastOrderStep_8 () {

	if (!document.querySelector('.step-manager-phone').inputmask.isComplete()) {
		document.querySelector('.step-manager-phone').style.border = '1px solid red'
		return false
	}

	dialogContentArea.insertAdjacentHTML('beforeend',
		`
			${startDialogStepHtml()}
				<p>Спасибо за вашу заявку. Мы обработаем ее и перезвоним.</p>
			${endDialogStepHtml()}
		`
	)
	addPhoneMask (document.querySelector('.step-manager-phone'))
}


function startDialogStepHtml () {
	return `<div class = "manager-phrase">
			<div class = "manager-img"></div>
			<div class = "manager-text">`
}

function startDialogStepHtmlFullWidth () {
	return `<div class = "manager-phrase">
			<div class = "manager-img"></div>
			<div class = "manager-text manager-text-fullwidth">`
}

function endDialogStepHtml () {
	return `</div></div>`
}

function removeSteps (target) {
	let isset = 0
	document.querySelectorAll('.manager-phrase').forEach(item => {

		if (isset) {
			item.remove()
			return
		}

		item.contains(target) ? isset = 1 : ''
	})
}

function addPhoneMask (el) {
	let im = new Inputmask("+7 (999) 999-99-99")
		im.mask(el)

		el.addEventListener('keyup', () => {
		event.target.style.border = '1px solid rgb(199, 199, 199)'
	})
	el.addEventListener('focus', () => {
		event.target.style.border = '1px solid rgb(199, 199, 199)'
	})
}

function addActiveClass (target) {

	target.parentElement.querySelectorAll('.step-manager-btn').forEach(item => {
		item.classList.remove('active')
	})

	target.classList.add('active')
}

function scrollChat (elements, type = "start") {
	elements[elements.length - 1].scrollIntoView({behavior: "smooth", block: type})
}

//**// Функция для постепенного добавления элементов
// where - в какой блок добавляем
// elements_array - массив с данными для добавления
// speech_num - порялковый номер фразы из коллекции
// ms - скорость добавления

function intervalAdding (block_to_insert, elements_array, speech_num, ms = 10) {
	const interval = setInterval(function() {
		block_to_insert.insertAdjacentHTML('beforeend', `<a class = "step-manager-btn-around">${elements_array[i]}</a>`)
		document.querySelectorAll('.manager-phrase')[speech_num].scrollIntoView({behavior: "smooth", block: "start"})
		i++
		if (i >= elements_array.length) {
			clearInterval(interval)
			block_to_insert.insertAdjacentHTML('beforeend', `<p class = "chat-up-p">Какой вас интересует?</p>`)
			document.querySelectorAll('.manager-phrase')[speech_num].scrollIntoView({behavior: "smooth", block: "start"})
		}
	}, ms)
}

}


function body_lock() {

	let body = document.body;
	if (!body.classList.contains('scroll-locked')) {
		let bodyScrollTop = (typeof window.pageYOffset !== 'undefined') ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop;
		document.querySelector('.nav').classList.contains('nav-static') ? document.querySelector('.nav').classList.add('nav-static-temporary') : ''
		body.classList.add('scroll-locked');
		body.style.top = "-" + bodyScrollTop + "px";
		body.setAttribute("data-popup-scrolltop", bodyScrollTop)
	}
}

function body_unlock() {
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

// Функция, которая считает стоимость со скидкой или без с округлением в пользу клиента единым числом без деления на разряды

function getFinalPrice (price, saleSize = 0) {
    return saleSize ? Math.floor(price - (price / 100 * saleSize)) : parseInt(price)
}

// Функция, которая считает стоимость со скидкой или без с округлением в пользу клиента с делением на разряды для вывода

function getFinalPriceDecorated (price, saleSize = 0, amount = 1) {
    return saleSize ? ((Math.floor(price - (price / 100 * saleSize))) * amount).toLocaleString() : (parseInt(price) * amount).toLocaleString()
}
	
async function sendForm (obj, url, target) {

	if (target.classList.contains('blocked')) return false

	target.classList.add('blocked')
	target.innerText = 'Отправка...'

    let response = await fetch(url, {
        method: 'POST',
        headers: {  
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"  
        },
        body: JSON.stringify(obj)
    })

    let result = await response

    if (result.ok) {
        target.innerText = 'Успешно!'

        setTimeout(() => {
            target.innerText = 'Отправить!'
            target.classList.remove('blocked')
        }, 5000)

        ym(95872157,'reachGoal','send_form')
        return 'Успешно'
    }

    if (!result.ok) {

        target.innerText = 'Ошибка!'

        /*setTimeout(() => {
            target.innerText = 'Отправить!'
            target.classList.remove('blocked')
        }, 5000)*/
        return 'Ошибка'
    }
}

})