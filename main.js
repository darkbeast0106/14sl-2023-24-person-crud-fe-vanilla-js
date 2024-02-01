import "./style.css";

const api_url = "http://localhost:8000/api/people"

document.addEventListener("DOMContentLoaded", () => {
  const personForm = document.getElementById("personForm");
  const resetButton = document.getElementById("resetButton");
  resetButton.addEventListener("click", resetForm);
  personForm.addEventListener("submit", handleFormSubmit);
  listPeople();
});

function handleFormSubmit(event) {
  event.preventDefault();
  const id = document.getElementById("id").value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone_number = document.getElementById('phone_number').value;
  const birth_date = document.getElementById('birth_date').value;
  const person = {
    name: name,
    email: email,
    phone_number: phone_number,
    birth_date: birth_date,
  };
  if (id == "") {
    addPerson(person);
  } else {
    updatePerson(id, person);
  }
}

async function updatePerson(id, person) {
  const response = await fetch(`${api_url}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(person),
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (response.ok) {
    resetForm();
    listPeople();
  }
}

async function addPerson(person) {
  console.log(person);
  console.log(JSON.stringify(person));
  
  const response = await fetch(api_url, {
    method: "POST",
    body: JSON.stringify(person), 
    headers: {
      "Content-Type": "application/json"
    }
  });
  if (response.ok) {
    listPeople();
    resetForm();
  }
}

function resetForm() {
  document.getElementById('id').value = "";
  document.getElementById('name').value = "";
  document.getElementById('email').value = "";
  document.getElementById('phone_number').value = "";
  document.getElementById('birth_date').value = "";
  document.getElementById("updateButton").classList.add('hide');
  document.getElementById("submitButton").classList.remove('hide');
}

function listPeople() {
  const peopleTable = document.getElementById("peopleTable");
  // Then függvény akkor fut le, ha sikeresen teljesült a promise.
  // fetch(api_url).then(httpResponse => httpResponse.text())
  // a válaszban a tartalom json -> nem szövegként hanem javascriptes objektumként szeretnék vele dolgozni
  fetch(api_url).then(httpResponse => httpResponse.json())
  // .then(responseBody => {
  //   let html = "";
  //   responseBody.forEach(person => {
  //     const tableRow = `<tr>
  //     <td>${person.id}</td>
  //     <td>${person.name}</td>
  //     <td>${person.email}</td>
  //     <td>${person.phone_number}</td>
  //     <td><button onclick="deletePerson(${person.id})">Törlés</button></td>
  //     </tr>`;
  //     html += tableRow;
  //   });
  //   peopleTable.innerHTML = html;
  // });
  .then(responseBody => {
    peopleTable.innerHTML = "";
    responseBody.forEach(person => {
      const tableRow = document.createElement("tr");
      const idTableData = document.createElement("td");
      const nameTableData = document.createElement("td");
      const emailTableData = document.createElement("td");
      const phoneTableData = document.createElement("td");
      const birthTableData = document.createElement("td");

      const actionsTableData = document.createElement("td");
      const updateButton = document.createElement("button");
      const deleteButton = document.createElement("button");
      updateButton.textContent = "Módosít";
      deleteButton.textContent = "Törlés";
      updateButton.addEventListener("click", () => fillUpdateForm(person.id));
      deleteButton.addEventListener("click", () => deletePerson(person.id));
      actionsTableData.appendChild(updateButton)
      actionsTableData.appendChild(deleteButton)
      
      idTableData.textContent = person.id;
      nameTableData.textContent = person.name;
      emailTableData.textContent = person.email;
      phoneTableData.textContent = person.phone_number;
      birthTableData.textContent = person.birth_date;
      tableRow.appendChild(idTableData);
      tableRow.appendChild(nameTableData);
      tableRow.appendChild(emailTableData);
      tableRow.appendChild(phoneTableData);
      tableRow.appendChild(birthTableData);
      tableRow.appendChild(actionsTableData);
      peopleTable.appendChild(tableRow);
    });
  });
}

async function deletePerson(id) {
  const response = await fetch(`${api_url}/${id}`, { method: "DELETE" });
  console.log(response);
  console.log(await response.text());
  if (response.ok) {
    listPeople();
  }
}

async function fillUpdateForm(id) {
  const response = await fetch(`${api_url}/${id}`);
  if (!response.ok) {
    alert("Hiba történt az adatok lekérése során");
    return;
  }
  const person = await response.json();
  document.getElementById("id").value = person.id;
  document.getElementById("name").value = person.name;
  document.getElementById("email").value = person.email;
  document.getElementById("phone_number").value = person.phone_number;
  document.getElementById("birth_date").value = person.birth_date;
  document.getElementById("submitButton").classList.add('hide');
  document.getElementById("updateButton").classList.remove('hide');
}