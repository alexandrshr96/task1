const li = document.querySelector('.todo-list__item');

(reloadTodo1)();

/*function createLiElement(){
  return li.cloneNode(true);
}*/

function createLiElement(){
  let li = document.createElement('li'),
    div = document.createElement('div'),
    input = document.createElement('input'),
    input1 = document.createElement('input'),
    label = document.createElement('label'),
    span = document.createElement('span'),
    button = document.createElement('button');

  li.setAttribute('class','todo-list__item');
  div.setAttribute('class', 'todo-list__item-content');
  input.setAttribute('type', 'checkbox');
  input.setAttribute('id', 'todo-list__item-check');
  input.setAttribute('class', 'todo-list__item-check');
  input1.setAttribute('class', 'edit');
  label.setAttribute('class','todo-list__item-check-label');
  label.setAttribute('for', 'todo-list__item-check');
  span.setAttribute('class', 'todo-list__item-text');
  button.setAttribute('class', 'todo-list__item-close');
  button.innerText = 'x';

  div.appendChild(input);
  div.appendChild(label);
  div.appendChild(span);
  div.appendChild(button);

  li.appendChild(div);
  li.appendChild(input1);

  return li;

}

function insertLi(){
  let liElem = createLiElement();
  liElem.querySelector('.todo-list__item-text').innerText = document.querySelector('.header__input').value;
  liElem.querySelector('.todo-list__item-content').setAttribute('id', Math.round(Math.random() * 100000));
  return liElem;
}

function setLocalStorage(name, mas){
  localStorage.setItem(name, JSON.stringify(mas));
}

function getLocalStorage(name){
  return JSON.parse(localStorage.getItem(name));
}

function createObjForStorage(elem){
  const obj = {};
  obj.id = elem.querySelector('.todo-list__item-content').getAttribute('id');
  obj.value = elem.querySelector('.todo-list__item-text').innerText;
  obj.checked = elem.querySelector('.todo-list__item-check + label').classList.contains('check');
  return obj;
}

function addObjtoStorage(obj){
  let localData = getLocalStorage('list') || [];
  localData.push(obj);
  setLocalStorage('list',localData);
}

function updateStatusLi(id){
  let localData = getLocalStorage('list');
  localData.find(el=> {if(el.id == id) el.checked = !el.checked} );
  setLocalStorage('list',localData);
}

function updateLiValue(id, newValue){
  let localData = getLocalStorage('list');
  localData.find(el=> {if(el.id == id) el.value = newValue} );
  setLocalStorage('list',localData);
}

function updateLocalArray(id){
  let localData = getLocalStorage('list');
  localData.splice(localData.indexOf(localData.find(el=> el.id == id )),1);
  setLocalStorage('list',localData);
}

/*function reloadTodo(filtrPos){
  const mas = getLocalStorage('list') || [];

  if(mas.length != 0){
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
  updateCounter();
}*/

function reloadTodo1(){
  const mas = getLocalStorage('list') || [];
  const filtrPos = getLocalStorage('footer-filter');
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
  const mas = getLocalStorage('list') || [];
  let toggleAllLabel = document.querySelector('.toggle-all-label'),
    toggleAll = document.querySelector('.toggle-all');

  mas.every(el=> el.checked == true) ? toggleAll.classList.add('checked') : toggleAll.classList.remove('checked');
  mas.length == 0 ? toggleAllLabel.classList.add('hide') : toggleAllLabel.classList.remove('hide');
}

function watchClearBtnState(){
  const mas = getLocalStorage('list') || [];
  mas.some(el=> el.checked == true) ? document.querySelector('.clear-btn').classList.add('show') : document.querySelector('.clear-btn').classList.remove('show');
}
////----------------------
function watchFooterState(){
  const mas = getLocalStorage('list') || [];
  let footer = document.querySelector('.footer');
  mas.length == 0 ? footer.classList.add('hide'): footer.classList.remove('hide');
}


function createFilteredList(mas){
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
  const mas = getLocalStorage('list') || [];
  let counter = 0;
  if(mas.length != 0){

    mas.forEach(el => {
      if(!el.checked) counter++;
    });

  }
  document.querySelector('.todo-count strong').innerText = counter;
}

