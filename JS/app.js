let model = {
	root: null,
	currentHead: null
};

function init(){
	model.root = getFromLs('root');
	//we need to add back the parent-child relation discarded during the stringyfication done during the peristence
	addParent(model.root, model.root.children);
	if(model.root === null) {
		model.root = {'value': null, 'children': [], 'parent': null}
		setToLs('root', model.root);
	}
	
	model.currentHead = model.root;
	
	// initialize UI
	fillUI(model.root);
	registerHandlers();
}

function fillUI(head){
	let box = document.getElementById('box');
	// Clean the UI
	while(box.firstChild){
		box.removeChild(box.firstChild);
	}
	
	let todoItems = head.children;
	todoItems.forEach((item) => {
		let divElement = document.createElement('div');
		divElement.className = 'item';
		divElement.todoItem = item;
		//create delete button
		let deleteButton = document.createElement('button');
		deleteButton.className = 'delete-btn';
		deleteButton.innerHTML = 'x';
		deleteButton.addEventListener('click', (event) =>{
			deleteTodo(event.target.parentNode.todoItem);
		});
		
		//create span 
		let todoText = document.createElement('span');
		todoText.innerHTML = item.value;
		
		divElement.appendChild(todoText);
		divElement.appendChild(deleteButton);

		box.appendChild(divElement);
	});
}

function registerHandlers(){
	let box = document.getElementById('box');
	
	box.addEventListener("dblclick", event => {
		if(event.target.className === 'item')
		{
			model.currentHead = event.target.todoItem;
			fillUI(model.currentHead);
		}
	});
}

function openModal(){
	let modal = document.getElementById("myModal");
	modal.style.display = "block";
}

function closeModal(){
	let modal = document.getElementById("myModal");
	modal.style.display = "none";
}

function addTodo(event){
	let todoValue = document.querySelector("textarea").value;
	document.getElementById("todoForm").reset();
	let currentHead = model.currentHead;
	let todoItem = {'value': todoValue, 'children': [], 'parent': currentHead};
	currentHead.children.push(todoItem);
	fillUI(currentHead);
	event.preventDefault();
	model.currentHead = currentHead;
	setToLs('root', model.root);
	closeModal();
}

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key, value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return;
      }
      seen.add(value);
    }
    return value;
  };
};

function getFromLs(key){
	return JSON.parse(window.localStorage.getItem(key));
}

function setToLs(key, value){
	window.localStorage.setItem(key, JSON.stringify(value, getCircularReplacer()));
}

function gotoPrevious(){
	if(model.currentHead.parent){
		model.currentHead = model.currentHead.parent;
		fillUI(model.currentHead);
	}
	else{
		alert("Invalid Action!");
	}
}

function deleteTodo(todoItem){
	model.currentHead.children = model.currentHead.children.filter(element => element!==todoItem);
	setToLs('root', model.root);
	fillUI(model.currentHead);
}

function addParent(parentNode, children)
{
	if(Array.isArray(children)){
		children.forEach(child => {
			child.parent = parentNode;
			addParent(child, child.children);
		});
	}
}
//Initialize the App
init();