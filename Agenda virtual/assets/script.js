const listOfTasks = $('#tasks-list');
const currentDay = $('#currentDay');
const filterSelect = $('#day-filter');

// Asegúrate de cargar el archivo de idioma antes de usar moment.locale('es')

// Configura moment para usar español
moment.locale('es');

// Función para actualizar el reloj
function updateClock() {
  currentDay.text(moment().format('MMMM Do YYYY, h:mm:ss a'));
}

// Llama a la función para actualizar el reloj y configura la actualización cada segundo
updateClock();
setInterval(updateClock, 1000);



// Días de la semana
const daysOfWeek = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

// Limpiar almacenamiento local si es una nueva semana
const currentWeek = moment().startOf('isoWeek').format('YYYY-MM-DD');
const savedWeek = localStorage.getItem('currentWeek');

if (currentWeek !== savedWeek) {
  localStorage.clear();
  localStorage.setItem('currentWeek', currentWeek);
}

// Generar bloques de planificación para cada día de la semana
daysOfWeek.forEach((day, dayIndex) => {
  const dayHeader = $('<h2>').addClass('day-header').text(day);
  const dayContainer = $('<div>').addClass('day-container').attr('data-day', dayIndex);
    // el for nos dice las horas del dia en el que se haran las tareas
  for (let i = 6; i <= 23; i++) {
    const hour = moment(i, 'H');
    const row = $('<div>').addClass('row time-block');

    const timeCol = $('<div>')
      .addClass('col-2 col-sm-2 col-md-2 col-lg-1 hour')
      .text(hour.format('h A'));

    const contentCol = $('<div>')
      .addClass('col-7 col-sm-7 col-md-8 col-lg-9 content')
      .attr('contenteditable', 'true')
      .text(localStorage.getItem(`task-${dayIndex}-${i}`));
        //la funcion para determinar el nivel prioridad de la tarea
    const priorityCol = $('<div>')
      .addClass('col-2 col-sm-2 col-md-1')
      .append(
        $('<select>')
          .addClass('priority-select form-select')
          .html('<option value="baja">Baja</option><option value="media">Media</option><option value="alta">Alta</option>')
          .val(localStorage.getItem(`priority-${dayIndex}-${i}`) || 'low')
          .on('change', function () {
            const priority = $(this).val();
            localStorage.setItem(`priority-${dayIndex}-${i}`, priority);
            alert(`Prioridad de tarea cambiada a ${priority} para ${hour.format('h A')}`);
          })
      );

    const buttonCol = $('<div>').addClass('col-1 col-sm-1 col-md-1 col-lg-1');
    const saveButton = $('<button>')
      .addClass('btn btn-success saveBtn')
      .html('<i class="fas fa-save"></i> Guardar')
      .on('click', function () {
        const task = contentCol.text();
        localStorage.setItem(`task-${dayIndex}-${i}`, task);
        alert(`Tarea guardada para ${day}, ${hour.format('h A')}!`);
      });
      // el boton de borrar tarea
    const deleteButton = $('<button>')
      .addClass('btn btn-danger deleteBtn mt-2')
      .text('Eliminar')
      .on('click', function () {
        contentCol.text('');
        localStorage.removeItem(`task-${dayIndex}-${i}`);
        localStorage.removeItem(`priority-${dayIndex}-${i}`);
        alert('Tarea eliminada!');
      });

    buttonCol.append(saveButton, deleteButton);
    row.append(timeCol, contentCol, priorityCol, buttonCol);
    dayContainer.append(row);
  }

  listOfTasks.append(dayHeader, dayContainer);

  filterSelect.append(
    $('<option>').val(dayIndex).text(day)
  );
});

// Manejar el filtro de días
filterSelect.on('change', function () {
  const selectedDay = $(this).val();
  $('.day-container').hide();
  if (selectedDay === 'all') {
    $('.day-container').show();
  } else {
    $(`.day-container[data-day="${selectedDay}"]`).show();
  }
});

$(document).ready(function() {
    const toggleThemeButton = $('#toggle-theme');
    
    // Verificar si ya está activado el modo oscuro
    if (localStorage.getItem('darkMode') === 'true') {
      $('body').addClass('dark-mode');
      toggleThemeButton.text('Modo Claro');
    }
    
    // Alternar entre modo claro y oscuro
    toggleThemeButton.on('click', function() {
      $('body').toggleClass('dark-mode');
      if ($('body').hasClass('dark-mode')) {
        localStorage.setItem('darkMode', 'true');
        toggleThemeButton.text('Modo Claro');
      } else {
        localStorage.setItem('darkMode', 'false');
        toggleThemeButton.text('Modo Oscuro');
      }
    });
  });
