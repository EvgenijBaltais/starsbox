import { body_lock, body_unlock } from './functions.min.js'


    // Карусель товаров

    (() => {

        if (document.querySelectorAll('.catalog-carousel__item').length) {

            document.querySelectorAll('.catalog-carousel__item').forEach((item, index) => {
                document.querySelector('.carousel-catalog__dots').insertAdjacentHTML('beforeEnd', `<div class = "carousel-catalog__dot ${[index == 0 ? 'active' : '']}"></div>`)
            })

            let glide = new Glide('.catalog-carousel', {
                type: 'carousel',
                keyboard: true,
                gap: 20,
                perView: 3,
                animationTimingFunc: 'linear',
                animationDuration: 300,
                breakpoints: {
                    800: {
                        perView: 2
                    },
                    480: {
                        perView: 1
                    }
                }
            })

            glide.on('run', function() {
                document.querySelector('.carousel-catalog__dot.active').classList.remove('active')
                document.querySelectorAll('.carousel-catalog__dot')[glide.index].classList.add('active')
            })
            
            glide.mount()

            document.querySelector('.catalog-carousel__left').addEventListener('click', () => {
                glide.go('<')
            })

            document.querySelector('.catalog-carousel__right').addEventListener('click', () => {
                glide.go('>')
            })

        }
    })();

        
    // Карусель брендов
    
    (() => {

        if (!document.querySelectorAll('.brand-carousel__item').length) return false

        document.querySelectorAll('.brand-carousel__item').forEach((item, index) => {
            document.querySelector('.carousel-brand__dots').insertAdjacentHTML('beforeEnd', `<div class = "carousel-brand__dot ${[index == 0 ? 'active' : '']}"></div>`)
        })

        let glide_brands = new Glide('.brand-carousel', {
            type: 'carousel',
            keyboard: true,
            gap: 20,
            perView: 4,
            animationTimingFunc: 'linear',
            animationDuration: 300,
            breakpoints: {
                800: {
                    perView: 2
                },
                480: {
                    perView: 1
                }
            }
        })

        glide_brands.on('run', function() {
            
            document.querySelector('.carousel-brand__dot.active').classList.remove('active')
            document.querySelectorAll('.carousel-brand__dot')[glide_brands.index].classList.add('active')
        })
        
        glide_brands.mount()

        document.querySelector('.brand-carousel__left').addEventListener('click', () => {
            glide_brands.go('<')
        })

        document.querySelector('.brand-carousel__right').addEventListener('click', () => {
            glide_brands.go('>')
        })
    })()


    // Слайдер в товаре

    ;(function(){

        if (!document.querySelector('.glide')) return false
        
            // активный квадрат
            
            document.querySelector('.product-icons-ins').insertAdjacentHTML('beforeEnd', `<div class = "product-icon-item-active"></div>`)
            let activeBlock = document.querySelector('.product-icons').querySelector('.product-icon-item-active')
            let activeIndex = 1

            document.querySelectorAll('.product-icon-item').forEach(item => {
                item.addEventListener('click', () => {
                    activeIndex = +event.target.getAttribute('data-glide-dir').slice(1) + 1
                    document.querySelector('.glide__item-pic').style.backgroundImage =  
                    `url('../images/catalog/brands/${document.querySelector('.order-button').getAttribute('data-id')}/${activeIndex}_m.png')`

                    document.querySelector('.glide__item-pic').setAttribute('data-index', activeIndex)

                    activeBlock.style.left = event.target.offsetLeft + 'px'

                    // Подвинуть контейнер

                    moveIconsContainer(event.target)
                })
            })

            document.querySelector('.product-pics-left').addEventListener('click', () => {

                activeIndex == 1 ? activeIndex = document.querySelectorAll('.product-icon-item').length + 1 : ''

                document.querySelector('.glide__item-pic').style.backgroundImage =  
                `url('../images/catalog/brands/${document.querySelector('.order-button').getAttribute('data-id')}/${--activeIndex}_m.png')`

                document.querySelector('.glide__item-pic').setAttribute('data-index', activeIndex)

                activeBlock.style.left = document.querySelectorAll('.product-icon-item')[activeIndex - 1].offsetLeft + 'px'
                
                moveIconsContainer(document.querySelectorAll('.product-icon-item')[activeIndex - 1])
            })

            document.querySelector('.product-pics-right').addEventListener('click', () => {

                activeIndex == document.querySelectorAll('.product-icon-item').length ? activeIndex = 0 : ''
                
                document.querySelector('.glide__item-pic').style.backgroundImage =  
                `url('../images/catalog/brands/${document.querySelector('.order-button').getAttribute('data-id')}/${++activeIndex}_m.png')`

                document.querySelector('.glide__item-pic').setAttribute('data-index', activeIndex)

                activeBlock.style.left = document.querySelectorAll('.product-icon-item')[activeIndex - 1].offsetLeft + 'px'

                moveIconsContainer(document.querySelectorAll('.product-icon-item')[activeIndex - 1])

            })

            // Вызов всплывающей галереи

            document.querySelector('.glide__item-pic').addEventListener('click', () => {

                if (event.target.classList.contains('show-gallery') || event.target.classList.contains('glide__item-pic')) {

                    let picSize = 'b'
                    window.screen.width > 500 ? '' : picSize = 'm'

                    setTimeout(() =>{
                        document.body.insertAdjacentHTML('beforeend', `
                            <div class = "white-overlay">
                                <img src = "../images/catalog/brands/${document.querySelector('.order-button').getAttribute('data-id')}/${document.querySelector('.glide__item-pic').getAttribute('data-index')}_${picSize}.png" class = "white-overlay-pic">
                                <div class = "white-close-overlay"></div>
                            </div>
                        `)
                    }, 0)

                    setTimeout(() =>{
                        document.querySelector('.white-overlay').style.opacity = 1
                    }, 30)
                    body_lock()
                }
            })

            // Закрытие всплывающей галереи

            document.body.addEventListener('click', () => {

                if (event.target.classList.contains('white-close-overlay') || event.target.classList.contains('white-overlay')) {
                    document.querySelectorAll('.white-overlay').forEach(item => {
                        item.remove()
                    })
                    body_unlock()
                }
            })
    })();

    // Убрать скрытие, которое препятствует дерганию карусели при загрузке и отрисовке

    if (document.querySelector('.product-pics')) {
        document.querySelector('.product-pics').classList.remove('hidden-el')
    }


function moveIconsContainer(target) {
    let iconsWidth = parseInt(getComputedStyle(target).width + parseInt(getComputedStyle(target).marginRight))
                
    if (target.offsetLeft >= iconsWidth * 3) {
        target.parentElement.style.left = -((parseInt(target.getAttribute('data-glide-dir').slice(1)) - 3) * iconsWidth) + 'px'
        return false
    }
    
    target.parentElement.style.left = 0
}