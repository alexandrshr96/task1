const li = document.querySelector('.todo-list__item');

const store = {
  store: localStorage,

  getItem: function(name) {
    // get item
    return JSON.parse(this.store.getItem(name));
  },

  setItem: function(name,mas) {
    // get item
    this.store.setItem(name, JSON.stringify(mas));
  }
};

(reloadTodo1)();

function generateID() {
  const id = new Date()
  return id.getTime()
}


function createLiElement(){
  let li = document.createElement('li');
  const ID = generateID();

  li.setAttribute('class','todo-list__item');

  li.innerHTML = '<div class="todo-list__item-content"> <input type="checkbox" id="todo-list__item-check" class="todo-list__item-check"> <label class="todo-list__item-check-label" for="todo-list__item-check"></label> <span class="todo-list__item-text"></span><button class="todo-list__item-close">x</button></div><input class="edit">';
  li.querySelector('.todo-list__item-text').innerText = document.querySelector('.header__input').value;
  li.querySelector('.todo-list__item-content').setAttribute('id', ID);

  li.querySelector('button').addEventListener('click',(e)=>{
    const id = e.target.closest('.todo-list__item-content').getAttribute('id');
    updateLocalArray(id);
    e.target.closest('.todo-list__item').remove();

    updateCounter();
    watchToggleBtnState();
    watchClearBtnState();
    watchFooterState();
  });

  li.querySelector('label').addEventListener('click',(e)=>{
    const id = e.target.closest('.todo-list__item-content').getAttribute('id');
    updateStatusLi(id);
    e.target.classList.toggle('check');

    updateCounter();
    globalReloadlist(store.getItem('footer-filter'));
    watchToggleBtnState();
  });

  li.querySelector('span').addEventListener('dblclick',(e)=>{
      let input = e.target.closest('.todo-list__item').querySelector('.edit');
      const id = e.target.closest('.todo-list__item').querySelector('.todo-list__item-content').getAttribute('id');

      input.classList.add('show');
      input.focus();

      input.addEventListener('change',(e)=>{
        updateLiValue(id, input.value);
        globalReloadlist(store.getItem('footer-filter'));
      })
      input.addEventListener('blur',(e)=>{
        e.target.classList.remove('show');
      })
  });
  return li;

}

function editElement(){
  
}


function createObjForStorage(elem){
  const obj = {};
  obj.id = elem.querySelector('.todo-list__item-content').getAttribute('id');
  obj.value = elem.querySelector('.todo-list__item-text').innerText;
  obj.checked = elem.querySelector('.todo-list__item-check + label').classList.contains('check');
  return obj;
}

function addObjtoStorage(obj){
  let localData = store.getItem('list') || [];
  localData.push(obj);
  store.setItem('list',localData);
}

function updateStatusLi(id){
  let localData = store.getItem('list');
  localData.find(el=> {if(el.id == id) el.checked = !el.checked} );
  store.setItem('list',localData);
}

function updateLiValue(id, newValue){
  let localData = store.getItem('list');
  localData.find(el=> {if(el.id == id) el.value = newValue} );
  store.setItem('list',localData);
}

function updateLocalArray(id){
  let localData = store.getItem('list');
  localData.splice(localData.indexOf(localData.find(el=> el.id == id )),1);
  store.setItem('list',localData);
}


function reloadTodo1(){
  const mas = store.getItem('list') || [];
  const filtrPos = store.getItem('footer-filter');
  document.querySelector(`.${filtrPos}`).classList.add('check');
  if(mas.length != 0){
    filtrPos == 'active' ? createFilteredList(mas.filter(el=> el.checked == false)) : 
    filtrPos == 'complete' ? createFilteredList(mas.filter(el=> el.checked == true)) : 
    createFilteredList(mas);

  }

  updateCounter();
  watchFooterState();
  watchToggleBtnState();
  watchClearBtnState();
}

function watchToggleBtnState(){
  const mas = store.getItem('list') || [];
  let toggleAllLabel = document.querySelector('.toggle-all-label'),
    toggleAll = document.querySelector('.toggle-all');

  mas.every(el=> el.checked == true) ? toggleAll.classList.add('checked') : toggleAll.classList.remove('checked');
  mas.length == 0 ? toggleAllLabel.classList.add('hide') : toggleAllLabel.classList.remove('hide');
}

function watchClearBtnState(){
  const mas = store.getItem('list') || [];
  mas.some(el=> el.checked == true) ? document.querySelector('.clear-btn').classList.add('show') : document.querySelector('.clear-btn').classList.remove('show');
}
////----------------------
function watchFooterState(){
  const mas = store.getItem('list') || [];
  let footer = document.querySelector('.footer');
  mas.length == 0 ? footer.classList.add('hide'): footer.classList.remove('hide');
}


