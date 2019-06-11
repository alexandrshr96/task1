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
  constructor(listStore, filterStore){
    this.listStore = listStore,
    this.filterStore = filterStore;
  }

  createLiElement(){
    let li = document.createElement('li'),
      value = document.querySelector('.header__input').value;
    const ID = this.generateID();
    li.setAttribute('class','todo-list__item');
    li.innerHTML = '<div class="todo-list__item-content"> <input type="checkbox" id="todo-list__item-check" class="todo-list__item-check"> <label class="todo-list__item-check-label" for="todo-list__item-check"></label> <span class="todo-list__item-text"></span><button class="todo-list__item-close">x</button></div><input class="edit">';
    li.querySelector('.todo-list__item-text').innerText = value;
    li.querySelector('.todo-list__item-content').setAttribute('id', ID);
    li.querySelector('button').addEventListener('click',this.removeLiElement.bind(this));
    li.querySelector('label').addEventListener('click',this.checkStatusLi.bind(this));
    li.querySelector('span').addEventListener('dblclick', this.editLiValue.bind(this));
    return li;
  }

  removeLiElement(){
    const id = event.target.closest('.todo-list__item-content').getAttribute('id');

    event.target.closest('.todo-list__item').remove();

    this.removeLiElementInStorage(id);

    updateCounter();
    watchToggleBtnState();
    watchClearBtnState();
    watchFooterState();
  }

  removeLiElementInStorage(id) {
    let localData = this.listStore.getItem();

    localData.splice(localData.indexOf(localData.find(el=> el.id == id )),1);
    this.listStore.setItem(localData);
  }

  checkStatusLi(){
    const id = event.target.closest('.todo-list__item-content').getAttribute('id');

    event.target.classList.toggle('check');

    this.updateStatusLiInStorage(id);

    updateCounter();
    //globalReloadlist(this.filterStore.getItem());
    watchToggleBtnState();
    watchClearBtnState();
  }

  updateStatusLiInStorage(id){
    let localData = this.listStore.getItem();
    localData.find(el=> {if(el.id == id) el.checked = !el.checked} );
    this.listStore.setItem(localData);
  }

  editLiValue(){
    let input = event.target.closest('.todo-list__item').querySelector('.edit');
    const id = event.target.closest('.todo-list__item').querySelector('.todo-list__item-content').getAttribute('id');

    input.classList.add('show');
    input.focus();

    input.addEventListener('change',()=>{
      if(input.value.trim() != ''){
        let localData = this.listStore.getItem();
        localData.find(el=> {if(el.id == id) el.value = input.value.trim()} );
        this.listStore.setItem(localData);
        globalReloadlist(this.filterStore.getItem());
      }
    })
    input.addEventListener('blur',()=>{
      event.target.classList.remove('show');
    })
  }

  toggleElements(){//call after press btn toggle
    let elementsNode = document.querySelectorAll('.todo-list__item-check + label'),
    elements = Array.prototype.slice.call(elementsNode);
    elements.every(el=> el.classList.contains('check')) ? this.removeCheckedAllItems(elements) : this.checkedAllItems(elements);
  
    updateCounter();
    watchToggleBtnState();
    watchClearBtnState();
  }

  checkedAllItems(elements){//call in func toggleElements
    elements.forEach(el=>{
      if(!el.classList.contains('check')) el.classList.add('check');
      this.addStatusLi(el.closest('.todo-list__item-content').getAttribute('id'));
    })
  }

  removeCheckedAllItems(elements){//call in func toggleElements
    elements.forEach(el=> {
      el.classList.remove('check');
      this.removeStatusLi(el.closest('.todo-list__item-content').getAttribute('id'));
    })
  }

  addStatusLi(id){//call in func checkedAllItems
    let localData = this.listStore.getItem();
    localData.find(el=> {if(el.id == id) el.checked = true} );
    this.listStore.setItem(localData);
  }

  removeStatusLi(id){//call in func removeCheckedAllItems
    let localData = this.listStore.getItem();
    localData.find(el=> {if(el.id == id) el.checked = false} );
    this.listStore.setItem(localData);
  }

  generateID() {
    const id = new Date()
    return id.getTime()
  }

}

class UlElement {
  constructor(liElement, listStore, filterStore){
    this.liElement = liElement,
    this.listStore = listStore,
    this.filterStore = filterStore;
  }

  addListItems(){//call after press enter in header input
    if(event.keyCode === 13){
      let headerInput = document.querySelector('.header__input'),
        valueInput = headerInput.value.trim();
  
      if(valueInput != ''){
        const liElem = this.liElement.createLiElement();
        this.addToStorage(liElem);
  
        document.querySelector('.todo-list').appendChild(liElem);
        headerInput.value = '';
  
        updateCounter();
        //globalReloadlist(this.filterStore.getItem());
        watchFooterState();
        watchToggleBtnState();
        watchClearBtnState();
      }
    }
  }

