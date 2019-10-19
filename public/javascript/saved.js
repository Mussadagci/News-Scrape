/*  global bootbox */
$(document).ready(function(){
    // Getting a refernce to the article container div we will be rendering all articles inside of 
    var articleContainer = $(".article-container");
    // Adding event listeners for dynamically generated buttons for deleting articles, 
    // pulling up article notes, saving aricle notes, and deleting article notes.
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);
    // initPage kicks everything of when the apge is loaded 
    initPage();
    function initPage() {
        // Empty the article container, run an AJAX request for any saved haeadlines
        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data){
            // if we have headlinges, render them to the page
            if (data && data.length){
                renderArticles(data);

            }else {
                // otherwise render a message explaing we have no articles 
                renderEmpty();
            }

        });
    }
    function renderArticles(articles) {
        // this function handles appending HTML containing our article data to the page
        // we are passed an array of JSON containing all available articles in our database
        var articlePanels = [];
        // we pass each article JSON object to the createPanel function which returns a bootsrap
        // panel with our article data inside 
        for (var i = 0; i < articles. length; i++){
            articlePanels.push(creatPanel(articles[i]));

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
        }
        // once we have all of the HTML for the articles stored in our articlePanels array, 
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
        // this function handles rendering note list items to our notes model 
        // Setting up an array of notes to render after finished 
        // Also setting up a currentNote variable to temporarily store each note
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length){
            // if we have no notes, just display a message explaing this
            currentNote = {
           }   }
            
        
    
    
    
