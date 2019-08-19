var pokemonRepository = (function() {
  var repository = [];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function getAll() {
    return repository;
  }

  function add(pokemon) {
  	if (typeof(pokemon) === 'object') {
//  		if (isTrueEqualKeysObj (pokemonRepository.getAll()[0], pokemon)) {
  			repository.push(pokemon);
//  		} else {
//  			console.log('Please ensure your pokemon has the correct format: {name: (string), height: (number), types: [array of strings]}');
//  		}
  	} else {
  		console.log('Please add an object');
  	}
  }

  function addListItem(pokemonObject) {
    var $pokemonList = document.querySelector('.pokemon-list');
    var $newListItem = document.createElement('li');
    var $newButton = document.createElement('button');

    $newListItem.setAttribute('class', 'pokemon-list__item');
    $newButton.setAttribute('class', 'list-item__button');
    $newListItem.appendChild($newButton);
    $pokemonList.appendChild($newListItem);
    $newButton.innerText = pokemonObject.name;
    $newButton.addEventListener('click', function(event) {
        showDetails(pokemonObject);
      });
    }

    function loadList() {
    		return fetch(apiUrl).then(function (response) {
    			return response.json();
    		}).then(function(json) {
    			json.results.forEach(function (item) {
    				var pokemon = {
    					name: item.name,
    					detailsUrl: item.url
    				};
    				add(pokemon);
    			});
    		}).catch(function (e) {
    			console.error(e);
    		})
    	}

    	function loadDetails(item) {
    		var url = item.detailsUrl;
    		return fetch(url).then(function (response) {
    			return response.json();
    		}).then(function (details) {
    			item.imageUrl = details.sprites.front_default;
    			item.height = details.height;
    			item.types = Object.keys(details.types);
    	}).catch(function (e) {
    		console.error(e);
    	});
    	}




/* MODAL BEGINNING*/

  var $modalContainer = document.querySelector('#modal-container');

    function showModal(pokemonObject) {
        var $modalContainer = document.querySelector('#modal-container');

      //Clearing all contents of $modal-container
        $modalContainer.innerHTML = '';

      //Creating <div class='modal'></div>
        var modal = document.createElement('div');
        modal.classList.add('modal');

      //Creating <button class='modal-close'>Close</button>
        var closeButtonElement = document.createElement('button');
        closeButtonElement.classList.add('modal-close');
        closeButtonElement.innerText = 'Close';

      //Event listening for the 'Close' button to be clicked and will execute hideModal function
        closeButtonElement.addEventListener('click', hideModal);

      //Creating <h1>Pokemon Name</h1>
        var nameElement = document.createElement('h1');
        nameElement.innerText = pokemonObject.name;

      //Creating IMG of Pokemon inside MODAL
        var imageElement = document.createElement('img');
        imageElement.classList.add('modal-img');
        imageElement.setAttribute('src', pokemonObject.imageUrl);

      //Creating <p>modalText</p>
        var heightElement = document.createElement('p');
        heightElement.innerText = 'height : ' + pokemonObject.height;

      //Appending Close-Button, Title-Element, Content-Element, and ModalContainer
        modal.appendChild(closeButtonElement);
        modal.appendChild(nameElement);
        modal.appendChild(imageElement);
        modal.appendChild(heightElement);
        $modalContainer.appendChild(modal);

      //#modal-ontainer id has the class 'is-visible' added
        $modalContainer.classList.add('is-visible');
      }

      //HTML items with the id #show-modal have their modalTitle and modalText changed to 'Modal title', 'This is the modal content!'.
  /*      document.querySelector('#show-modal').addEventListener('click', () => {
        showModal(pokemon);
      });

*/
      //Removes is-visible class from #modal-container id
      function hideModal() {
        var $modalContainer = document.querySelector('#modal-container');
        $modalContainer.classList.remove('is-visible');
      }

      //Escape button will execute hideModal
        window.addEventListener('keydown', (e) => {
        var $modalContainer = document.querySelector('#modal-container');
        if (e.key === 'Escape' && $modalContainer.classList.contains('is-visible')) {
          hideModal();
        }
      });

      //Clicking outside the modal executes hideModal
        $modalContainer.addEventListener('click', (e) => {
        var target = e.target;
        if (target === $modalContainer) {
          hideModal();
        }
      });

/* MODAL END*/

function showDetails(pokemonObject) {
    pokemonRepository.loadDetails(pokemonObject).then(function () {
  pokemonRepository.showModal(pokemonObject);   });
}


  return {
    getAll: getAll,
    add: add,
    addListItem: addListItem,
    loadList: loadList,
    loadDetails: loadDetails,
    showModal: showModal,
    hideModal: hideModal
  };
})();
/* {
  if (Object.keys(obj1).length === Object.keys(obj2).length)
    var i = 0
    while (i < Object.keys(obj1).length && (Object.keys(obj1)[i] === Object.keys(obj2)[i])) {
      i++;
    }
}
*/
var allPokemon = pokemonRepository.getAll();

pokemonRepository.loadList().then(function() {
allPokemon.forEach(function(pokemonObject) {
  pokemonRepository.addListItem(pokemonObject);
});
});