  addToStorage(elem){// call in func addListItems
    const localData = this.listStore.getItem() || [],
     obj = {};
    obj.id = elem.querySelector('.todo-list__item-content').getAttribute('id');
    obj.value = elem.querySelector('.todo-list__item-text').innerText;
    obj.checked = elem.querySelector('.todo-list__item-check + label').classList.contains('check');
  
    localData.push(obj);
    this.listStore.setItem(localData);
  }

  clearCheckedElements(){//call after press btn clear completed
    const array = this.listStore.getItem() || [];
    let listItems = document.querySelectorAll('.todo-list__item');
  
    if(array.length != 0){
      this.listStore.setItem(array.filter(element=> !element.checked));
    }
  
    listItems.forEach(el=>{
      if(el.querySelector('.todo-list__item-check-label').classList.contains('check')){
        document.querySelector('.todo-list').removeChild(el);
      };
    })
  
    watchToggleBtnState();
    watchClearBtnState();
    watchFooterState();
  }

  updateElementFilter(name){
    const list = document.querySelector('.todo-list');
    globalReloadlist(name, list);
    this.updateFilterslinkClass(event.target);
  }

  updateFilterslinkClass(target){//call in func after press btn all,active,complete
    document.querySelectorAll('.filters__item').forEach(el=>{
      el.querySelector('a').classList.remove('check');
    })
    target.classList.add('check');
  }

}

class Todo{
  constructor( filter, list){
    this.filterStore = new Store(filter),
    this.listStore = new Store(list),
    this.liElement = new LiElement(this.listStore,this.filterStore);
    this.ulElement = new UlElement(this.liElement,this.listStore,this.filterStore);
  }
}

let todoApp = new Todo('filter','list'),
    todoList = todoApp.ulElement,
    todoItem = todoApp.liElement;

// let filterStore = new Store('filter'),
//    listStore = new Store('list'),
//    todoLiElement = new LiElement(),
//    todoUlElement = new UlElement(todoLiElement);

(reloadTodo)();


function reloadTodo(){//call in func globalReloadlist and after reloading page
  let StorageArray = todoApp.listStore.getItem() || [];
  const filtrPos = todoApp.filterStore.getItem() != null ? todoApp.filterStore.getItem() : 'all';
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
      let lielem = todoItem.createLiElement();//rework
      lielem.querySelector('.todo-list__item-content').setAttribute('id', el.id);
      lielem.querySelector('.todo-list__item-text').innerText = el.value;
      if(el.checked) lielem.querySelector('.todo-list__item-check + label').classList.add('check');
      fragment.appendChild(lielem);
    });

    document.querySelector('.todo-list').appendChild(fragment);
}

function watchToggleBtnState(){//util
  const array = todoApp.listStore.getItem() || [];
  let toggleAllLabel = document.querySelector('.toggle-all-label'),
    toggleAll = document.querySelector('.toggle-all');

  array.every(el=> el.checked == true) ? toggleAll.classList.add('checked') : toggleAll.classList.remove('checked');
  array.length == 0 ? toggleAllLabel.classList.add('hide') : toggleAllLabel.classList.remove('hide');
}

function watchClearBtnState(){//util
  const array = todoApp.listStore.getItem() || [];
  let clearBtn = document.querySelector('.clear-btn');
  array.some(el=> el.checked == true) ? clearBtn.classList.add('show') : clearBtn.classList.remove('show');
}

function watchFooterState(){//util
  const array = todoApp.listStore.getItem() || [];
  let footer = document.querySelector('.footer');
  array.length == 0 ? footer.classList.add('hide'): footer.classList.remove('hide');
}


function updateCounter(){//util
  const array = todoApp.listStore.getItem() || [];
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


function globalReloadlist(filterFlag){//
  let list = document.querySelector('.todo-list');

  todoApp.filterStore.setItem(filterFlag);
  removeAllChildren(list);
  reloadTodo();
}



document.querySelector('.header__input').addEventListener('keydown',todoList.addListItems.bind(todoList));
document.querySelector('.toggle-all-label').addEventListener('click',todoItem.toggleElements.bind(todoItem));
document.querySelector('.clear-btn').addEventListener('click', todoList.clearCheckedElements.bind(todoList));
document.querySelector('.all').addEventListener('click', todoList.updateElementFilter.bind(todoList,'all'));
document.querySelector('.active').addEventListener('click', todoList.updateElementFilter.bind(todoList,'active'));
document.querySelector('.complete').addEventListener('click', todoList.updateElementFilter.bind(todoList,'complete'));