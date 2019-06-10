const li = document.querySelector('.todo-list__item');

class Store {
  constructor(name){
    this.name = name,
    this.store = localStorage;
  }

  getItem() {
    return JSON.parse(this.store.getItem(this.name));
  }

  setItem(array) {
    this.store.setItem(this.name, JSON.stringify(array));
  }
}

class LiElement {
  constructor(headerInput){
    this.headerInput = headerInput;
  }

  createLiElement(){
    let li = document.createElement('li'),
      value = document.querySelector(`.${this.headerInput}`).value;
    const ID = this.generateID();
    li.setAttribute('class','todo-list__item');
    li.innerHTML = '<div class="todo-list__item-content"> <input type="checkbox" id="todo-list__item-check" class="todo-list__item-check"> <label class="todo-list__item-check-label" for="todo-list__item-check"></label> <span class="todo-list__item-text"></span><button class="todo-list__item-close">x</button></div><input class="edit">';
    li.querySelector('.todo-list__item-text').innerText = value;
    li.querySelector('.todo-list__item-content').setAttribute('id', ID);
    li.querySelector('button').addEventListener('click',this.removeLiElement);
    li.querySelector('label').addEventListener('click',this.checkStatusLi);
    li.querySelector('span').addEventListener('dblclick', this.editLiValue);
    return li;
  }

  removeLiElement(){
    const id = this.closest('.todo-list__item-content').getAttribute('id');
    let localData = listStore.getItem();

    this.closest('.todo-list__item').remove();

    localData.splice(localData.indexOf(localData.find(el=> el.id == id )),1);
    listStore.setItem(localData);

    updateCounter();
    watchToggleBtnState();
    watchClearBtnState();
    watchFooterState();
  }

  checkStatusLi(){
    const id = this.closest('.todo-list__item-content').getAttribute('id');
    let localData = listStore.getItem();

    this.classList.toggle('check');
    localData.find(el=> {if(el.id == id) el.checked = !el.checked} );
    listStore.setItem(localData);

    updateCounter();
    //globalReloadlist(filterStore.getItem());
    watchToggleBtnState();
    watchClearBtnState();
  }

  editLiValue(){
    let input = this.closest('.todo-list__item').querySelector('.edit');
        const id = this.closest('.todo-list__item').querySelector('.todo-list__item-content').getAttribute('id');

    input.classList.add('show');
    input.focus();

    input.addEventListener('change',()=>{
      let localData = listStore.getItem();
      localData.find(el=> {if(el.id == id) el.value = input.value} );
      listStore.setItem(localData);
      //globalReloadlist(filterStore.getItem());
    })
    input.addEventListener('blur',()=>{
      this.classList.remove('show');
    })
  }

  generateID() {
    const id = new Date()
    return id.getTime()
  }

}

class UlElement {
  constructor(input,ul){
    this.input = input,
    this.ul = ul;
  }

  addListItems(){//call after press enter in header input
    if(event.keyCode === 13){
      let headerInput = document.querySelector(`.${this.input}`),
        valueInput = headerInput.value.trim();
  
      if(valueInput != ''){
        const liElem = liElement.createLiElement();
        updateStorage(liElem);
  
        document.querySelector(`.${this.ul}`).appendChild(liElem);
        headerInput.value = '';
  
        updateCounter();
        globalReloadlist(filterStore.getItem());
        watchFooterState();
        watchToggleBtnState();
        watchClearBtnState();
      }
    }
  }

  clearCheckedElements(){//call after press btn clear completed
    const array = listStore.getItem() || [];
    let listItems = document.querySelectorAll(`.${this.ul}__item`);
  
    if(array.length != 0){
      listStore.setItem(array.filter(element=> !element.checked));
    }
  
    listItems.forEach(el=>{
      if(el.querySelector('.todo-list__item-check-label').classList.contains('check')){
        document.querySelector(`.${this.ul}`).removeChild(el);
      };
    })
  
    watchToggleBtnState();
    watchClearBtnState();
    watchFooterState();
  }

  updateElementAll(){//call after press btn all
    const list = document.querySelector(`.${this.ul}`);
    globalReloadlist('all', list);
    //updateFilterslinkClass(event.target);
    updateFilterslinkClass(event.target);
  }
  
  updateElementActive(){//call after press btn active
    const list = document.querySelector(`.${this.ul}`);
    globalReloadlist('active', list);
    updateFilterslinkClass(event.target);
  }
  
  updateElementComplete(){//call after press btn complete
    const list = document.querySelector(`.${this.ul}`);
    globalReloadlist('complete', list);
    updateFilterslinkClass(event.target);
  }

}

function updateFilterslinkClass(target){//call after press btn all,active,complete
  document.querySelectorAll('.filters__item').forEach(el=>{
    el.querySelector('a').classList.remove('check');
  })
  target.classList.add('check');
}

let filterStore = new Store('filter'),
   listStore = new Store('list'),
   liElement = new LiElement('header__input'),
   todoUlElement = new UlElement('header__input','todo-list');

(reloadTodo)();

