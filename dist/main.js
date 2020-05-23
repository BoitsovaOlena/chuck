let Storage = localStorage.getItem('LIST');
let dataList = Storage ? JSON.parse(Storage): {}
function onSubmit(evt) {
    if(evt.keyCode == 13){
        evt.preventDefault();
    }
}
function formSubmission(evt) {
    evt.preventDefault();
    
    let step  = document.querySelectorAll("input[name=joke]")
    for (let i=0; i<step.length; i++ ) {
        if (step[i].checked && (step[i].value == 'search')){
            let request  = document.getElementById("search")

            fetch(`https://api.chucknorris.io/jokes/search?query=${request.value}`)
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                renderItems(data.result)
            })
            .catch(() => {

                console.log('error')
            });
            request.value = ''
        }
        if (step[i].checked && (step[i].value == 'categories')){

            let categori  = document.querySelectorAll(".categori-list > input[name=categori]")
            for (let i=0; i<categori.length; i++ ) {
                if(categori[i].checked){
                    fetch(`https://api.chucknorris.io/jokes/random?category=${categori[i].value}`)
                    .then((response) => {
                        return response.json();
                    })
                    .then((data) => {
                        renderItems([data])

                    });
                }
            }
        }
        if (step[i].checked && (step[i].value == 'random')){
            fetch('https://api.chucknorris.io/jokes/random')
            .then((response) => {
                return response.json();
            })
            .then((data) => {

                renderItems([data])
            });
            }   
    }
}
function onSelect(evt) {
    let categori = document.querySelector('.categori-list')
    let request = document.querySelector('.request')
    if(evt.target.value == "categories"){
        fetch(`https://api.chucknorris.io/jokes/categories`)
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            getCategories(data)
        });
        if (!categori.classList.contains("visible")){
            categori.classList.add('visible')
        }
        if (request.classList.contains("visible")){
            request.classList.remove('visible')
        }
    }
    if(evt.target.value == "random"){
        if (categori.classList.contains("visible")){
            categori.classList.remove('visible')
        }
        if (request.classList.contains("visible")){
            request.classList.remove('visible')
        }
    }
    if(evt.target.value == "search"){
        if (categori.classList.contains("visible")){
            categori.classList.remove('visible')
        }
        if (!request.classList.contains("visible")){
            request.classList.add('visible')
        }
    }

}
function getCategories(data) {
    let list = `
        ${
            data
                .map(function(value, index){
                    return `<input type="radio" name="categori" value="${value}" id="categori${index}"><label for="categori${index}">${value}</label>`;
                })
                .join('\n')
        }
    `
    document.querySelector('.categori-list').innerHTML = list;
}
function getItem(data, i=0) {
    return `
    <div class="joke-item">
        <div class="joke-item__icon">
            <img src="./dist/img/message.png">
        </div>
        <div class="joke-item__main">
            <p class="joke-item__messageID">ID: <a href="${data.url}" title="message">${data.id}</a></p>
            <p class="joke-item__text">${data.value}</p>
            <div class="joke-item__data">
                <span class="joke-item__update">Last update: ${Math.ceil((new Date - new Date(data.updated_at))/(1000 * 3600))} hours ago</span>
                ${data.categories.length > 0 ? `<span class="joke-item__categori">${data.categories}</span>` : `<span></span>`}
            </div>
        </div>
        <div class="joke-item__favorite" id = "${i}" data-id ="${data.id}">
        </div>
    </div>
`
}

function renderItems(data) {
    let list = `` 
    for (let i=0; i<data.length; i++ ) {
        list += getItem(data[i], i)
    }
    
    document.querySelector('.joke-list').innerHTML = list
    let favorite = document.querySelectorAll(".joke-list > .joke-item > .joke-item__favorite")
    for (let i=0; i<favorite.length; i++ ) {
        favorite[i].addEventListener( 'click', onClickFavorite, false );
        for (let item in dataList) {
            if (item == data[i].id){
                favorite[i].classList.add('full')
            }
        }
    }
    function onClickFavorite(evt) {
        evt.target.classList.toggle('full')
        if(evt.target.classList.contains('full')) {
            dataList[data[evt.target.id].id] ? delete dataList[data[evt.target.id].id] : (dataList[data[evt.target.id].id] = data[evt.target.id])

        } else {
            delete dataList[data[evt.target.id].id]
        }
        localStorage.setItem('LIST', JSON.stringify(dataList))
        var myEvent = new CustomEvent("listChange", {
            detail: dataList
        });
        document.querySelector(".content").dispatchEvent(myEvent);
    }
 
}
function renderFavorit(listFav) {
    let list = `` 
    for (let item in listFav) {
        list += getItem(listFav[item], item)
    }
    document.querySelector('.content').innerHTML = list
    let favorite = document.querySelectorAll(".content > .joke-item > .joke-item__favorite")
    for (let i=0; i<favorite.length; i++ ) {
        favorite[i].addEventListener( 'click', onClickFavorite, false );
        favorite[i].classList.add('full')
    }
    function onClickFavorite(evt) {
        evt.target.classList.toggle('full')
        let found = document.querySelectorAll(".joke-list > .joke-item > .joke-item__favorite")
        for (let i=0; i<found.length; i++ ) { 
            if(found[i].dataset.id==evt.target.id){
                found[i].classList.remove('full')
            }
        }
        delete dataList[evt.target.id]
        localStorage.setItem('LIST', JSON.stringify(dataList))

        var myEvent = new CustomEvent("listChange", {
            detail: dataList
        });
        document.querySelector(".content").dispatchEvent(myEvent);
    }
 
}
function renderFavoritItems(evt) {
    renderFavorit(evt.detail)
}
function vueChange(evt) {
    let Fav = document.querySelector(".favourite")
    Fav.classList.toggle('open')
}


window.onload = function(){
    let text = document.querySelector(".request")
    text.addEventListener( 'keydown', onSubmit, false );
    let form = document.querySelector("form")
    form.addEventListener( 'change', onSelect, false );
    let button = document.querySelector("button")
    button.addEventListener( 'click', formSubmission, false );
    let change = document.querySelector(".button-favorite-mini")
    change.addEventListener( 'click', vueChange, false );
    let favorites = document.querySelector(".content")
    favorites.addEventListener("listChange", renderFavoritItems, false);
    localStorage.setItem('LIST', JSON.stringify(dataList))
    renderFavorit(dataList)
}