let topics=["United States", "Indonesia", "Brazil", "Japan"];

for (let val of topics) {
  // btn = $('<button>').text( val );
  // $('#btn_div').append( btn );
  createButton( val );
}

favoriteGifs();


function favoriteGifs() {
  let arr=[];
  for ( let i = 0, len = localStorage.length; i < len; ++i ) {
    console.log(  localStorage.key( i ) );
    arr.push( localStorage.key( i ) );
  }

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
      let $favButton = $('<span>').addClass('fav').text('fav').attr({
        "data-id": id
      });
      $rating.append( $favButton );

      let $imgDiv = $('<div>').addClass( 'img-holder' ).css({ width: width });
      let $img = $('<img>').attr({
        src: still,
        "data-still": still,
        "data-animate": animate,
        "data-state": "still",
        class: "gif"
      });
      $imgDiv.append( $img, $rating );

      $('#favorites').append( $imgDiv );
    }


  });
}







$(document).on('click', '#btn_div button', function(){

  const searchEndPoint = 'https://api.giphy.com/v1/gifs/search'
  const apiKey = '53oJ4FxBUFiyz17NiydseLl7lRaUAiyd';
  const keyword = $(this).text();

  const data = $('#btn_div').data();
  let offset = 0;
  if ((data) && (data.keyword == keyword)) {
    offset = data.offset + data.count;
  }

  const url = searchEndPoint + '?' + $.param({
    api_key: apiKey,
    q: encodeURI( keyword ),
    limit: 10,
    offset: offset,
    lang: "en"
  });

  $.each( $('#btn_div').data(), function(key,val) {
    console.log( key, val)
  });

  $.ajax({
    url: url
  })
  .then( function(res) {
    appendGifs( res );
    $('#btn_div').data({
      keyword: keyword,
      totalCount: res.pagination.total_count,
      count: res.pagination.count,
      offset: res.pagination.offset
    });
  });
});

function appendGifs( res ) {
  //<img src="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif" 
  //     data-still="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200_s.gif" 
  //     data-animate="https://media1.giphy.com/media/3o85xkQpyMlnBkpB9C/200.gif" 
  //     data-state="still" 
  //     class="gif">
  if ( res.pagination.offset == 0) {
    $('#main').empty();
  }

  for (let val of res.data) {
    let id = val.id;
    let rating = val.rating;
    let stillURL = val.images.fixed_height_small_still.url;
    let animateURL = val.images.fixed_height_small.url;
    let width = parseInt( val.images.fixed_height_small.width );
    
    width =  (width < 100) ? 100 : width + 12;

    let $rating = $('<div>').text( 'Rating: ' + rating );
    let $favButton = $('<div>').addClass('fav').text('fav').attr('data-id', id);
    //$rating.append( $favButton );

    let $imgDiv = $('<div>').addClass( 'img-holder' ).css({ width: width });
    let $img = $('<img>').attr({
      'src': stillURL,
      'data-still': stillURL,
      'data-animate': animateURL,
      'data-state': 'still',
      'class': 'gif'
    });

    $imgDiv.append( $img, $rating, $favButton );
    $('#main').append( $imgDiv );
  }
}

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