function updateStorage(elem){// call in func addListItems
  let localData = listStore.getItem() || [];
  const obj = {};
  obj.id = elem.querySelector('.todo-list__item-content').getAttribute('id');
  obj.value = elem.querySelector('.todo-list__item-text').innerText;
  obj.checked = elem.querySelector('.todo-list__item-check + label').classList.contains('check');

  localData.push(obj);
  listStore.setItem(localData);
}


function reloadTodo(){//call in func globalReloadlist and after reloading page
  let StorageArray = listStore.getItem() || [];
  const filtrPos = filterStore.getItem() != null ? filterStore.getItem() : 'all';
  document.querySelector(`.${filtrPos}`).classList.add('check');

  if(StorageArray.length != 0){
    filtrPos == 'active' ? renderFilteredList(StorageArray.filter(el=> el.checked == false)) : 
    filtrPos == 'complete' ? renderFilteredList(StorageArray.filter(el=> el.checked == true)) : 
    renderFilteredList(StorageArray);

  }

  updateCounter();
  watchFooterState();
  watchToggleBtnState();
  watchClearBtnState();
}

function renderFilteredList(StorageArray){//call in func reloadTodo
  let fragment = document.createDocumentFragment();
  StorageArray.forEach(el=>{
      let lielem = liElement.createLiElement();
      lielem.querySelector('.todo-list__item-content').setAttribute('id', el.id);
      lielem.querySelector('.todo-list__item-text').innerText = el.value;
      if(el.checked) lielem.querySelector('.todo-list__item-check + label').classList.add('check');
      fragment.appendChild(lielem);
    });

    document.querySelector('.todo-list').appendChild(fragment);
}

function watchToggleBtnState(){//util
  const array = listStore.getItem() || [];
  let toggleAllLabel = document.querySelector('.toggle-all-label'),
    toggleAll = document.querySelector('.toggle-all');

  array.every(el=> el.checked == true) ? toggleAll.classList.add('checked') : toggleAll.classList.remove('checked');
  array.length == 0 ? toggleAllLabel.classList.add('hide') : toggleAllLabel.classList.remove('hide');
}

function watchClearBtnState(){//util
  const array = listStore.getItem() || [];
  let clearBtn = document.querySelector('.clear-btn');
  array.some(el=> el.checked == true) ? clearBtn.classList.add('show') : clearBtn.classList.remove('show');
}

function watchFooterState(){//util
  const array = listStore.getItem() || [];
  let footer = document.querySelector('.footer');
  array.length == 0 ? footer.classList.add('hide'): footer.classList.remove('hide');
}


function updateCounter(){//util
  const array = listStore.getItem() || [];
  let counter = 0;
  if(array.length != 0){

    array.forEach(el => {
      if(!el.checked) counter++;
    });

  }
  document.querySelector('.todo-count strong').innerText = counter;
}

function removeAllChildren(elem) {// call in func globalReloadlist
  while (elem.lastChild) {
    elem.removeChild(elem.lastChild);
  }
}

function addStatusLi(id){//call in func checkedAllItems
  let localData = listStore.getItem();
  localData.find(el=> {if(el.id == id) el.checked = true} );
  listStore.setItem(localData);
}

function removeStatusLi(id){//call in func removeCheckedAllItems
  let localData = listStore.getItem();
  localData.find(el=> {if(el.id == id) el.checked = false} );
  listStore.setItem(localData);
}

function checkedAllItems(elements){//call in func toggleElements
  elements.forEach(el=>{
    if(!el.classList.contains('check')) el.classList.add('check');
    addStatusLi(el.closest('.todo-list__item-content').getAttribute('id'));
  })
}

function removeCheckedAllItems(elements){//call in func toggleElements
  elements.forEach(el=> {
    el.classList.remove('check');
    removeStatusLi(el.closest('.todo-list__item-content').getAttribute('id'));
  })
}


function globalReloadlist(filterFlag){//
  let list = document.querySelector('.todo-list');

  filterStore.setItem(filterFlag);
  removeAllChildren(list);
  reloadTodo();
}

function toggleElements(){//call after press btn toggle
  let elementsNode = document.querySelectorAll('.todo-list__item-check + label'),
  elements = Array.prototype.slice.call(elementsNode);
  elements.every(el=> el.classList.contains('check')) ? removeCheckedAllItems(elements) : checkedAllItems(elements);

  updateCounter();
  watchToggleBtnState();
  watchClearBtnState();
}

document.querySelector('.header__input').addEventListener('keydown',todoUlElement.addListItems.bind(todoUlElement));
document.querySelector('.toggle-all-label').addEventListener('click',toggleElements);
document.querySelector('.clear-btn').addEventListener('click', todoUlElement.clearCheckedElements.bind(todoUlElement));
document.querySelector('.all').addEventListener('click', todoUlElement.updateElementAll.bind(todoUlElement));
document.querySelector('.active').addEventListener('click', todoUlElement.updateElementActive.bind(todoUlElement));
document.querySelector('.complete').addEventListener('click', todoUlElement.updateElementComplete.bind(todoUlElement));