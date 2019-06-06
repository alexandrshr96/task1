const li = document.querySelector('.todo-list__item');

(reloadTodo)();

function createLiElement(){
  return li.cloneNode(true);
}

function insertLi(){
  let liElem = createLiElement();
  liElem.querySelector('.todo-list__item-text').innerText = document.querySelector('.header__input').value;
  liElem.querySelector('.todo-list__item-content').setAttribute('id', Math.round(Math.random() * 100000));
  return liElem;
}

function setLocalStorage(mas){
  localStorage.setItem('list', JSON.stringify(mas));
}

function getLocalStorage(){
  return JSON.parse(localStorage.getItem('list'));
}

function createObjForStorage(elem){
  const obj = {};
  obj.id = elem.querySelector('.todo-list__item-content').getAttribute('id');
  obj.value = elem.querySelector('.todo-list__item-text').innerText;
  obj.checked = elem.querySelector('.todo-list__item-check + label').classList.contains('check');
  return obj;
}

function addObjtoStorage(obj){
  let localData = getLocalStorage() || [];
  localData.push(obj);
  setLocalStorage(localData);
}

function updateStatusLi(id){
  let localData = getLocalStorage();
  localData.find(el=> {if(el.id == id) el.checked = !el.checked} );
  setLocalStorage(localData);
}

function updateLocalArray(id){
  let localData = getLocalStorage();
  localData.splice(localData.indexOf(localData.find(el=> el.id == id )),1);
  setLocalStorage(localData);
}

function reloadTodo(){
  const mas = getLocalStorage() || [];
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
}


function updateCounter(){
  const mas = getLocalStorage() || [];
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
  const mas = getLocalStorage() || [];
  if(mas.length != 0){
    setLocalStorage(mas.filter(element=> !element.checked));
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

function addStatusLi(id){
  let localData = getLocalStorage();
  localData.find(el=> {if(el.id == id) el.checked = true} );
  setLocalStorage(localData);
}

function removeStatusLi(id){
  let localData = getLocalStorage();
  localData.find(el=> {if(el.id == id) el.checked = false} );
  setLocalStorage(localData);
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

document.querySelector('.header__input').addEventListener('change',(e)=>{
  const liElem = insertLi();
  let obj = createObjForStorage(liElem);
  addObjtoStorage(obj);
  document.querySelector('.todo-list').appendChild(liElem);
  document.querySelector('.header__input').value = '';
  updateCounter();
})


document.querySelector('.main').addEventListener('click',(e)=>{
  const target = e.target;

  if(target.className == 'todo-list__item-check-label' || target.className == 'todo-list__item-check-label check'){
    const id = target.closest('.todo-list__item-content').getAttribute('id');
    updateStatusLi(id);
    target.classList.toggle('check');
    updateCounter();

  }else if(target.className == 'todo-list__item-close'){
    const id = target.closest('.todo-list__item-content').getAttribute('id');
    updateLocalArray(id);
    target.closest('.todo-list__item').remove();
    updateCounter();
  }else if(target.className == 'toggle-all-label'){
    let elementsNode = document.querySelectorAll('.todo-list__item-check + label'),
    elements = Array.prototype.slice.call(elementsNode);
    console.log(elements);
    
    elements.every(el=> el.classList.contains('check')) ? removeCheckedAllItems(elements) : checkedAllItems(elements);
    updateCounter();
  }
})

document.querySelector('.footer').addEventListener('click',(e)=>{
  const target = e.target;

  if(target.className == 'clear-btn'){
    clearCompleted();
    removeChildren();
  }
})

