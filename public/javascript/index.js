/* global bootbox */
$(document).ready(function() {
    // setting a reference to the article-container div where all the dynamic content will go
    // Adding event listeners to any dynamically generated "save article"
    // and "scrape new article buttons"
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

// once the page is ready, run the initpage funciton to kick things off
initPage();

function initPage(){
    // empty the article container, run AJAX request for any unsaved headlines
    articleContainer.empty();
    $.get("/api/headlines?saved=false")
    .then(function(data){
        // if we have headlines, render them to the page
        if (data && data.length) {
            renderArticles(data);
        }
        else {
            // otherwise render a message explaing we have no articles
            renderEmpty();
        }


});
}

function renderArticles(articles) {
    // this function handles appending HTML containing our article data to the page
    // we are passed an array of JSON contaiing all available articles in our database
    var articlePanels = [];
    // We pass each articles JSON object to the creatPanel function which return a bootstrap
    // panel with our article data inside 
    for (var i = 0; i < articles.length; i++) {
        articlePanels.push(createPanel(articles[i]));

    }
    // once we have all of the HTML for the articles stored in our articlePanels array, 
    // append them to the articlePanels container 
    articlePanels.append(articlePanels);
}
function createPanel(article){
    // this function takes in a single JSON object for an article/headline
    // It constructs a jQuery element containing all of the formatted HTML for the 
    // artcle panel
    var panel =
    $(["<div class='panel-default'>", 
    "<div class=='btn btn-success save'>",
    "Save Article",
    "</a>",
    "<h/3>",
    "</div>",
    "<div class='panel-body'>",
    article.summary,
    "</div>",
    "</div>"
].join(""));
// we attach the article's id to the jQuery element 
// we will use this when trying to figure out which aticle the user wants to save
panel.data("_id", article._id);
return panel;

}
function renderEmpty(){
    // This function renders some HTML to the page explaining we don't have any articles to view
    // using a joined array of HTML string data because it's easier to read/change than a concatenated string
    var emptyAlert =
    $(["<div calss='alert-warning text-center'>",
    "<h4>Uh oh. Looks like we don't have any new articles.</h4>",
    "</div>",
    "<div class='panel panel-default'>",
    "<div class='panel-heading text-center'>",
    "<h3>What Would You Like To Do?</h3>",
    "</div>",
    "<div class='panel-body text-center'>",
    "<h4><a class='class'scrape-new'>Try Scraping New Articles</a></h4>",
    "</div>"
].join(""));
// appending this data to the page
articleContainer.append(emptyAlert);
}
function renderNoteList(data) {
    //This function handles rendering note list items to our notes modal
    //Setting up an array of notes to render after finished 
    // Also setting up a currentNote variable to temporarily store each note
    var notesToRender = [];
    var currentNote; 
    if (!data.notes.length) {
        // if we have no notes, just display a message explaing this
        currentNote = [
            "<li class='list-group-item'>",
            "No notes for this article yet.",
            "</li>"
        ].join("");
        // store the note id on the delete button for easy access when trying to delete
        $(".note-container").append(notesToRender);
    }
    function  handleArticleDelete(){
        // this function hadles deleting articles/headlines
        // We grab the id of the article to delete from the panel element the delete button sits inside
        var articleToDelete = $(this).parents(".panel").data();
        // Using a delete method here just to be sematic since we are deleting an article/headline
        $.ajax({
            method: "DELETE",
            url: "/api/headlines/" + articleToDelete._id
        }).then(function(date){
            // if this works out, run initPage again which will rerender out list of saved articles
            if (data.ok) {
                initPage();
            }
        
        });
    }
}
function handleArticleNotes(){
    // This funciton hadles opending the notes modle nad displaying our notes 
    // we grab the id of the article to get notes for from the panel element the delete button sits inside
    var currentArticle = $(this).parents(".panel").data();
    // Grab any notes with this headline/article id
    $.get("/api/notes/" + currentArticle._id).then(function(data) {
        // Constructing our initial HTML to add to the notes modal
        var modalText = [
            "<div class='container-fluid text-center'>",
            "<h4>Notes For Article: ",
            currentArticle._id,
            "</h4>",
            "<hr />",
            "<ul class='list-group note-container'>",
            "</ul>",
            "<textarea palceholder='New Note' rows='4' cols='60'></textarea>",
            "<button class='btn btn-success save'>Save Note</button>",
            "</div>"
        ].join("");
        // Adding the formatted HTML to the note model 
        bootbox.dialog({
            message: modalText,
            closeButton: true
        });
        ///  Adding some infrmation aobut the article and article notes to the save button for easy access
        // when trying to add a new note
        $(".btn.save").data("article", noteData);
        // renderNoteList will populate the actual note HTML  inside of the model we just created/ opened
        renderNoteList(noteData);
    });
}
function handleNoteSave() {
    // this function handles what happens when a suer tries to save a new note for an article
    //  Setting a variable to hold some formatted data about our note. 
    // grabbing the note typed into the input box
    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();
    // If we actually have data typed into the note input field, format it
    // and post it to the "/api/notes" routo and ssend the formatted noteData as well
    if (newNote) {
        noteData = {
            _id: $(this).data("article")._id,
            noteText: newNote
        };
        $.post("/api/notes", noteData).then(function() {
            // when complete, close the model
            bootbox.hideAll();
        });

    
    }
}
function handleArticleSave() {
    // This function handles what happens when a user tries to save a new note for an article
    // Setting a variable to hold some formatted data about our note, 
    // rabbing the note typed into the input box
    var noteData;
    var newNote = $(".bootbox-box textarea").val().trim();
    // if we actually have data typed into the note input field, format it
    // and post it to the "/api/notes" route and send the formatted noteData as well
    if (newNote) {
        noteData = {
            _id: $(this).data("article")._id,
            noteText: newNote
        };
        $.post("/api/noted", noteData).then(function() {

        });
    }
}

function handleArticleSave() {
    // This function is triggered when the suer wants to save an article
    // when we rendered the article initially, we attatched a javascript object containing the headline id
    // to the element using the .data method. Here retrieve that.
    var articleToSave = $(this).parents(".panel").data();
    articleToSave.saved = true;
    // using a patch method to be samantic since this is an update to an existing record in our collection
    $.ajax({
        method: "PATCH",
        url: "/api/headlines",
        data: articleToSave
    })
    .then(function(data){
        // If successful, mangoose will send back an object containing a key of "ok" with the value of 1
        // (which cats to "true")
        if (data.ok){
            // run the initPage function again. This will reload the entire list of articles
            initPage();
        }
    });
}
 function handleArticleScrape() {
     // this function handles the user clicking any "scrape new article" buttons
     $.get("/api/fetch")
     .then(function(data){
         // if we are able to succesfully scrape the NYTIMES and compare the articles to those
         // already in our collection, re render the articles on the page
         // and let hte user know how many unique articles we are able to save
         initPage();
         bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
     });
 }

    });


