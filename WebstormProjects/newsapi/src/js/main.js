'use strict';

const url = 'https://newsapi.org/v2/sources?apiKey=ba82c88fb4c4409fb16ee979db68c14e', // url на данные всех источников
    req = new Request(url),
    divWrapper = document.querySelector('.wrapper');

const createNewElement = (tagName) => document.createElement(tagName),
    addText = (element, text) => element.innerText = text, // ф-я добавление текста в тег
    addClassList = (element, className) => element.classList.add(className), // ф-я добавления класса в елемент
    addAttribute = (element, nameAttribute, value) => element.setAttribute(nameAttribute, value), // ф-я добавления атрибута с значением в елемент
    addChildToParent = (parentElement, childrenElement) => parentElement.appendChild(childrenElement); // ф-я добавления дочернего елемента в родительский елемент

fetch(req)
    .then(response => response.json())
    .then(response => {
        const everythingInformation = response.sources,
            selectHeader = createNewElement('select');

        for (let i = 0; i < everythingInformation.length; i++) {
            const option = createNewElement('option');

            addText(option, `${everythingInformation[i].name}`); // заполнение option источниками

            addAttribute(option, 'data-id', `${everythingInformation[i].id}`); // создание id для каждого источника

            addChildToParent(selectHeader, option); // добавление option в select
        }

        function changeAll(e) {
            const newOption = this.options[this.selectedIndex].getAttribute('data-id'), // получение значение data-id элемента option
                selectObj = everythingInformation.find(x => x.id === newOption); // поиск id в обьекте, что равен значию в атрибуте data-id

            let url = `https://newsapi.org/v2/everything?sources=${selectObj.id}&apiKey=ba82c88fb4c4409fb16ee979db68c14e`; // генерация сменного url, для получения новости от определённого источника
            const req = new Request(url);

            fetch(req)
                .then(response => response.json())
                .then(response => {
                    const sourcesInfo = response.articles,
                        divWithNews = document.querySelector('.container-parent__news');

                    divWithNews.innerHTML = ''; // чистка старых полученных новостей, при смене источника

                    for (let i = 0; i < sourcesInfo.length; i++) {
                        const divWrapperCard = createNewElement('div'),
                            divImg = createNewElement('div'),
                            img = createNewElement('img'),
                            linkA = createNewElement('a'),
                            divDescription = createNewElement('div'),
                            divFooter = createNewElement('div'),
                            spanForTime = createNewElement('span'),
                            buttonLike = createNewElement('div'),
                            titleH3 = createNewElement('h3');

                        addAttribute(linkA, 'target', '_blank'); // генерация атрибута target="_blank" для ссылок
                        addAttribute(linkA, 'href', `${sourcesInfo[i].url}`); // генерация url для атрибута href в ссылке
                        addAttribute(img, 'src', `${sourcesInfo[i].urlToImage}`); // генерация url для картинки ссылки
                        addAttribute(img, 'alt', `${sourcesInfo[i].source.name}`); // генерация описания для картинки ссылки
                        addAttribute(divWrapperCard, 'data-id', `${sourcesInfo[i].source.id}${i}`); // создание атрибута data-id с определённым id новости от источника

                        addText(divDescription, `${sourcesInfo[i].description}`); // заполнение блока .description-news описанием
                        addText(spanForTime, `${sourcesInfo[i].publishedAt}`); // заполнение span временем публикации новости от источника
                        addText(titleH3, `${sourcesInfo[i].title}`); // заполнение h3 текстом, что являеться заголовком новости

                        addClassList(img, 'image-news');
                        addClassList(divImg, 'container-news');
                        addClassList(divDescription, 'description-news');
                        addClassList(divFooter, 'footer-container');
                        addClassList(divWrapperCard, 'wrapper-card');
                        addClassList(buttonLike, 'heart-img');
                        addClassList(titleH3, 'titles');

                        addChildToParent(linkA, img); // добавление img в ссылку
                        addChildToParent(divImg, linkA); // добавление ссылки в блок .container-news
                        addChildToParent(divWrapperCard, divImg); // добавление блока с картинкой в карточку новости
                        addChildToParent(divWrapperCard, divDescription); // добавление блока с описанием в карточку новости
                        addChildToParent(divFooter, spanForTime); // добавление время публикации новости в карточку
                        addChildToParent(divFooter, buttonLike); // добавление кнопки "мне нравиться" в блок .footer-container
                        addChildToParent(divWrapperCard, divFooter); // добавление .footer-container в карточку новостей
                        addChildToParent(divWithNews, titleH3); // добавление заголовка в карточку новостей
                        addChildToParent(divWithNews, divWrapperCard); // добавление карточки новостей в wrapper для всех новостей
                    }

                    addChildToParent(divWrapper, divWithNews); // добавление всего блока с новостями в родительский wrapper

                    const heart = document.querySelectorAll('.heart-img');

                    heart.forEach(element => {
                        const wrapper = element.closest('.wrapper-card'), // поиска родительского блока с классом .wrapper-card
                            valueDataId = wrapper.getAttribute('data-id'), // получение значения атрибута data-id с ближайшего найденного элемента с классом .wrapper-card
                            valueLocalStorage = localStorage.getItem(`${valueDataId}`); // получение значения из локаольного хранилища по ключу valueDataId

                        if(valueLocalStorage) { // проверка сущестования значения из локального хранилища
                            valueLocalStorage === 'true' ?
                                addClassList(element, 'active-heart') : // добавление картинки в виде "активного" сердечка
                                addClassList(element, 'passive-heart'); // добавление картинки в виде "пассивного" сердечка
                        }
                    });

                    let heartFlag;

                    function renderHeart() { // ф-я логики рендера сердечек
                        const wrapper = this.closest('.wrapper-card'),
                            valueDataId = wrapper.getAttribute('data-id'),
                            valueLocalStorage = localStorage.getItem(`${valueDataId}`);

                        if(valueLocalStorage === null) { // проверка на сущестовавание значения ключа valueDataId
                            heartFlag = true;

                            localStorage.setItem(`${valueDataId}`, `${heartFlag}`); // если значения не существовало, то теперь значения ключа valueDataId будет true

                            // console.log('1', heartFlag, valueLocalStorage);
                        } else if(valueLocalStorage === 'true') { // проверка значения на, то что сердечко активно
                            heartFlag = false;

                            localStorage.setItem(`${valueDataId}`, `${heartFlag}`); // сохранение значения false в valueDataId

                            // console.log('2', heartFlag, valueLocalStorage);
                        } else if(valueLocalStorage === 'false') { // проверка значения на то, что сердечко не активно
                            heartFlag = true;

                            localStorage.setItem(`${valueDataId}`, `${heartFlag}`); // сохранение значения true в valueDataId

                            // console.log('3', heartFlag, valueLocalStorage);
                        }

                        // console.log(valueLocalStorage);

                        heartFlag === true ?
                            this.classList.toggle('active-heart') : // добавление класса active-heart если не было, удаление если было
                            this.classList.toggle('passive-heart'); // добавление класса passive-heart если не было, удаление если было
                    }

                    heart.forEach(element => element.addEventListener('click', renderHeart)); // подвешивание события для рендера сердечка по клику

                    const titles = document.querySelectorAll('.titles'),
                        active = document.getElementsByClassName('active'); // для возвращения живой коллекции

                    function updateClassTitle() {
                        if (active.length > 0 && active[0] !== this) { // если есть активный элемент, и это не тот по которому кликнули
                            active[0].classList.remove('active'); // удаление класса active
                        }

                        this.classList.toggle('active'); // добавление класса active если не было, удаление если было
                    }

                    titles.forEach(item => {
                        item.addEventListener('click', updateClassTitle); // подвешивание события на заголовок
                    });
                });
        }
        selectHeader.addEventListener('change', changeAll); // подвешивание change для отрисовки и контроля всего контента

        addChildToParent(divWrapper, selectHeader); // добавление select в самый главный родительский wrapper
    }
);