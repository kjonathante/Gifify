let topics=["United States", "Indonesia", "Brazil", "Japan"];

for (let val of topics) {
  // btn = $('<button>').text( val );
  // $('#btn_div').append( btn );
  createButton( val );
}

favoriteGifs();


function favoriteGifs() {
  //use localStorage to implement favorites
  let arr;
  for ( let i = 0, len = localStorage.length; i < len; ++i ) {
    console.log(  localStorage.key( i ) );
    arr.push( localStorage.key( i ) );
  }

  if (!arr) return; // short circuit. there is no favorites

  const ids = arr.join(',');
  const gifByIDEndPoint = 'https://api.giphy.com/v1/gifs'
  const apiKey = '53oJ4FxBUFiyz17NiydseLl7lRaUAiyd';
  const url = gifByIDEndPoint + '?' + $.param({
    api_key: apiKey,
    ids: ids
  });
  
  $.ajax({
    url: url
  })
  .then( function(res) {

    $('#favorites').empty();
    appendGifs( res.data, '#favorites');

  });
}






// Search Giphy when a button is click
$(document).on('click', '#btn_div button', function(){
  const searchEndPoint = 'https://api.giphy.com/v1/gifs/search'
  const apiKey = '53oJ4FxBUFiyz17NiydseLl7lRaUAiyd';
  const keyword = $(this).text();

  // Retrieve object literal using .data()
  const data = $('#btn_div').data();
  // get the previous offset and add the previous count if the same button is click
  let offset = 0;
  if ((data) && (data.keyword == keyword)) {
    offset = data.offset + data.count;
  }

  // contruct the url needed for this endpoint
  const url = searchEndPoint + '?' + $.param({
    api_key: apiKey,
    q: encodeURI( keyword ),
    limit: 10,
    offset: offset,
    lang: "en"
  });
  console.log(url);

  // $.each( $('#btn_div').data(), function(key,val) {
  //   console.log( key, val)
  // });

  $.ajax({
    url: url
  })
  .then( function(res) {
    if ( res.pagination.offset == 0) {
      $('#main').empty();
    }
    appendGifs( res.data, '#main' );
    $('#btn_div').data({
      keyword: keyword,
      totalCount: res.pagination.total_count,
      count: res.pagination.count,
      offset: res.pagination.offset
    });
  });
});

function appendGifs( data, target ) {
  //<img src="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif" 
  //     data-still="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif" 
  //     data-animate="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200.gif" 
  //     data-state="still" 
  //     class="gif">

  for (let val of data) {
    let id = val.id;
    let rating = val.rating;
    let stillURL = val.images.fixed_height_small_still.url;
    let animateURL = val.images.fixed_height_small.url;
    let width = parseInt( val.images.fixed_height_small.width );
    
    width =  (width < 100) ? 100 : width + 12;

    let $rating = $('<div>').text( 'Rating: ' + rating );
    //let $favButton = $('<div>').addClass('fav').text('fav').attr('data-id', id);
    //$rating.append( $favButton );

    let $imgDiv = $('<div>').addClass( 'img-holder' ).css({ width: width });
    let $img = $('<img>').attr({
      'src': stillURL,
      'data-still': stillURL,
      'data-animate': animateURL,
      'data-state': 'still',
      'class': 'gif'
    });

    $imgDiv.append( $img, $rating );
    //$imgDiv.append( $favButton );
    $(target).append( $imgDiv );
  }
}

$('#search').on('click', function(evt) {
  evt.preventDefault();
  let keyword = $('#query').val().trim();
  if ( keyword ) {
    topics.push( keyword );
    createButton( keyword );
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

$(document).on('click', '.fav', function() {
  console.log( this );
  let id = $( this ).attr( "data-id");
  console.log( id );

  localStorage.setItem( id, id);
});

function createButton( str ) {
  const btn = $('<button>').text( str );
  $('#btn_div').append( btn );
}