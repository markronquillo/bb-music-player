$( function() {
	album = new Album({title: 'Test', artist: 'Me', tracks: [ {title: 'yo'}, {title: 'ye'}] });
	albumView = new AlbumView({model: album})
	albumView.render();
	// $('.container').html( albumView.el );S
	window.App = new BackboneTunes();
	Backbone.history.start(); // {pushState: true}
});