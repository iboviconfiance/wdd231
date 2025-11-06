const courses = [
    {
        subject: 'CSE',
        number: 110,
        title: 'Introduction to Programming',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce students to programming. It will introduce the building blocks of programming languages (variables, decisions, calculations, loops, array, and input/output) and use them to solve problems.',
        technology: [
            'Python'
        ],
        completed: false
    },
    {
        subject: 'WDD',
        number: 130,
        title: 'Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course introduces students to the World Wide Web and to careers in web site design and development. The course is hands on with students actually participating in simple web designs and programming. It is anticipated that students who complete this course will understand the fields of web design and development and will have a good idea if they want to pursue this degree as a major.',
        technology: [
            'HTML',
            'CSS'
        ],
        completed: false
    },
    {
        subject: 'CSE',
        number: 111,
        title: 'Programming with Functions',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'CSE 111 students become more organized, efficient, and powerful computer programmers by learning to research and call functions written by others; to write, call , debug, and test their own functions; and to handle errors within functions. CSE 111 students write programs with functions to solve problems in many disciplines, including business, physical science, human performance, and humanities.',
        technology: [
            'Python'
        ],
        completed: false
    },
    {
        subject: 'CSE',
        number: 210,
        title: 'Programming with Classes',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course will introduce the notion of classes and objects. It will present encapsulation at a conceptual level. It will also work with inheritance and polymorphism.',
        technology: [
            'C#'
        ],
        completed: false
    },
    {
        subject: 'WDD',
        number: 131,
        title: 'Dynamic Web Fundamentals',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience in Web Fundamentals and programming. Students will learn to create dynamic websites that use JavaScript to respond to events, update content, and create responsive user experiences.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    },
    {
        subject: 'WDD',
        number: 231,
        title: 'Frontend Web Development I',
        credits: 2,
        certificate: 'Web and Computer Programming',
        description: 'This course builds on prior experience with Dynamic Web Fundamentals and programming. Students will focus on user experience, accessibility, compliance, performance optimization, and basic API usage.',
        technology: [
            'HTML',
            'CSS',
            'JavaScript'
        ],
        completed: false
    }
]

const container = document.getElementById('course-container');
const menu = document.getElementById('main-menu');
const span_nub =document.querySelector('.span_nub');


function getCourse(coursestr){
    const y=coursestr;
    return y;
}

function flitercomplet(x){
  let filteredd = courses.slice();

}



function displayCourse(list) {
  container.innerHTML = ''; //clear

  if (!list || list.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center; color:#555; padding:1rem;">No courses finding for this filter.</p>`;
    span_nub.textContent = 0;
    return;
  }
  span_nub.textContent = list.length;
  list.forEach(course => {
    const div_sect = document.createElement('div');
    div_sect.className = 'course_card';
    div_sect.innerHTML = `<strong>${course.subject}</strong> ${course.number}`;


    container.appendChild(div_sect);
  });
}

function filterCourse(criteria) {
  let filtered = courses.slice(); //copy

  switch (criteria) {
    case 'cse':
      filtered = filtered.filter(t => {
        const coursess = getCourse(t.subject);
        return coursess !== null && coursess=='CSE';
      });
      break;

    case 'wdd':
      filtered = filtered.filter(t => {
        const coursess = getCourse(t.subject);
        return coursess !== null && coursess=='WDD';
      });
      break;

    case 'all':
    default:
      filtered = courses.slice(); 
      break;
  }
  displayCourse(filtered);

}

function onMenuClick(e) {
  if (!e.target.matches('[data-filter]')) return;
  e.preventDefault();

  const filter = e.target.getAttribute('data-filter');

  // update active link style
  menu.querySelectorAll('a').forEach(a => a.classList.remove('active'));
  e.target.classList.add('active');

  // close mobile menu if open
  if (menu.classList.contains('open')) toggleMobileMenu();


  filterCourse(filter);
}

document.addEventListener('DOMContentLoaded', () => {
  // initial render: all courses
  displayCourse(courses);

  // event delegation for menu
  menu.addEventListener('click', onMenuClick);

  // hamburger for mobile
  hamburger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMobileMenu();
  });

  // click outside to close mobile menu
  document.addEventListener('click', (evt) => {
    if (!menu.contains(evt.target) && menu.classList.contains('open')) {
      toggleMobileMenu();
    }
  });

  // keyboard accessibility: close menu on Escape
  document.addEventListener('keydown', (ev) => {
    if (ev.key === 'Escape' && menu.classList.contains('open')) {
      toggleMobileMenu();
    }
  });

});