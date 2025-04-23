let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const months = {
	'01': 'Jan',
	'02': 'Feb',
	'03': 'Mar',
	'04': 'Apr',
	'05': 'May',
	'06': 'Jun',
	'07': 'Jul',
	'08': 'Aug',
	'09': 'Sep',
	10: 'Oct',
	11: 'Nov',
	12: 'Dec',
};

let timeoutId;
let taskToDelete = null;

function find(target) {
	return document.querySelector(target);
}
async function showTasks() {
	let tasksHtml = '';
	const taskContainer = find('#taskContainer');
	const sortedTasks = await sortTasks(['dueDate', 'completed', 'starred']);

	sortedTasks.forEach((task) => {
		const year = task.dueDate.substring(0, 4);
		const month = months[task.dueDate.substring(5, 7)];
		let date = task.dueDate.substring(8, 10);

		if (date.substring(0, 1) === '0') {
			date = date.substring(1, 2);
		}

		const html = `<div class="overflow-hidden border border-2 border-black rounded-lg w-full px-[15px] py-[30px] flex gap-4" id="task-${task.id}">


                                                  <div class="flex-1 flex info gap-4 mx-4 relative">
                                                            <input type="checkbox" onchange="toggleTask(${task.id})" class="z-10 checkbox checkbox-neutral checkbox-xl" ${task.completed ? 'checked' : ''} />

                                                            <div class="flex-1 mt-[-5px] z-10">
                                                                      <h1 class="gothic text-[30px] cursor-default title ${task.completed ? 'line-through' : ''}">${task.name}</h1>
                                                                      <p class="cursor-default poppins description ${task.completed ? 'opacity-50' : ''}">${task.description}</p>
                                                                      <p class="cursor-default poppins text-red-500">Due ${year} ${month} ${date}${suffix(date)}</p>
                                                            </div>
                                                            
                                                            <i class="fa-solid fa-pen text-2xl w-8 h-8 cursor-pointer" onclick="toggleEdit(${task.id})"></i>
                                                            <i class="fa-solid fa-trash text-2xl w-8 h-8 cursor-pointer" onclick="showDeleteModal(${task.id})"></i>

						<div class="rating absolute scale-[13] top-7 left-11 transform perspective-[800px] transition-transform" onclick="">
							<input type="checkbox" name="rating-2-task-${task.id}" class="mask mask-star-2 bg-yellow-400 transform rotate-x-[50deg] rotate-y-[20deg]"  aria-label="1 star" ${task.starred ? 'checked' : ''} onclick="toggleStar(${task.id})" />
						</div>

                                                  </div>
				

                                                  <form class="flex flex-1 gap-3 edit mx-4 hidden" onsubmit="editTask(event)" id="form">
                                                            <div class="flex flex-col gap-4 flex-1">
                                                                      <input type="text" value="${task.id}" class="hidden" name="id" />
                                                                      <input type="text" placeholder="Type here" class="gothic input input-xl border-black border-2 w-full" name="name" value="${task.name}" />
                                                                      <textarea class="poppins textarea w-full textarea-lg border-black" placeholder="Bio">${task.description}</textarea>
                                                                      <input type="date" class="text-red-500 poppins input input-lg border-black border-2 w-full" name="dueDate" value="${task.dueDate}" />
                                                            </div>


                                                            <div class="flex flex-col gap-4">
                                                                      <button class="btn btn-neutral btn-lg flex-1 w-full" type="submit">
                                                                                <i class="fa-solid fa-floppy-disk" style="color: #ffffff;"></i>
                                                                      </button>
                                                                      <button class="btn btn-error btn-lg flex-1 w-full" type="button" onclick="toggleEdit(${task.id})">
                                                                                <i class="fa-solid fa-xmark" style="color: #ffffff;"></i>
                                                                      </button>
                                                            </div>
                                                  </form>

                                        </div>`;
		tasksHtml += html;
	});

	showTasksLeft();
	taskContainer.innerHTML = tasksHtml;
}
function showTasksLeft() {
	const amount = tasks.filter((task) => !task.completed).length;
	const tasksLeftHtml = find('#tasksLeft');

	tasksLeftHtml.innerHTML = `You have ${amount} tasks left!`;
}
function addTask(event) {
	event.preventDefault();

	const name = event.target.name.value.trim();
	const dueDate = event.target.dueDate.value;
	const description = event.target.querySelector('textarea').value.trim();

	if (!name || !dueDate || !description) {
		toggleAlert('failed');
		return;
	}

	const newTask = {
		id: tasks[tasks.length - 1]?.id + 1 || 1,
		name,
		dueDate,
		description,
		completed: false,
		starred: false,
	};

	tasks.push(newTask);
	saveTasks();
	clearForm(event.target);
	showTasks();
	toggleAlert('success');
}
function clearForm(target) {
	target.name.value = '';
	target.dueDate.value = '';
	target.querySelector('textarea').value = '';
}
function toggleAlert(type, message) {
	const alertHtml = find(`#${type}`);

	if (message) {
		alertHtml.querySelector('span').innerHTML = message;
	}

	find('#success').classList.add('hidden');
	find('#failed').classList.add('hidden');

	alertHtml.classList.remove('hidden');

	if (timeoutId) {
		clearTimeout(timeoutId);
	}

	timeoutId = setTimeout(() => {
		alertHtml.classList.add('hidden');
	}, 5000);
}
function toggleTask(id) {
	const taskHtml = find(`#task-${id}`);
	const title = taskHtml.querySelector('.title');
	const description = taskHtml.querySelector('.description');

	const task = tasks.find((task) => task.id == id);
	task.completed = !task.completed;
	title.classList.toggle('line-through');
	description.classList.toggle('opacity-50');

	saveTasks();
	showTasks();
}
function toggleEdit(id) {
	const taskHtml = find(`#task-${id}`);
	const info = taskHtml.querySelector('.info');
	const edit = taskHtml.querySelector('.edit');

	info.classList.toggle('hidden');
	edit.classList.toggle('hidden');
}
function editTask(event) {
	event.preventDefault();

	const task = tasks.find((task) => task.id == event.target.id.value);
	const name = event.target.name.value.trim();
	const dueDate = event.target.dueDate.value;
	const description = event.target.querySelector('textarea').value.trim();

	if (task.name === name && task.dueDate === dueDate && task.description === description) {
		toggleEdit(task.id);
		return;
	}

	task.name = name;
	task.dueDate = dueDate;
	task.description = description;

	saveTasks();
	toggleAlert('success', 'Task successfully updated! ');
	showTasks();
}
function showDeleteModal(id) {
	taskToDelete = id;
	find('#confirmModal').classList.remove('hidden');
}
function confirmDelete() {
	tasks = tasks.filter((task) => task.id !== taskToDelete);
	taskToDelete = null;
	find('#confirmModal').classList.add('hidden');
	saveTasks();
	showTasks();
	toggleAlert('success', 'Task deleted!');
}
function cancelDelete() {
	taskToDelete = null;
	find('#confirmModal').classList.add('hidden');
}
function saveTasks() {
	localStorage.setItem('tasks', JSON.stringify(tasks));
}
function toggleStar(id) {
	const task = tasks.find((task) => task.id == id);
	task.starred = !task.starred;

	saveTasks();
	showTasks();
}
async function sortTasks(filters) {
	let sorted = [...tasks];

	filters.forEach((filter) => {
		sorted = sorted.sort((a, b) => {
			switch (filter) {
				case 'starred':
					return Number(b.starred) - Number(a.starred);
				case 'completed':
					return Number(a.completed) - Number(b.completed);
				case 'dueDate':
					return new Date(a.dueDate) - new Date(b.dueDate);
				default:
					return 0;
			}
		});
	});

	return sorted;
}
function suffix(date) {
	if (['1', '21', '31'].includes(date)) {
		return 'st';
	} else if (['2', '22'].includes(date)) {
		return 'nd';
	} else if (['3', '23'].includes(date)) {
		return 'rd';
	} else {
		return 'th';
	}
}

showTasks();
