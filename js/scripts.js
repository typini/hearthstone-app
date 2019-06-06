//KEYARRAY is an array of required keys in a valid card object
const KEYARR = ['name', 'id', 'index'];

//IIFE = Immediately Invoked Function Expression
let cardRepository = (function () {
    let carddex = [];
    let apiUrl = 'https://api.hearthstonejson.com/v1/latest/enUS/cards.collectible.json';

    function add(card) {
        //verify input in an object
        if (typeof card === 'object') {
            //verify the object has all necessary keys
            let valid = true;
            KEYARR.forEach(function (key) {
                if (!card.hasOwnProperty(key))
                    valid = false;
            });
            if (valid)
                carddex.push(card);
            else
                console.warn("Card data is missing information.  Card not added.");
        } else {
            console.warn("Card of type " + (typeof card) + " was not added to the repository.");
        }
    }

    function addListItem(card) {
        let cardname = card.name;
        if (card.name.charAt(0) <= 'z' && card.name.charAt(0) >= 'a')
            cardname = card.name.charAt(0).toUpperCase() + card.name.slice(1);
        let newElement = $('<li><button class="list-group-item list-group-item-action">' + cardname + '</button></li>');
        $('.the_list').append(newElement);

        newElement.on('click', function (event) {
            showImage(card);
        });
    }

    function showImage(card) {
        $("#loading").css("visibility", "visible");
        $("#loading").css("opacity", "0.7");
        loadImage(card);
    }

    function getAll() {
        return carddex;
    }

    //Get the complete list of cards (primary key is called 'id')
    function loadList() {

        return $.ajax(apiUrl, { dataType: 'json' }).then(function (response) {
            return response;
        }).then(function (json) {
            let index_track = 0;
            json.forEach(function (i) {
                let card = {
                    name: i.name,
                    id: i.id,
                    index: index_track++
                };
                add(card);
            })
        });
    }

    function loadDetails(item) {
        let detailedObject = $.ajax(apiUrl, { dataType: 'json' }).then(function (response) {
            showModal(response[item]);
            setTimeout(function () { document.getElementById("loading").style.visibility = "hidden"; }, 50);
        });
    }

    function loadImage(item) {
        let imgUrl = 'https://art.hearthstonejson.com/v1/render/latest/enUS/512x/' + item.id + '.png';
        let imgElement = $('<img id="the_image" alt="Photo of ' + item.name + '" onload="setTimeout(function () { $(\'#loading\').css(\'visibility\', \'hidden\');}, 100)" src="' + imgUrl + '" />');
        let buttonElement = $('<button type="button" id="getInfo" class="btn btn-primary list-group-item list-group-item-action" data-toggle="modal" data-target="#cardModal" onclick="cardRepository.loadDetails(' + item.index + ')">click here for details</button>');
        $('.img_container').empty();
        $('.img_container').append(imgElement);
        $('.img_container').append(buttonElement);
    }

    function showModal(cardObject) {
        $('.modal-title').html($('<div id="modalName">' + cardObject.name + '</div> <div id="modalFlavor">' + cardObject.flavor + '</div>'));
        $('.modal-body').empty();

        $.each(cardObject, function (i) {
            let newElement = $('<div id="modal_' + i + '" class="modal_info"><span class="keys">' + i + ":</span> " + cardObject[i] + '</div>');
            if (i != 'name' && i != 'flavor' && i != 'playRequirements')
                $('.modal-body').append(newElement);
        });
    }

    return {
        add,
        addListItem,
        getAll,
        showImage,
        loadList,
        loadDetails,
        loadImage,
        showModal
    };
})();

cardRepository.loadList().then(function () {
    cardRepository.getAll().forEach(function (card) {
        cardRepository.addListItem(card);
    });
});