let model = {
	root: null,
	currentHead: null
};

function init(){
	model.root = getFromLs('root');
	
	if(model.root === null) {
		model.root = {'value': null, 'children': [], 'parent': {}}
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
		divElement.textContent = item.value;
		box.appendChild(divElement);
	});
}

function registerHandlers(){
	let box = document.getElementById('box');
	
	box.addEventListener("click", event => {
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

function setToLs(key, value)
{
	window.localStorage.setItem(key, JSON.stringify(value, getCircularReplacer()));
}

//Initialize the App
init();