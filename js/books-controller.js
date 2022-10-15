'use strict'

function onInit() {
    createBooks()
    renderFilterByQueryStringParams()
    renderBooks()
    renderPagingButtons()

    const bookId = loadFromStorage('modalDB')
    if (bookId) onReadBook(bookId)

}

function renderBooks() {
    const books = getBooksForDisplay()
    var strHtmls
    var favLayout = loadFromStorage('favLayout')
    // loadFromStorage('favLayout')
    if (!favLayout || favLayout === 'table') {
        strHtmls = books.map(book =>
            `
            <tr>
            <td>${book.id}</td>
            <td data-trans="${book.name.toLowerCase()}">${book.name}</td>
            <td>${formatCurrency(book.price)}</td>
            <td><button class="read btn btn-primary" onclick="onReadBook('${book.id}')" data-trans="read">Read</button></td>
            <td><button class="update btn btn-warning" onclick="onUpdateBook('${book.id}')" data-trans="update">Update</button></td>
            <td><button class="remove btn btn-danger" onclick="onRemoveBook('${book.id}')">X</button></td>
            </tr>
            `
        )
        document.querySelector('.books-container').classList.remove('hide')
        document.querySelector('.books-cards-container').classList.add('hide')
        document.querySelector('.books-container tbody').innerHTML = strHtmls.join('')
    } else {
        strHtmls = books.map(book =>
            `
            <div class="book">
                <div class="description"><span data-trans="${book.name.toLowerCase()}">${book.name}</span>, ${formatCurrency(book.price)}</div>
                <img src="./img/book-pictures/${book.image}.jfif" alt="book img"/>
                <div class="book-actions"><button class="read btn btn-primary" onclick="onReadBook('${book.id}')" data-trans="read">Read</button>
                <button class="update btn btn-warning" onclick="onUpdateBook('${book.id}')" data-trans="update">Update</button>
                <button class="remove btn btn-danger" onclick="onRemoveBook('${book.id}')">X</button> </div>
            </div>

            `
        )
        document.querySelector('.books-container').classList.add('hide')
        document.querySelector('.books-cards-container').classList.remove('hide')
        document.querySelector('.books-cards-container').innerHTML = strHtmls.join('')
    }
    doTrans()
}

function renderModalForBook(bookId) {
    const book = getBookById(bookId)
    const strHtml =
        `
        <button class="close-btn" onclick="onCloseModal()">X</button>
        <h4 data-trans="${book.name.toLowerCase()}">${book.name}</h4>
        <div class="price">
        <span data-trans="sort-price">Price</span>: <span id=price>${formatCurrency(book.price)}</span>
        </div>
        <div class="rating">
            <h5 class="inline-block"><span data-trans="rating">Rating</span>:</h5>
            <button class="btn btn-primary" ${book.rating <= 0 ? 'disabled' : 'enabled'} onclick="onUpdateRating('${book.id}',-1)">➖</button>
            <h6> <span>${book.rating}</span></h6>
            <button class="btn btn-primary" ${book.rating >= 10 ? 'disabled' : 'enabled'} onclick="onUpdateRating('${book.id}',1)">➕</button>
        </div>
        <p data-trans="${book.name.toLowerCase()}-desc">${book.details}</p>
        `
    document.querySelector('.details-modal').innerHTML = strHtml
    doTrans()
}

function renderFilterByQueryStringParams() {
    const queryStringParams = new URLSearchParams(window.location.search)
    const filterBy = queryStringParams.get('text') || ''
    const lang = queryStringParams.get('lang') || 'en'

    // if (!filterBy) return

    document.querySelector('.filter input').value = filterBy
    document.querySelector('.lang select').value = lang
    setFilter('text', filterBy)
    onSetLang(lang)
}

function renderModalForNewBook() {
    const strHtml = `
    <button class="close-btn" onclick="onCloseModal()">X</button>
    <form onsubmit="onAddBook(event)">
    <label for="book-name" data-trans="book-name">Book-Name</label>
        <input id="book-name" data-trans="book-name-placeholder" placeholder="Lord of the rings for example..." type="text"/>
        <br/>
        <label for="price" data-trans="price">Price (in dollars)</label>
        <input id="price" min="1" data-trans="price-placeholder" placeholder="25 for exmaple..." type="number"/>
        <br/>
        <button data-trans="add">Add Book</button>
        </form>
    `
    document.querySelector('.details-modal').innerHTML = strHtml
    doTrans()
}

