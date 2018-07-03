let topics=["United States", "Indonesia", "Brazil", "Japan"];

for (let val of topics) {
  // btn = $('<button>').text( val );
  // $('#btn_div').append( btn );
  createButton( val );
}


$(document).on('click', '#btn_div button', function(evt){
  console.log(this);

  const searchEndPoint = 'https://api.giphy.com/v1/gifs/search'
  const apiKey = '53oJ4FxBUFiyz17NiydseLl7lRaUAiyd';

  const url = searchEndPoint + '?' + $.param({
    api_key: apiKey,
    q: $(this).text(),
    limit: 10,
    lang: "en"
  });

  $.ajax({
    url: url
  })
  .then( function(res) {
    //<img src="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif" 
    //     data-still="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif" 
    //     data-animate="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200.gif" 
    //     data-state="still" 
    //     class="gif">
    $('#main').empty();

    for (let val of res.data) {
      let id = val.id;
      //let title = val.title;
      let rating = val.rating;
      let still = val.images.fixed_height_small_still.url;
      let animate = val.images.fixed_height_small.url;
      let width = val.images.fixed_height_small.width;
      
      width = parseInt(width) + 12;

      //let $title = $('<div>').text( title );
      let $rating = $('<p>').text( 'Rating: ' + rating );
      let $imgDiv = $('<div>').addClass( 'img-holder' ).css({ width: width });
      let $img = $('<img>').attr({
        src: still,
        "data-still": still,
        "data-animate": animate,
        "data-state": "still",
        class: "gif"
      });
      $imgDiv.append( $img, $rating );

      $('#main').append( $imgDiv );
      console.log(id);
      console.log(rating);
    }
    });
});

$('#search').on('click', function(evt) {
  evt.preventDefault();
  //console.log("preventDefault");
  let search = $('#query').val().trim();
  if ( search ) {
    topics.push( search );
    createButton( search );
    $('#query').val('');
  }
});

$(document).on('click', '.gif', function() {
  let img = $( this );

  if ( img.attr('data-state') == 'still' ) {
    img.attr({
      'src':        img.attr('data-animate'),
      'data-state': 'animate'
    });
  } else {
    img.attr({
      'src':        img.attr('data-still'),
      'data-state': 'still'
    });
  }
});

function createButton( str ) {
  const btn = $('<button>').text( str );
  $('#btn_div').append( btn );
}