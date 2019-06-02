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
        let newElement = $('<li><button>' + cardname + '</button></li>');
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

    function showDetails(index) {
        $("#loading").css("visibility", "visible");
        $("#loading").css("opacity", "0.7");
        loadDetails(index);
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
            modalClass.showModal(response[item]);
            setTimeout(function () { document.getElementById("loading").style.visibility = "hidden"; }, 50);
        });

    }

    function loadImage(item) {
        let imgUrl = 'https://art.hearthstonejson.com/v1/render/latest/enUS/512x/' + item.id + '.png';
        $('.img-container').html('<img id="the_image" alt="Photo of ' + item.name + '" onload="setTimeout(function () { $(\'#loading\').css(\'visibility\', \'hidden\'); $(\'#loading\').css(\'\', \'0\'); }, 100)" src="' + imgUrl + '" /><button id="getInfo" onclick="cardRepository.showDetails('+item.index+')";>click for details</button>');
    }

    return {
        add: add,
        addListItem: addListItem,
        getAll: getAll,
        showDetails: showDetails,
        showImage: showImage,
        loadList: loadList,
        loadDetails: loadDetails,
        loadImage: loadImage
    };
})();

//Modal IIFE
let modalClass = (function () {
    let modalContainer = $('#modalContainer');

    function showModal(cardObject) {
        modalContainer.empty();
        
        let newModal = $('<div id="newModal" class="modal"><div id="modalName">'+ cardObject.name +'</div><div id="modalFlavor">'+cardObject.flavor+'</div></div>');
        $('#newModal').addClass('modal');

        let newModalClose = $('<button id="newModalClose">Close</button>');
        $('#newModalClose').addClass('modal-close');

        modalContainer.append(newModal);
        modalContainer.append(newModalClose);

        $.each(cardObject, function (i) {
            let newElement = $('<div id="modal_' + i + '" class="modal_info"><span class="keys">' + i + ":</span> " + cardObject[i] + '</div>');
            if (i != 'name' && i != 'flavor' && i!= 'playRequirements')
                $('#newModal').append(newElement);
        });

        modalContainer.addClass('is-visible');

    }

    function hideModal() {
        modalContainer.removeClass('is-visible');
    }

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modalContainer.hasClass('is-visible')) {
            hideModal();
        }
    });

    modalContainer.on('click', (e) => {
        let t = e.target;
        if (t.id === 'modalContainer' || t.id === 'newModalClose') {
            hideModal();
        }
    });


    return {
        showModal: showModal,
        hideModal: hideModal
    }

})();


cardRepository.loadList().then(function () {
    cardRepository.getAll().forEach(function (card) {
        cardRepository.addListItem(card);
    });
});