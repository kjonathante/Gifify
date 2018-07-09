let topics=["United States", "Indonesia", "Brazil", "Japan"];

for (let val of topics) {
  // btn = $('<button>').text( val );
  // $('#btn_div').append( btn );
  createButton( val );
}

favoriteGifs();


function favoriteGifs() {
  //use localStorage to implement favorites
  let arr=[];
  for ( let i = 0, len = localStorage.length; i < len; ++i ) {
    console.log(  localStorage.key( i ) );
    arr.push( localStorage.key( i ) );
  }

  if (arr.length==0) return; // short circuit. there is no favorites

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






// Search Giphy when a .button is click
$(document).on('click', '#btn_div .button', function(){
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
  //console.log(url);

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
    appendGifs( res.data, '#main', true );
    $('#btn_div').data({
      keyword: keyword,
      totalCount: res.pagination.total_count,
      count: res.pagination.count,
      offset: res.pagination.offset
    });
  });
});

function appendGifs( data, target, addFav ) {
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
    
    width =  (width < 120) ? 120 : width + 10;

    let $rating = $('<div>').text( 'Rating: ' + rating ).addClass('rating-div');
    let $favButton = $('<i>').attr('data-id', id).addClass( (addFav) ? 'fav fa fa-thumbs-o-up' : 'del fa fa-trash-o' );
    let $download = $('<i>').attr('data-url', stillURL).addClass('download fa fa-download');
//    (addFav) ? $('<i>')addClass('fav fa fa-thumbs-o-up') : $('<i>').addClass( "del fa fa-trash-o").attr('data-id', id) ;
    $rating.append( $favButton, $download );

    let $imgDiv = $('<div>').addClass( 'img-holder' ).css({ width: width });
    let $img = $('<img>').attr({
      'src': stillURL,
      'data-still': stillURL,
      'data-animate': animateURL,
      'data-state': 'still',
      'class': 'gif'
    });

    $imgDiv.append( $img, $rating );
    $(target).append( $imgDiv );
  }
}

// create button clicked 
$('#create-btn').on('click', function(evt) {
  evt.preventDefault();
  let keyword = $('#keyword').val().trim();
  if ( keyword ) {
    topics.push( keyword );
    createButton( keyword );
    $('#keyword').val('');
  }
});

// still or animate toggle
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

// thumbs up clicked, add to favorites
$(document).on('click', '.fav', function() {
  console.log( this );
  let id = $( this ).attr( "data-id");

  localStorage.setItem( id, id);
  favoriteGifs();
});


// trash clicked, remopve from favorites
$(document).on('click', '.del', function() {
  console.log( this );
  let id$ = $( this )
  let id = id$.attr( "data-id");

  localStorage.removeItem( id );
  id$.parent().parent().remove();
});

// download clicked
$(document).on('click', '.download', function() {
  let url = $(this).attr('data-url');
  let query = `https://query.yahooapis.com/v1/public/yql?q=select * from data.uri where url="${url}"&format=json&callback=`;

  console.log( encodeURI( query) );

  let a = document.createElement("a");
  a.download = `xxx.gif`;

  fetch(query).then(response => response.json())
  .then(({query:{results:{url}}}) => {
    a.href = url;
    document.body.appendChild(a);
    a.click();
  })
  .catch(err => console.log(err));

});

// tab selection
$(document).on('click', '.tabs', function() {
  //console.log($(this).next());
});

function createButton( str ) {
  const btn = $('<div>').text( str ).addClass('button blue');
  $('#btn_div').append( btn );
}