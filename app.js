// [{_id: "5d2ca9e29c8a94095c1288e0", completed: false,…},…]
// 0: {_id: "5d2ca9e29c8a94095c1288e0", completed: false,…}
// 1: {_id: "5d2ca9e2e03d40b3232496aa7", completed: true,…}
// 2: {_id: "5d2ca9e29c8a94095564788e0", completed: false,…}
// 3: {title: "sad", body: "sda", completed: false, _id: "task-0.6347561810727358"}
// 4: {title: "лут", body: "лут", completed: false, _id: "task-0.6450905562716682"}
let tasks = []
const checkTask = localStorage.getItem("tasks");
if (checkTask == null || checkTask == "") {
  tasks = [];
  localStorage.setItem('tasks', "");
} else
  tasks = JSON.parse(localStorage.getItem('tasks'));
const themes = {
  default: {
    '--base-text-color': '#212529',
    '--header-bg': '#007bff',
    '--header-text-color': '#fff',
    '--default-btn-bg': '#007bff',
    '--default-btn-text-color': '#fff',
    '--default-btn-hover-bg': '#0069d9',
    '--default-btn-border-color': '#0069d9',
    '--danger-btn-bg': '#dc3545',
    '--danger-btn-text-color': '#fff',
    '--danger-btn-hover-bg': '#bd2130',
    '--danger-btn-border-color': '#dc3545',
    '--input-border-color': '#ced4da',
    '--input-bg-color': '#fff',
    '--input-text-color': '#495057',
    '--input-focus-bg-color': '#fff',
    '--input-focus-text-color': '#495057',
    '--input-focus-border-color': '#80bdff',
    '--input-focus-box-shadow': '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
    '--body-bg': '#fff',
    '--button-delets-bg': '#00cf22',
    '--button-complete-color': '#000'
  },
  dark: {
    '--base-text-color': '#212529',
    '--header-bg': '#343a40',
    '--header-text-color': '#fff',
    '--default-btn-bg': '#58616b',
    '--default-btn-text-color': '#fff',
    '--default-btn-hover-bg': '#292d31',
    '--default-btn-border-color': '#343a40',
    '--default-btn-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    '--danger-btn-bg': '#b52d3a',
    '--danger-btn-text-color': '#fff',
    '--danger-btn-hover-bg': '#88222c',
    '--danger-btn-border-color': '#88222c',
    '--input-border-color': '#ced4da',
    '--input-bg-color': '#fff',
    '--input-text-color': '#495057',
    '--input-focus-bg-color': '#fff',
    '--input-focus-text-color': '#495057',
    '--input-focus-border-color': '#78818a',
    '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    '--body-bg': '#778899',
    '--button-delets-bg': '#343a40',
    '--button-complete-color': '#fff'
  },
  light: {
    '--base-text-color': '#212529',
    '--header-bg': '#fff',
    '--header-text-color': '#212529',
    '--default-btn-bg': '#fff',
    '--default-btn-text-color': '#212529',
    '--default-btn-hover-bg': '#e8e7e7',
    '--default-btn-border-color': '#343a40',
    '--default-btn-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    '--danger-btn-bg': '#f1b5bb',
    '--danger-btn-text-color': '#212529',
    '--danger-btn-hover-bg': '#ef808a',
    '--danger-btn-border-color': '#e2818a',
    '--input-border-color': '#ced4da',
    '--input-bg-color': '#fff',
    '--input-text-color': '#495057',
    '--input-focus-bg-color': '#fff',
    '--input-focus-text-color': '#495057',
    '--input-focus-border-color': '#78818a',
    '--input-focus-box-shadow': '0 0 0 0.2rem rgba(141, 143, 146, 0.25)',
    '--body-bg': '#fff',
    '--button-delets-bg': '#7dff93',
    '--button-complete-color': '#000'
  },
}
//values
let lastSelectedThemas = 'default'
let saveTheme = localStorage.getItem('saveTheme');
(function (arrOfTasks) {
  const objTasks = tasks.reduce((acc, task) => {
    acc[task._id] = task
    return acc
  }, {})

  //* Element UI
  const listContainer = document.querySelector(
    '.tasks-list-section .list-group'
  )
  const form = document.forms['addTask']
  const inputTitle = form.elements['title']
  const inputBody = form.elements['body']
  const btnAllTask = document.querySelector('.btn-alltask')
  const btnDontTask = document.querySelector('.btn-donttask')
  const pickerTheme = document.getElementById('themeSelect')

  function renderAllTasks(objTasks) {
    if (!objTasks) {
      console.error('Передайте задачи!')
      return
    }
    const fragmentEl = document.createDocumentFragment()
    Object.values(objTasks).forEach(task => {
      const li = generateLi(task)
      fragmentEl.appendChild(li)
    })
    listContainer.appendChild(fragmentEl)
    showAllTask(objTasks)
  }
  //*events
  saveSelectedTheme()
  checkObj(objTasks)
  renderAllTasks(objTasks)
  form.addEventListener('submit', onFormSubmit)
  btnAllTask.addEventListener('click', function () {
    //  console.log("btn-click");
    showAllTask(objTasks)
  })
  pickerTheme.addEventListener('change', changeSetTheme)
  btnDontTask.addEventListener('click', e => {
    showDontCompletedTask(objTasks)
  })

  listContainer.addEventListener('click', function ({
    target
  }) {
    if (target.classList.contains('delete-btn')) {
      removeTask(target)
      showAllTask(objTasks)
      checkObj(objTasks)
    }
    if (target.classList.contains('btn-complete')) {
      changeColorTask(target)
      showDontCompletedTask(objTasks)
    }
  })

  function showDontCompletedTask(obj) {
    const ul = document.querySelector('.task-list')
    ul.innerHTML = ''
    Object.values(obj).forEach(task => {
      generateDontCompletedTask(task)
    })
  }

  function showAllTask(obj) {
    const ul = document.querySelector('.task-list')
    ul.innerHTML = ''
    const newObj = Object.values(obj)
    newObj.sort(
      (call = (prev, next) => {
        return next.completed - prev.completed
      })
    )
    newObj.forEach(task => {
      generateAllTask(task)
    })
  }

  function changeColorTask(target) {
    const parent = target.closest('[data-id]')
    if (!parent.classList.contains('button-com')) {
      const confirmed = confirm(
        `Задача '${
					objTasks[parent.getAttribute('data-id')].title
				}' была выполнена?'`
      )
      if (confirmed) {
        parent.classList.add('button-com')
        objTasks[parent.getAttribute('data-id')].completed = true
        tasks.map(value => {
          if (value._id == parent.getAttribute('data-id')) value.completed = true;
        })
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    } else {
      const confirmed = confirm(
        `Отменить выполнение задачи?'${
					objTasks[parent.getAttribute('data-id')].title
				}''`
      )
      if (confirmed) {
        parent.classList.remove('button-com')
        objTasks[parent.getAttribute('data-id')].completed = false
        tasks.map(value => {
          if (value._id == parent.getAttribute('data-id')) value.completed = false;
        })
        localStorage.setItem("tasks", JSON.stringify(tasks));
      }
    }
  }

  function checkObj(obj) {
    if (Object.keys(obj).length == 0) alert('Задач нету!')
  }

  function removeTask(target) {
    const parent = target.closest('[data-id]')
    const confirms = confirm(
      `Вы хотите удалить ${objTasks[parent.getAttribute('data-id')].title}`
    )
    if (confirms) {
      parent.remove()
      tasks = tasks.filter(value =>
        value._id !== parent.getAttribute('data-id'))
      localStorage.setItem("tasks", JSON.stringify(tasks));
      delete objTasks[parent.getAttribute('data-id')]
      console.log(objTasks)
    }
  }

  function generateLi({
    _id,
    body,
    title,
    completed
  } = {}) {
    const li = document.createElement('li')
    li.classList.add(
      'list-group-item',
      'd-flex',
      'align-items-center',
      'flex-wrap',
      'mt-2'
    )
    li.setAttribute('data-id', _id)

    const span = document.createElement('span')
    span.textContent = title
    span.style.fontWeight = 'bold'

    const button = document.createElement('button')
    button.classList.add(
      'btn',
      'btn-danger',
      'ml-auto',
      'delete-btn',
    )
    button.textContent = 'Удалить'

    const buttonComplete = document.createElement('button')
    buttonComplete.classList.add('btn', 'ml-auto', 'btn-complete')
    buttonComplete.textContent = 'Завершить'

    const bodyText = document.createElement('p')
    bodyText.textContent = body
    bodyText.classList.add('mt-2', 'w-100')

    li.appendChild(span)
    li.appendChild(button)
    li.appendChild(buttonComplete)
    li.appendChild(bodyText)

    if (completed) li.classList.add('button-com')

    return li
  }

  function generateAllTask({
    _id,
    body,
    title,
    completed
  } = {}) {
    const ul = document.querySelector('.task-list')
    const li = document.createElement('li')
    li.textContent = title
    ul.appendChild(li)
  }

  function generateDontCompletedTask({
    _id,
    body,
    title,
    completed
  } = {}) {
    if (!completed) {
      const ul = document.querySelector('.task-list')
      const li = document.createElement('li')
      li.textContent = title
      ul.appendChild(li)
    }
    return
  }

  function onFormSubmit(e) {
    e.preventDefault()
    const titleValue = inputTitle.value
    const bodyValue = inputBody.value
    if (!titleValue || !bodyValue) {
      console.error('Заполните Заголовок и содержимое!')
      return
    }
    const tasked = generateTask(titleValue, bodyValue)
    const listItem = generateLi(tasked)
    console.log(tasked)
    listContainer.insertAdjacentElement('afterbegin', listItem)
    tasks.push(tasked);
    console.log(tasks);
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  function generateTask(title, body) {
    const getTask = {
      title,
      body,
      completed: false,
      _id: `task-${Math.random()}`,
    }
    objTasks[getTask._id] = getTask
    return {
      ...getTask
    }
  }

  function changeSetTheme() {
    const selectedTheme = pickerTheme.value
    confirmed = confirm('Вы действительно хотите изменить тему?')
    if (!confirmed) {
      pickerTheme.value = lastSelectedThemas
      return
    }
    setTheme(selectedTheme)
    lastSelectedThemas = pickerTheme.value
    localStorage.setItem('saveTheme', lastSelectedThemas)
  }

  function saveSelectedTheme() {
    if (saveTheme == null) {
      saveTheme == 'default'
    } else {
      pickerTheme.value = saveTheme
      setTheme(saveTheme)
    }
  }

  function setTheme(thema) {
    const themas = themes[thema]
    Object.entries(themas).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value)
    })
  }
})(tasks)