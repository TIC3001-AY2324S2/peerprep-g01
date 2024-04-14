const categoryTypes = ["Strings", "Algorithms", "Data Structures", "Bit Manipulation", "Brainteaser", "Databases"]
const selectedCategory = []
const complexityTypes = ["Easy", "Medium", "Hard"];
let questions = [];

// Get all questions from the server and display
async function fetchQuestionsDB(){
    try {
        const response = await fetch('http://localhost:3002/api/questions');
        questions = await response.json();
        getQuestions();
    } catch (error) {
        console.error('Error fetching questions: ', error);
    }
}

function getQuestions() {
    // Get reference to table body
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = ""

    // Iterate over the data array using forEach
    questions.forEach(item => {
        const row = document.createElement('tr');   // Create a new row element

        // Create table data cells and set their content
        const cell1 = document.createElement('td');
        cell1.innerHTML = `<a onclick="editQuestion('${item.questionID}')" class="btn btn-link">${item.questionID} </a>`;
        const cell2 = document.createElement('td');
        cell2.textContent = item.questionTitle;
        const cell3 = document.createElement('td');
        cell3.textContent = item.questionDesc;
        const cell4 = document.createElement('td');
        const categories = item.questionCat.split(","); // Split categories by comma

        // Generate HTML for each category
        const categoryBadges = categories.map(questionCat => `<span class="badge rounded-pill bg-secondary">${questionCat.trim()}</span>`);

        // Join HTML for all categories
        const categoryHTML = categoryBadges.join('');
        cell4.innerHTML = categoryHTML;

        const cell5 = document.createElement('td');
        const complexityHTML = `<span class="badge rounded-pill bg-${item.questionComplexity == complexityTypes[0] ? 'primary' : item.questionComplexity == complexityTypes[1] ? 'warning' : 'danger'}">${item.questionComplexity}</span>`
        cell5.innerHTML = complexityHTML;

        // Append cells to the row
        row.appendChild(cell1);
        row.appendChild(cell2);
        row.appendChild(cell3);
        row.appendChild(cell4);
        row.appendChild(cell5);
        tableBody.appendChild(row); // Append row to the table body
    });
}

// Sorting function
function sortQuestionsByProperty(sortBy) {
    questions = questions.sort((a, b) => {
        if (a[sortBy] < b[sortBy]) return -1;
        if (a[sortBy] > b[sortBy]) return 1;
        return 0;
    });
    getQuestions();
}

function sortTextList(categoryList) {
    return categoryList.sort((a, b) => {
        if (a < b) return -1;
        if (a > b) return 1;
        return 0;
    });
}

function editQuestion(id) {
    switchToAddQuestions();
    
    id = parseInt(id);
    const question = questions.find(item => item.questionID === id);

    handleClear()

    document.getElementById('btnDelete').style.display = 'block';
    document.getElementById('idContainer').style.display = 'block';
    document.getElementById('inputID').value = question.questionID; 
    document.getElementById('inputTitle').value = question.questionTitle; 
    document.getElementById('inputDesc').value = question.questionDesc; 
    question.questionCat.split(",").map(item => {
        var itemIndex = categoryTypes.indexOf(item);
        categoryTypes.splice(itemIndex, 1);
        selectedCategory.push(item);
    })
    refreshCategory(categoryTypes, true);
    refreshCategory(selectedCategory, false);
    document.getElementById('selectComplexity').value = question.questionComplexity;
    document.getElementById('inputLink').value = question.questionLink; 
}

function refreshCategory(items, isLeft) {
    items = sortTextList(items);
    const ulElement = document.getElementById(isLeft ? "leftCategory" : "rightCategory");
    const liItems = items.map(category =>
        `<li class="list-group-item d-flex justify-content-between align-items-center ${isLeft ? "" : "list-group-item-success"}">${category.trim()}` +
        (isLeft ?
            `<button class="btn" type="button" onclick="selectCategory('${category.trim()}')">
                                    <i class="fa fa-caret-right"></i>
                                    </button>`:
            `<button class="btn" type="button" onclick="removeCategory('${category.trim()}')">
                                    <i class="fa fa-remove"></i>
                                    </button>`)

        + `</li>`);
    ulElement.innerHTML = liItems.join("");
}

function selectCategory(item) {
    var itemIndex = categoryTypes.indexOf(item);
    categoryTypes.splice(itemIndex, 1);

    selectedCategory.push(item);
    refreshCategory(categoryTypes, true);
    refreshCategory(selectedCategory, false);
}