/*document.querySelector('.header__input').addEventListener('keypress',(e)=>{
  if(e.keyCode == 13 && document.querySelector('.header__input').value == /\s/g){
    document.querySelector('.todo-list').appendChild(insertLi());
    document.querySelector('.header__input').value = '';
  }
})*/

function clearCompleted(){
  const mas = getLocalStorage('list') || [];
  if(mas.length != 0){
    setLocalStorage('list',mas.filter(element=> !element.checked));
  }
  //setLocalStorage(mas);
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
  let localData = getLocalStorage('list');
  localData.find(el=> {if(el.id == id) el.checked = true} );
  setLocalStorage('list',localData);
}

function removeStatusLi(id){
  let localData = getLocalStorage('list');
  localData.find(el=> {if(el.id == id) el.checked = false} );
  setLocalStorage('list',localData);
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

//-------------
/*function checkedAllItems(mas){
  mas.forEach(el=>{
    if(!el.checked) el.checked = true;
    //console.log(el.closest('.todo-list__item-content').getAttribute('id'));
    addStatusLi(el.closest('.todo-list__item-content').getAttribute('id'));
  })
}

function removeCheckedAllItems(elements){
  elements.forEach(el=> {
    el.classList.remove('check');
    removeStatusLi(el.closest('.todo-list__item-content').getAttribute('id'));
  })
}*/
//========

function hideContent(){
  document.querySelector('.todo-list').hasChildNodes() ? document.querySelector('.footer').classList.remove('hide') :
  document.querySelector('.footer').classList.add('hide');
}


function setFooterFlag(item){
  setLocalStorage('footer-filter', item);
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

document.querySelector('.header__input').addEventListener('change',(e)=>{
  const liElem = insertLi();
  let obj = createObjForStorage(liElem);
  addObjtoStorage(obj);

  document.querySelector('.todo-list').appendChild(liElem);
  e.target.value = '';

  updateCounter();
  globalReloadlist(getLocalStorage('footer-filter'));
  watchFooterState();
  watchToggleBtnState();
  watchClearBtnState();
})

/*function toglleAll(){
  let mas = getLocalStorage('list') || [];
  mas.every(el=> el.checked == true) ? removeCheckedAllItems(elements) : checkedAllItems(elements);
}*/

document.querySelector('.main').addEventListener('click',(e)=>{
  const target = e.target;

  if(target.className == 'todo-list__item-check-label' || target.className == 'todo-list__item-check-label check'){
    const id = target.closest('.todo-list__item-content').getAttribute('id');
    updateStatusLi(id);
    target.classList.toggle('check');

    updateCounter();
    globalReloadlist(getLocalStorage('footer-filter'));
    watchToggleBtnState();
  }else if(target.className == 'todo-list__item-close'){
    const id = target.closest('.todo-list__item-content').getAttribute('id');
    updateLocalArray(id);
    target.closest('.todo-list__item').remove();

    updateCounter();
    watchToggleBtnState();
    watchClearBtnState();
    watchFooterState();
  }else if(target.className == 'toggle-all-label'){
    let elementsNode = document.querySelectorAll('.todo-list__item-check + label'),
    elements = Array.prototype.slice.call(elementsNode);
    elements.every(el=> el.classList.contains('check')) ? removeCheckedAllItems(elements) : checkedAllItems(elements);
   
    updateCounter();
    watchToggleBtnState();
    watchClearBtnState();
  }
})

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



document.querySelector('.todo').addEventListener('dblclick',(e)=>{
  const target = e.target;
 
  if(target.className == 'todo-list__item-text'){
    let input = target.closest('.todo-list__item').querySelector('.edit');
    const id = target.closest('.todo-list__item').querySelector('.todo-list__item-content').getAttribute('id');
    console.log('dblclick');
    input.classList.add('show');
    input.focus();
    input.addEventListener('change',(e)=>{
      //console.log(input.value);
      updateLiValue(id, input.value);
      globalReloadlist(getLocalStorage('footer-filter'));
    })
    input.addEventListener('blur',(e)=>{
      e.target.classList.remove('show');
    })
  }
  
})


