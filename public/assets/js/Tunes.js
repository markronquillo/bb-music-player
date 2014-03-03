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
	window.Albums = Backbone.Collection.extend({
		model: Album,
		url: '/albums'
	});

	window.library = new Albums();



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

	window.LibraryAlbumView = AlbumView.extend({

	});

	window.LibraryView = Backbone.View.extend({
		tagName: 'section',
		className: 'library',


		initialize: function() {
			_.bindAll(this, 'render');
			this.template = _.template( $('#library-template').html() );
			this.collection.fetch({ reset: true }); // need to pass reset true to fire reset 1.0
			this.collection.bind('reset', this.render);
		},

		render: function() {
			var $albums, 
				collection = this.collection;

			$(this.el).html(this.template({}));
			$albums = this.$('.albums'); // search within the current element for this view
			collection.each( function(album) {
				var view = new LibraryAlbumView({
					model: album,
					collection: collection
				});
				$albums.append(view.render().el);
			});

			return this;
		}
	});

	window.BackboneTunes = Backbone.Router.extend( {
		routes: {
			'': 'home',
			'blank': 'blank'
		},

		initialize: function() {
			// should instantiate root level view
			this.libraryView = new LibraryView({
				collection: window.library
			});
			this.$container = $('.container');
		},

		home: function() {
			this.$container.empty();
			this.$container.append( this.libraryView.render().el );
		},

		blank: function() {
			this.$container.empty();
			this.$container.html('blank');
		}
	});

	$( function() {
		window.App = new BackboneTunes();
		Backbone.history.start(); // {pushState: true}

	});

})(jQuery);