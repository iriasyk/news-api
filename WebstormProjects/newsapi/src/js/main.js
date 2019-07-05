'use strict';

const
    url = 'https://newsapi.org/v2/sources?apiKey=ba82c88fb4c4409fb16ee979db68c14e',
    req = new Request(url),
    divWrapper = document.querySelector('.wrapper');

fetch(req)
    .then((response) => response.json())
    .then((response) => {
            const everythingInformation = response.sources,
                selectHeader = document.createElement('select');

            for (let i = 0; i < everythingInformation.length; i++) {
                const option = document.createElement('option');
                option.innerHTML = `${everythingInformation[i].name}`;
                option.setAttribute('data-id', `${everythingInformation[i].id}`);
                option.classList.add('active-option');

                selectHeader.appendChild(option);
            }

            selectHeader.addEventListener ('change', function (e) {
                const newOption = this.options[this.selectedIndex].getAttribute('data-id'),
                    selectObj = everythingInformation.filter((x) => x.id === newOption);

                let url = `https://newsapi.org/v2/everything?sources=${selectObj[0].id}&apiKey=ba82c88fb4c4409fb16ee979db68c14e`;
                const req = new Request(url);
                fetch(req)
                    .then((response) => response.json())
                    .then((response) => {
                        console.log(response.articles);

                        const sourcesInfo = response.articles,
                            divWithNews = document.querySelector('.container-parent__news');

                        divWithNews.innerHTML = '';

                        for (let i = 0; i < sourcesInfo.length; i++) {
                            const
                                divWrapperCard = document.createElement('div'),
                                divImg = document.createElement('div'),
                                img = document.createElement('img'),
                                linkA = document.createElement('a'),
                                divDescription = document.createElement('div'),
                                divFooter = document.createElement('div'),
                                spanForTime = document.createElement('span'),
                                buttonLike = document.createElement('div'),
                                titleH3 = document.createElement('h3');

                            linkA.setAttribute('target', '_blank');
                            linkA.setAttribute('href', `${sourcesInfo[i].url}`);

                            img.setAttribute('src', `${sourcesInfo[i].urlToImage}`);
                            img.setAttribute('alt', `${sourcesInfo[i].source.name}`);

                            linkA.appendChild(img);
                            divImg.appendChild(linkA);
                            divDescription.innerHTML = `${sourcesInfo[i].description}`;
                            spanForTime.innerHTML = `${sourcesInfo[i].publishedAt}`;
                            titleH3.innerHTML = `${sourcesInfo[i].title}`;

                            img.classList.add('image-news');
                            divImg.classList.add(`container-news`);
                            divDescription.classList.add(`description-news`);
                            divFooter.classList.add(`footer-container`);
                            divWrapperCard.classList.add(`wrapper-card`);
                            buttonLike.classList.add('heart-img');
                            titleH3.classList.add('titles');

                            divWrapperCard.appendChild(divImg);
                            divWrapperCard.appendChild(divDescription);
                            divFooter.appendChild(spanForTime);
                            divFooter.appendChild(buttonLike);
                            divWrapperCard.setAttribute('data-id', `${sourcesInfo[i].source.id}${i}`);
                            divWrapperCard.appendChild(divFooter);
                            divWithNews.appendChild(titleH3);
                            divWithNews.appendChild(divWrapperCard);
                        }

                        divWrapper.appendChild(divWithNews);

                        const heart = document.querySelectorAll('.heart-img');

                        heart.forEach(element => {
                            const
                                wrapper = element.closest('.wrapper-card'),
                                valueDataId = wrapper.getAttribute('data-id');

                            if(JSON.parse(localStorage.getItem(`${valueDataId}`))) {
                                JSON.parse(localStorage.getItem(`${valueDataId}`)) === true ?
                                    element.classList.add('active-heart') :
                                    element.classList.add('passive-heart');
                            }
                        });


                        let heartFlag = false;

                        heart.forEach(
                            element => element.addEventListener('click', function renderHeart() {
                                const
                                    wrapper = this.closest('.wrapper-card'),
                                    valueDataId = wrapper.getAttribute('data-id');

                                if(JSON.parse(localStorage.getItem(`${valueDataId}`))) {
                                    this.valueDataId = !heartFlag;

                                    localStorage.setItem(`${valueDataId}`, `${heartFlag}`);

                                    heartFlag === false ?
                                        this.classList.toggle('passive-heart') :
                                        this.classList.toggle('active-heart');
                                } else {
                                    this.valueDataId = true;

                                    localStorage.setItem(`${valueDataId}`, `${this.valueDataId}`);

                                    this.valueDataId === false ?
                                        this.classList.toggle('passive-heart') :
                                        this.classList.toggle('active-heart');
                                }
                            }
                        ));

                        const titles = document.querySelectorAll('.titles'),
                            active = document.getElementsByClassName('active');

                        Array.from(titles).forEach((item) => {
                            item.addEventListener('click', function(e) {
                                if (active.length > 0 && active[0] !== this) {
                                    active[0].classList.remove('active');
                                }

                                this.classList.toggle('active');
                            });
                        });
                });
            });
            divWrapper.appendChild(selectHeader);
        }
    );