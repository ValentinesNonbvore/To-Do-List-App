const tasks = [
	{
		id: 1,
		name: 'Calculus Homework',
		dueDate: '2025-04-22',
		completed: false,
		description: 'Finish all exercises from Chapter 5 and review the lecture notes.',
	},
	{
		id: 2,
		name: 'Physics Project',
		dueDate: '2025-04-25',
		completed: false,
		description: 'Group project on Newton’s Laws. Prepare slides and experiment results.',
	},
	{
		id: 3,
		name: 'Chemistry Lab Report',
		dueDate: '2025-04-23',
		completed: false,
		description: 'Write up the results from the acid-base titration lab.',
	},
	{
		id: 4,
		name: 'History Essay',
		dueDate: '2025-05-01',
		completed: false,
		description: 'Essay on the impacts of the Industrial Revolution. 1500 words.',
	},
	{
		id: 5,
		name: 'Literature Book Review',
		dueDate: '2025-04-29',
		completed: false,
		description: 'Read and review “Pride and Prejudice” by Jane Austen.',
	},
	{
		id: 6,
		name: 'Web Development Assignment',
		dueDate: '2025-04-26',
		completed: false,
		description: 'Build a responsive website using HTML, CSS, and JavaScript.',
	},
	{
		id: 7,
		name: 'Economics Presentation',
		dueDate: '2025-04-30',
		completed: false,
		description: 'Create a 10-minute presentation on inflation trends.',
	},
	{
		id: 8,
		name: 'Biology Lab Report',
		dueDate: '2025-04-27',
		completed: false,
		description: 'Document the results from the mitosis microscope experiment.',
	},
	{
		id: 9,
		name: 'Philosophy Paper',
		dueDate: '2025-05-05',
		completed: false,
		description: 'Argumentative essay on the ethics of AI decision-making.',
	},
	{
		id: 10,
		name: 'Programming Quiz',
		dueDate: '2025-04-28',
		completed: false,
		description: 'Study recursion, arrays, and objects for the quiz.',
	},
	{
		id: 11,
		name: 'Art Project',
		dueDate: '2025-05-02',
		completed: false,
		description: 'Create a mixed-media piece inspired by nature.',
	},
];
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

function find(target) {
	return document.querySelector(target);
}
function showTasks() {
	let tasksHtml = '';
	const taskContainer = find('#taskContainer');

	tasks.forEach((task) => {
		const month = months[task.dueDate.substring(5, 7)];
		const html = `<div class="border border-2 border-black rounded-lg w-full px-[15px] py-[30px] flex gap-4" id="${task.id}">
                                                  <input type="checkbox" checked="checked" class="checkbox checkbox-neutral checkbox-xl" />
                                                  <div class="flex-1 mt-[-5px]">
                                                            <h1 class="gothic text-[30px] cursor-default ">${task.name}</h1>
                                                            <p class="poppins">${task.description}</p>
                                                            <p class="poppins text-red-500">Due ${task.dueDate.substring(0, 4)} ${month} ${task.dueDate.substring(9, 10)}</p>
                                                  </div>
                                                  <i class="fa-solid fa-pen text-2xl w-8 cursor-pointer"></i>
                                                  <i class="fa-solid fa-trash text-2xl w-8 cursor-pointer"></i>
                                        </div>`;
		tasksHtml += html;
	});

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
	};

	tasks.push(newTask);
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
function toggleFailure() {}

showTasksLeft();
showTasks();
