(function(){
var pokemonRepository = (function(){
  var repository =[];
  var apiUrl = 'https://pokeapi.co/api/v2/pokemon/?limit=150';

  function getAll(){
    return repository;
  }

  function add(item){
    repository.push(item);
  }

  function loadList(){
    return $.ajax(apiUrl, {dataType: 'json'}).then(function(item){
      $.each(item.results, function(index, item){
        var pokemon = {
          name: item.name,
          detailsUrl: item.url
        }
        add(pokemon)
      })
      }).catch(function(e){
      console.error(e);
    });
  }

  function loadDetails(item){
    var url = item.detailsUrl;
    return $.ajax(url).then(function(details){
      item.imageUrl = details.sprites.front_default;
      item.height = details.height;
      item.types = details.types.map(function(pokemon) {
  return pokemon.type.name;
});
    }).catch(function(e){
      console.error(e);
    });
  }

  return {
    getAll: getAll,
    add: add,
    loadList: loadList,
    loadDetails: loadDetails
  };
})();

var $pokemonList = $('.pokemon-list')

function addListItem(pokemon){
  var listItem = $('<button type="button" class="pokemon-list_item list-group-item list-group-item-action" data-toggle="modal" data-target="#pokemon-modal"></button>');
  listItem.text(pokemon.name);
  $pokemonList.append(listItem);
  listItem.click(function() {
    showDetails(pokemon)
  });
}

//Pokemon Modal
function showDetails(pokemon){
  pokemonRepository.loadDetails(pokemon).then(function() {
    var modal = $('.modal-body');
    var name = $('.modal-title').text(pokemon.name);
    var height = $('<p class="pokemon-height"></p>').text('Height: ' + pokemon.height);
    var type = $('<p class="pokemon-type"></p>').text('Type: ' + pokemon.types);
    var image = $('<img class="pokemon-picture">');
    image.attr('src', pokemon.imageUrl);
    if(modal.children().length) {
      modal.children().remove();
    }
    modal.append(image)
         .append(height)
         .append(type);
  });
}

//Pokemon Search Section
$(document).ready(function(){
  $('#pokemon-search').on('keyup', function(){
    var value = $(this).val().toLowerCase();
    $('.pokemon-list_item').filter(function(){
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
    });
  });
});

pokemonRepository.loadList().then(function(){
  var pokemons = pokemonRepository.getAll();
  $.each(pokemons, function(index, pokemon){
        addListItem(pokemon);
  });
});
})();
