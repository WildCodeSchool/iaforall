// duplicate sentence : placer la phrase cliquée dans l'input près du bouton 'Ajouter'
function DuplicateSentence(){
  let clickedButtonId = $(this).attr('id').substr(9);
  console.log('duplicate:', clickedButtonId);
  let selectedSentence = $('#sentencetext'+clickedButtonId)[0].firstChild.data;
  // console.log(selectedSentence);
  $('#sentence').val(selectedSentence);
}



// delete sur une phrase : requête http en delete, puis effacer la ligne du tableau dans la page
function DeleteSentence(){
  let clickedButtonId = $(this).attr('id').substr(14);
  console.log(clickedButtonId);
  $.ajax({
    url: "/admin/sentence",
    method: "DELETE",
    data: {id : clickedButtonId},
  })
  .done(function(){
    console.log('to delete: ', clickedButtonId);
    // console.log(msg);
    $('#sentence'+clickedButtonId).remove();
  })
  .fail(function(){
    console.log('not deleted: there was an error');
  });
};

// générer la liste de mots dans la div "Ici tags de mots"
function StartTagging(){

  // trouver l'id de la phrase cliquée
  let clickedButtonId = $(this).attr('id').substr(3);
  console.log('Tag des mots listés : phrase ', clickedButtonId);

  // split de la phrase sélectionnée
  let selectedSentence = $('#sentencetext'+clickedButtonId)[0].firstChild.data.split(' ');
  // console.log(selectedSentence);
  // console.log($('#sentencetag').html());

  // get pour obtenir la liste des tags
  $.get('/admin/tag', function(data){
    // console.log(data);
    // $('#wordsToTag').empty();

    //changer le texte du bouton
    $('#sentencetag').html('Tag des mots listés : phrase '+clickedButtonId);

    // effacer le contenu de la div "Ici tags de mots"
    $('#wordsToTag').children().remove();

    // Boucler sur la liste de mots
    for (let i = 0; i < selectedSentence.length; i++) {

      // boucler sur les tags
      $('#wordsToTag').append('<tr><td id="word'+i+'">'+selectedSentence[i]+'<td><select id="select'+i+'"><option value="">""</option></select></td></tr>');
      for (let j = 0; j < data.Tags.length; j++) {
        // console.log(data.Tags[j]);
        $('#select'+i).append('<option value="'+data.Tags[j].id+'">'+data.Tags[j].text+'</option>')
      }
    };
  });
  // }
  // selectedSentence.map( word => $('#wordsToTag').append('<tr><td>'+word+'</td><td><select><option value="'+'tag1'+'">'+'Tag1'+'</option></select></td></tr>'))
};

// Add a sentence
$('#addSentence').click(function(){
  $.post('/admin/sentence',
  {
    sentence : $('#sentence').val(),
    type : $('#sentenceType').val()
  },
  function(data, status){
    console.log(data);
    if (!data.error){
      $('#sentence').val('');
      $('#servermessage').empty();
      $('#sentences').append('<tr id="sentence'+data.sentence.id+'"><td id="sentencetext'+data.sentence.id+'">'+data.sentence.text+'</td><td>'+data.sentence.type+'</td><td>'+data.sentence.id+'</td><td><button id=delete'+data.sentence.id+'>Supprimer</button><button id=duplicate'+data.sentence.id+'>Dupliquer</button><button id="tag'+data.sentence.id+'">Tag sur les mots</button></td></tr>');
      // $("#sentences").on("click", "#tag", StartTagging);
      $('#deletesentence'+data.sentence.id).click(DeleteSentence);
      $('#duplicate'+data.sentence.id).click(DuplicateSentence);
      $('#tag'+data.sentence.id).click(StartTagging);
      console.log('');
    } else {
      // $('#servermessage').text(data.serverMessage);
      $('#servermessage').append(data.serverMessage).append('. Connection status: '+status);
    }
  });
});


// Delete a sentence
$("button[id^='deletesentence']").click(DeleteSentence);


// Duplicate a sentence
$("button[id^='duplicate']").click(DuplicateSentence);


// Start tagging words in a sentence
$("button[id^='tag']").click(StartTagging);

// Post the list of tags
$("button[id^='sentencetag']").click(function(){

  // console.log('tagging');
  let clickedButtonId = $(this)[0].innerHTML.substr(29);
  // console.log(clickedButtonId);

  // console.log($('#wordsToTag'));
  let mykeywords = [];
  let wordsToTag = $('#wordsToTag').children();
  // console.log(wordsToTag.children[0].children[0].innerHTML);

  // let counter = 0;
  for (let i = 0; i < wordsToTag.length; i++) {
    if ($('#select'+i).val().length > 0){

      // mykeywords[counter] =
      // {
      //   'text' : $('#word'+i).html(),
      //   'TagId' : $('#select'+i).val()
      // };
      // counter++;
      mykeywords.push(
        {
          'text' : $('#word'+i).html(),
          'TagId' : $('#select'+i).val()
        }
      );
    }
  }

  // console.log('mykeywords: ', mykeywords);
  // let datatopost = {tags : [{word:'test1',tag:'time'},{word:'toto1',tag:'place'}]};

  if (mykeywords.length > 0){
    let datatopost = JSON.stringify({keywords : mykeywords});
    // let datatopost = {tags : mykeywords};
    console.log(datatopost);
    $.ajax({
      method : 'POST',
      url : '/admin/keyword',
      data : datatopost,
      // processData : false,
      contentType: "application/json; charset=utf-8",
      dataType : 'json'
    })
    .done(data => {
      console.log('data: ', data);
    });
    //
    // $.post('/admin/keyword', datatopost, function(resdata, status){
    //   console.log(resdata, status);
    //   if (!resdata.error){
    //     // $('#sentence').val('');
    //     // $('#servermessage').empty();
    //     // $('#sentences').append('<tr><td id="sentence'+data.sentence.id+'">'+data.sentence.text+'</td><td>'+data.sentence.type+'</td><td>'+data.sentence.id+'</td><td><button id=delete'+data.sentence.id+'>Delete</button><button id=modify'+data.sentence.id+'>Duplicate</button><button id="tag">Tag words</button></td></tr>');
    //     // console.log("tag"+data.sentence.id);
    //   } else {
    //     // $('#servermessage').text(data.serverMessage);
    //     // $('#servermessage').append(data.serverMessage).append('. Connection status: '+status);
    //   }
    // });

  };
});