function onLayout(str) {
    setLayout(str)
    renderBooks()
}

function onAddBookModal() {
    saveToStorage('modalDB', 'open')
    renderModalForNewBook()
    toggleModal()
}

function onRemoveBook(bookId) {
    removeBook(bookId)
    flashMsg()
    renderBooks()
    renderPagingButtons()
}

function onAddBook(ev) {
    ev.preventDefault()
    const elBookName = document.querySelector('[id=book-name]')
    const name = elBookName.value

    const elBookPrice = document.querySelector('[id=price]')
    const price = elBookPrice.value

    // const name = prompt('Enter the book name')
    // const price = +prompt('Enter the book price')
    if (!name || !price) return
    if (isBookExist(name)) {
        console.log('Book already exist... Try updating book instead');
        return
    }

    addBook(name, price)
    renderBooks()
    renderPagingButtons()
    onCloseModal()
    flashMsg()
}

function onUpdateBook(bookId) {
    const price = +prompt('Enter the book new price')
    if (!price) return

    updateBook(bookId, price)
    flashMsg()
    renderBooks()
}

function onReadBook(bookId) {
    saveToStorage('modalDB', bookId)
    renderModalForBook(bookId)
    openModal()
}

function toggleModal() {
    document.querySelector('.details-modal').classList.toggle('open')
}

function openModal() {
    document.querySelector('.details-modal').classList.add('open')
}

function onCloseModal() {
    saveToStorage('modalDB', '')
    document.querySelector('.details-modal').classList.remove('open')
}

function onUpdateRating(bookId, strNum) {
    updateRating(bookId, strNum)
    renderModalForBook(bookId)
    renderBooks()
}

function onSetSort(sorter) {
    console.log(sorter);
    setSort(sorter)
    renderBooks()
}

function onSetFilter(filter, value) {
    setFilter(filter, value)
    renderBooks()
    renderUrl()
}

function renderUrl() {
    const queryStringParams = `?${getTextFilter() ? `text=${getTextFilter()}` : ''}${getCurrLang() === 'he' ? '&lang=he' : ''}`
    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + queryStringParams
    window.history.pushState({ path: newUrl }, '', newUrl)
}

function onUpdatePage(num) {
    updatePage(num)
    renderBooks()
    renderPagingButtons()
}

function renderPagingButtons() {
    var firstPage = getPageNumber()
    var secondPage = getPageNumber() + 1
    var thirdPage = getPageNumber() + 2

    if (isLastPage(getPageNumber())) {
        firstPage = getPageNumber() - 1
        secondPage = getPageNumber()
        thirdPage = getPageNumber() + 1
    }

    if (isLastPage(getPageNumber() - 1)) {
        firstPage = getPageNumber() - 2
        secondPage = getPageNumber() - 1
        thirdPage = getPageNumber()
    }

    var strHtml = `

    <div class="btn-group">
    <button ${isFirstPage() ? 'disabled' : 'enabled'} onclick="onUpdatePage(-1)" class="prev">&lt</button>
        <button ${getPageNumber() === firstPage ? 'disabled' : 'enabled'}
         onclick="onChangePage(${firstPage})" >${firstPage}</button>

        <button ${getPageNumber() === secondPage ? 'disabled' : 'enabled'}
         onclick="onChangePage(${secondPage})" >${secondPage}</button>

        <button ${getPageNumber() === thirdPage ? 'disabled' : 'enabled'}
         onclick="onChangePage(${thirdPage})" >${thirdPage}</button>
    <button ${isLastPage() ? 'disabled' : 'enabled'} onclick="onUpdatePage(1)" class="next">&gt</button>
    </div>
    `
    document.querySelector('.paging-buttons').innerHTML = strHtml
}

function onChangePage(num) {
    changePage(num)
    renderBooks()
    renderPagingButtons()
}

function flashMsg() {
    var elFlashModal = document.querySelector('.flash-modal')
    elFlashModal.classList.remove('hide')

    setTimeout(() => {
        elFlashModal.classList.add('hide')
    }, 3000);
}

function onSetLang(lang) {
    setLang(lang)
    setDirection(lang)
    renderBooks()
    renderUrl()
}

function setDirection(lang) {
    if (lang === 'he') document.body.classList.add('rtl')
    else document.body.classList.remove('rtl')
}