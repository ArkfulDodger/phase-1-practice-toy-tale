let addToy = false;
const toyCollectionDiv = document.getElementById('toy-collection');
const addToyForm = document.querySelector('form.add-toy-form');

createToyFormShowHideEvent();
createAddToyEvent();
getToyCollection()
.then(toysArray => renderToyCollection(toysArray));


//#region COMPLETED FUNCTIONS

function createToyFormShowHideEvent() {
  const addBtn = document.querySelector("#new-toy-btn");
  const toyFormContainer = document.querySelector(".container");
  addBtn.addEventListener("click", () => {
    // hide & seek with the form
    addToy = !addToy;
    if (addToy) {
      toyFormContainer.style.display = "block";
    } else {
      toyFormContainer.style.display = "none";
    }
  });
}

function getToyCollection() {
  return fetch(`http://localhost:3000/toys/`)
  .then( res => res.json())
  .then( toysArray => toysArray)
  .catch( error => console.log(error.message));
}

function renderToyCollection(toysArray) {
  toysArray.forEach(toy => {
    renderToy(toy);
  });
}

function renderToy(toy) {
  // create element
  const toyDiv = document.createElement('div');
  toyDiv.className = 'card';

  //name
  const toyNameH2 = document.createElement('h2');
  toyNameH2.textContent = toy.name;

  //img
  const toyImg = document.createElement('img');
  toyImg.src = toy.image;
  toyImg.alt = toy.name + '-avatar';
  toyImg.className = 'toy-avatar';

  //p likes
  const toyLikesP = document.createElement('p');
  toyLikesP.textContent = toy.likes + ' Likes';

  //button
  const toyLikeButton = document.createElement('button');
  toyLikeButton.textContent = 'Like ❤️';
  toyLikeButton.id = toy.id;
  toyLikeButton.className = 'like-btn';
  toyLikeButton.addEventListener('click', () => addLike(toy, toyLikesP))

  // append elements to card
  toyDiv.append(toyNameH2, toyImg, toyLikesP, toyLikeButton);
  
  //append card to collection
  toyCollectionDiv.append(toyDiv);  
}

function createAddToyEvent() {
  addToyForm.addEventListener('submit', e => {
    e.preventDefault();
    nameInput = e.target.querySelector('input[name="name"]').value;
    imageInput = e.target.querySelector('input[name="image"]').value;

    fetch(`http://localhost:3000/toys`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json"
        },
        body: JSON.stringify({
            name: nameInput,
            image: imageInput,
            likes: 0
        })
    })
    .then( res => res.json())
    .then( toy => renderToy(toy))
    .catch( error => console.log(error.message));

    addToyForm.reset();
  })
}

function addLike(toy, toyLikesP) {
  fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: "PATCH",
      headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
      },
      body: JSON.stringify({
          likes: ++toy.likes
      })
  })
  .then( res => res.json())
  .then( toy => toyLikesP.textContent = `${toy.likes} Likes`)
  .catch( error => console.log(error.message));
}

//#endregion
