const gTrans = {
    'title': {
        en: 'Welcome to my Book Shop',
        he: 'ברוכים הבאים לחנות הספרים שלי'
    },
    'sort': {
        en: 'Sort By',
        he: 'סנן על פי',
    },
    'sort-price': {
        en: 'Max Price',
        he: 'מחיר הכי גבוה',
    },
    'sort-rating': {
        en: 'Minimum Rating',
        he: 'דירוג הכי נמוך'
    },

    'add': {
        en: 'Add Book',
        he: 'הוסף ספר',
    },
    'id': {
        en: 'ID',
        he: 'מספר מזהה',
    },
    'add-todo-placeholder': {
        en: 'What needs to be done?',
        he: 'מה יש לעשות?'
    },
    'sort-book':{
        en: 'Title',
        he: 'שם הספר',
    },
    'sort-book-ascending':{
        en: 'Ascending Order',
        he: 'סדר עולה',
    },
    'sort-book-descending':{
        en: 'Descending Order',
        he: 'סדר יורד',
    },
    'sort-price':{
        en: 'Price',
        he: 'מחיר',
    },
    'sort-price-ascending':{
        en: 'Show Low Price First',
        he: 'מהזול ליקר',
    },
    'sort-price-descending':{
        en: 'Show high Price First',
        he: 'מהיקר לזול',
    },
    'actions':{
        en: 'Actions',
        he: 'פעולות',
    },
    'read':{
        en: 'Read',
        he: 'קרא'
    },
    'update':{
        en: 'Update',
        he: 'עדכן'
    },
    'rating':{
        en: 'Rating',
        he: 'דירוג'
    },
    'book-name':{
        en: 'Book-Name',
        he: 'שם הספר'
    },
    'book-name-placeholder':{
        en: 'Lord of the rings for example...',
        he: 'שר הטבעות לדוגמא'
    },
    'price':{
        en: 'Price (in dollars)',
        he: 'מחיר (בשקל)'
    },
    'price-placeholder':{
        en: '25 for exmaple...',
        he: '25 לדוגמא'
    },
    'flash':{
        en: 'Action done successfully',
        he: 'הפעולה בוצעה בהצלחה',
    },
    'harry-potter': {
        en: 'Harry Potter',
        he: 'הארי פוטר',
    },
    'harry-potter-desc': {
        en: 'Pretty book about the wonders of griffindor',
        he: 'הארי פוטר הוא קוסם דגול',
    },
    'lord-of-the-rings': {
        en: 'Lord of the rings',
        he: 'שר הטבעות',
    },
    'lord-of-the-rings-desc': {
        en: 'Extraordinary Bullshit',
        he: ' שר הטבעות זה סרט יפה לא קראתי',
    },
    'life-of-pi': {
        en: 'Life of Pi',
        he: 'חיי פיי',
    },
    'life-of-pi-desc': {
        en: 'Simplicity',
        he: 'חיי פיי הם פשוטים',
    },
    'filter-placeholder':{
        en: '🔍 Search book here',
        he: '🔍 חפש ספר'
    }
    
}

let gCurrLang = 'en'

function getTrans(transKey) {
    const transMap = gTrans[transKey]
    if (!transMap) return 'UNKNOWN'

    let trans = transMap[gCurrLang]
    if (!trans) trans = transMap.en
    return trans
}

function doTrans() {
    const els = document.querySelectorAll('[data-trans]')
    els.forEach(el => {
        const transKey = el.dataset.trans
        const trans = getTrans(transKey)
        el.innerText = trans
        if (el.placeholder) el.placeholder = trans
    })
}

function setLang(lang) {
    gCurrLang = lang
}

function getCurrLang(){
    return gCurrLang
}

function formatNum(num) {
    return new Intl.NumberFormat(gCurrLang).format(num)
}

function formatCurrency(num) {
    return gCurrLang === 'he' ? new Intl.NumberFormat('he-IL',{style:'currency',currency:'ILS'}).format(num)
    :  new Intl.NumberFormat('en',{style:'currency',currency:'USD'}).format(num)
}

function formatDate(time) {
    const options = {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: 'numeric', minute: 'numeric',
        hour12: true,
    }
    return new Intl.DateTimeFormat(gCurrLang, options).format(time)
}