function removeCategory(item) {
    var itemIndex = selectedCategory.indexOf(item);
    selectedCategory.splice(itemIndex, 1);

    categoryTypes.push(item);
    refreshCategory(categoryTypes, true);
    refreshCategory(selectedCategory, false);
}

function handleClear() {
    document.getElementById('idContainer').style.display = 'none';

    var searchInputs = document.querySelectorAll('.form-control');

    searchInputs.forEach(function (input) {
        if (input.classList.contains('is-invalid')){
            input.classList.remove('is-invalid');
        }
        input.value = '';
    });

    var selectComplexity = document.getElementById("selectComplexity")
    selectComplexity.value = complexityTypes[0]

    for (let index = selectedCategory.length - 1; index >= 0; index--) {
        const element = selectedCategory[index];
        categoryTypes.push(element);
        selectedCategory.splice(index, 1);
    }
    refreshCategory(categoryTypes, true);
    refreshCategory(selectedCategory, false);
}

async function handleSubmit(event) {
    event.preventDefault();

    var inputIdField = document.getElementById('inputID')
    var inputTitleField = document.getElementById('inputTitle')
    var inputDescField = document.getElementById('inputDesc')
    var selectComplexityField = document.getElementById('selectComplexity')
    var inputLinkField = document.getElementById('inputLink')

    var inputID = inputIdField.value.trim()
    var inputTitle = inputTitleField.value.trim()
    var inputDesc = inputDescField.value.trim()
    var selectComplexity = selectComplexityField.value
    var inputLink = inputLinkField.value.trim()

    if (inputTitle == "") {
        inputTitleField.classList.add('is-invalid');
    }
    if (inputDesc == "") {
        inputDescField.classList.add('is-invalid');
    }
    if (inputLink == "") {
        inputLinkField.classList.add('is-invalid');
    }

    // If ID is empty POST, else PATCH
    if (inputID == "") {
        inputID = questions.length + 1;
        var data = {
            questionID: inputID,
            questionTitle: inputTitle,
            questionDesc: inputDesc,
            questionCat: selectedCategory.join(","),
            questionComplexity: selectComplexity,
            questionLink: inputLink
        }
        
        try {
            const response = await fetch('http://localhost:3002/api/questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.ok){
                alert('Question added succesfully');
                fetchQuestionsDB()
                getQuestions()
                switchToQuestionsList()
            } else {
                alert('Failed to add question.');
            }
        } catch (error){
            console.error('Error adding question:', error);
        }

    } else {
        var data = {
            questionTitle: inputTitle,
            questionDesc: inputDesc,
            questionCat: selectedCategory.join(","),
            questionComplexity: selectComplexity,
            questionLink: inputLink
        }
        
        try {
            const response = await fetch('http://localhost:3002/api/questions/'+inputID, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            if (response.ok){
                alert('Question updated succesfully');
                fetchQuestionsDB()
                getQuestions()
                switchToQuestionsList()
            } else {
                alert('Failed to update question.');
            }
        } catch (error){
            console.error('Error updating question:', error);
        }
    }
    
}

async function handleDelete(event) {
    event.preventDefault();

    var inputIdField = document.getElementById('inputID')
    var inputID = inputIdField.value.trim()
        
    try {
        const response = await fetch('http://localhost:3002/api/questions/'+inputID, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        if (response.ok){
            alert('Question deleted succesfully');
        } else {
            alert('Failed to delete question.');
        }
    } catch (error){
        console.error('Error deleting question:', error);
    }

    fetchQuestionsDB()
    getQuestions()
    switchToQuestionsList()
}

// Update the client-side code to display the success message and skipped questions in the alert
async function handleFileUpload() {
    const fileInput = document.getElementById('fileUpload');
    const file = fileInput.files[0];

    if (!file) {
        alert('Please select a file.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch('http://localhost:3002/api/questions/upload', {
        method: 'POST',
        body: formData
        });

        const data = await response.json();
        let alertMessage = data.message;    // Display the success message

        // If there are skipped questions, add them to the alert message
        if (data.skippedQuestions && data.skippedQuestions.length > 0) {
            alertMessage += '\nSkipped questions:\n' + data.skippedQuestions.join('\n');
        }

        alert(alertMessage);
    } catch (error) {
        console.error('Error uploading file:', error);
        alert('An error occurred while uploading the file. Please try again.');
    }

    fetchQuestionsDB()
    getQuestions()
    switchToQuestionsList()
}


window.onload = fetchQuestionsDB();
refreshCategory(categoryTypes, true)
