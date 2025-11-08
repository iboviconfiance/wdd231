// Tableau des cours
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
        completed: true
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
        completed: true
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
        completed: true
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
        completed: true  // Modifier selon vos besoins
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
];


let filteredCourses = [...courses];

// Fonction pour afficher les cours
function displayCourses(coursesToDisplay) {
    const container = document.querySelector('.courses-container');
    container.innerHTML = '';
    
    coursesToDisplay.forEach(course => {
        const courseCard = document.createElement('div');
        courseCard.className = `course-card ${course.completed ? 'completed' : ''}`;
        
        courseCard.innerHTML = `
            <div class="course-header">
                <div class="course-code">${course.subject} ${course.number}</div>
                <div class="course-credits">${course.credits} crédits</div>
            </div>
            <div class="course-title">${course.title}</div>
            <div class="course-description">${course.description}</div>
            <div class="course-tech">
                ${course.technology.map(tech => `<span class="tech-tag">${tech}</span>`).join('')}
            </div>
        `;
        
        container.appendChild(courseCard);
    });
    
    // Mettre à jour le total des crédits
    updateTotalCredits(coursesToDisplay);
}

// Fonction pour mettre à jour le total des crédits
function updateTotalCredits(coursesToDisplay) {
    const totalCredits = coursesToDisplay.reduce((total, course) => total + course.credits, 0);
    document.getElementById('total-credits').textContent = totalCredits;
}

// Fonction pour filtrer les cours
function filterCourses(filter) {
    if (filter === 'all') {
        filteredCourses = [...courses];
    } else {
        filteredCourses = courses.filter(course => course.subject === filter);
    }
    
    displayCourses(filteredCourses);
}

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    // Afficher tous les cours au chargement
    displayCourses(courses);
    
    // Gestion des boutons de filtre
    const filterButtons = document.querySelectorAll('.filter-a');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Retirer la classe active de tous les boutons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Ajouter la classe active au bouton cliqué
            this.classList.add('active');
            
            // Filtrer les cours
            const filter = this.getAttribute('data-filter');
            filterCourses(filter);
        });
    });
});