function createFilteredList(mas){//rename 
  let fragment = document.createDocumentFragment();
    mas.forEach(el=>{
      let lielem = createLiElement();
      lielem.querySelector('.todo-list__item-content').setAttribute('id', el.id);
      lielem.querySelector('.todo-list__item-text').innerText = el.value;
      if(el.checked) lielem.querySelector('.todo-list__item-check + label').classList.add('check');
      fragment.appendChild(lielem);
    });

    document.querySelector('.todo-list').appendChild(fragment);
}

function updateCounter(){
  const mas = store.getItem('list') || [];
  let counter = 0;
  if(mas.length != 0){

    mas.forEach(el => {
      if(!el.checked) counter++;
    });

  }
  document.querySelector('.todo-count strong').innerText = counter;
}


function clearCompleted(){
  const mas = store.getItem('list') || [];
  if(mas.length != 0){
    store.setItem('list',mas.filter(element=> !element.checked));
  }
}

function removeChildren() {
  let listItems = document.querySelectorAll('.todo-list__item');
  listItems.forEach(el=>{
    if(el.querySelector('.todo-list__item-check-label').classList.contains('check')){
      document.querySelector('.todo-list').removeChild(el);
    };
  })
}

function removeAllChildren(elem) {
  while (elem.lastChild) {
    elem.removeChild(elem.lastChild);
  }
}

function addStatusLi(id){
  let localData = store.getItem('list');
  localData.find(el=> {if(el.id == id) el.checked = true} );
  store.setItem('list',localData);
}

function removeStatusLi(id){
  let localData = store.getItem('list');
  localData.find(el=> {if(el.id == id) el.checked = false} );
  store.setItem('list',localData);
}

function checkedAllItems(elements){
  elements.forEach(el=>{
    if(!el.classList.contains('check')) el.classList.add('check');
    //console.log(el.closest('.todo-list__item-content').getAttribute('id'));
    addStatusLi(el.closest('.todo-list__item-content').getAttribute('id'));
  })
}

function removeCheckedAllItems(elements){
  elements.forEach(el=> {
    el.classList.remove('check');
    removeStatusLi(el.closest('.todo-list__item-content').getAttribute('id'));
  })
}

function hideContent(){
  document.querySelector('.todo-list').hasChildNodes() ? document.querySelector('.footer').classList.remove('hide') :
  document.querySelector('.footer').classList.add('hide');
}


function setFooterFlag(item){
  store.setItem('footer-filter', item);
}

function updateFilterslinkClass(target){
  document.querySelectorAll('.filters__item').forEach(el=>{
    el.querySelector('a').classList.remove('check');
  })
  target.classList.add('check');
}

function globalReloadlist(filterFlag){
  let list = document.querySelector('.todo-list');

  setFooterFlag(filterFlag);
  removeAllChildren(list);
  reloadTodo1();
}

function addListItems(){
  let headerInput = document.querySelector('.header__input');
  const liElem = createLiElement();
  let obj = createObjForStorage(liElem);

  addObjtoStorage(obj);
  document.querySelector('.todo-list').appendChild(liElem);
  headerInput.value = '';

  updateCounter();
  globalReloadlist(store.getItem('footer-filter'));
  watchFooterState();
  watchToggleBtnState();
  watchClearBtnState();
}

function toggleElements(){
  let elementsNode = document.querySelectorAll('.todo-list__item-check + label'),
  elements = Array.prototype.slice.call(elementsNode);
  elements.every(el=> el.classList.contains('check')) ? removeCheckedAllItems(elements) : checkedAllItems(elements);

  updateCounter();
  watchToggleBtnState();
  watchClearBtnState();
}

document.querySelector('.header__input').addEventListener('change',addListItems);
document.querySelector('.toggle-all-label').addEventListener('click',toggleElements);

document.querySelector('.footer').addEventListener('click',(e)=>{
  const target = e.target;
  let list = document.querySelector('.todo-list');
  if(target.classList.contains('clear-btn')){
    clearCompleted();
    removeChildren();

    watchToggleBtnState();
    watchClearBtnState();
    watchFooterState();
  }else if(target.classList.contains('all')){
    globalReloadlist('all', list);
    updateFilterslinkClass(target);
  }else if(target.classList.contains('active')){
    globalReloadlist('active', list);
    updateFilterslinkClass(target);
  }else if(target.classList.contains('complete')){
    globalReloadlist('complete', list);
    updateFilterslinkClass(target);
  }
})
