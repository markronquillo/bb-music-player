( function($) {

	window.Album = Backbone.Model.extend({

		isFirstTrack: function(index) {
			return index == 0;
		},

		isLastTrack: function(index) {
			return index >= this.get('tracks').length - 1;		
		},

		trackUrlAtIndex: function(index) {
			if( this.get('tracks').length >= index) {
				return this.get('tracks')[index].url;
			}
			return null;
		}
	});
	// window.Album = Backbone.Model.extend({model: temp}); // backbone automatically adds a local model variable when you pass a model 
	windows.Albums = Backbone.Collectoin.extend({
		model: Album,
		url: '/albums'
	});

	window.AlbumView = Backbone.View.extend({
		tagName: 'li',
		className: 'album',

		initialize: function() {
			// _.bindAll(this, 'render'); // binds the object to render function 
			this.model.bind('change', this.render); // model set triggers change, this means if change is triggered render function will be called
			this.template = _.template( $('#album-template').html());
		},

		render: function() {
			var renderedContent = this.template(this.model.toJSON()); // binds the data in the template 
			$(this.el).html(renderedContent); // includes the rendered content in the views el (element tag)
			return this; // returns the context for chaining
		}
	});

})(jQuery);