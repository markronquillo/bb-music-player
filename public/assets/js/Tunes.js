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
		url: '/albums',
	});

	// Extends the collection albums
	window.Playlist = Albums.extend({
		isFirstAlbum: function(index) {
			return index == 0;	
		}, 

		isLastAlbum: function(index) {
			return this.models.length - 1 == index;
		}
	});

	// extends the model- Why?
	window.Player = Backbone.Model.extend({
		defaults: {
			'currentAlbumIndex': 0,
			'currentTrackIndex': 0,
			'state': 'stop'
		},

		initialize: function() {
			this.playlist = new Playlist(); // adds a playlist and initialize it
		},

		play: function() {
			this.set({'state': 'play'});
		},

		isPlaying: function() {
			return this.get('state') == "play";
		},

		isStopped: function() {
			return this.get("state") == "stop";
		},

		currentAlbum: function() {
			return this.playlist.models[ this.get("currentAlbumIndex") ];
		},

		currentTrackUrl: function() {
			return this.playlist.models[ this.get("currentAlbumIndex") ].
					get("tracks")[ this.get("currentTrackIndex") ].
					url;
		},

		// refactor you can use currentAlbum to minimize variables here
		nextTrack: function() { 
			var 	curTrackIndex = this.get("currentTrackIndex")
				,	curAlbumIndex = this.get("currentAlbumIndex")
				,	nextTrackIndex = curTrackIndex
				,	nextAlbumIndex = curAlbumIndex
				;

			// if last track	
			if (curTrackIndex == this.playlist.models[ curAlbumIndex ].get("tracks").length - 1) {
				nextTrackIndex = 0;

				// if last album
				if (curAlbumIndex == this.playlist.models.length - 1) {
					nextAlbumIndex = 0;
				} else {
					nextAlbumIndex = curAlbumIndex + 1;
				}
			} else {
				nextTrackIndex = curTrackIndex + 1;
			}
			this.set({ currentTrackIndex: nextTrackIndex, currentAlbumIndex: nextAlbumIndex });
		},

		prevTrack: function() {
			var 	curTrackIndex = this.get("currentTrackIndex")
				,	curAlbumIndex = this.get("currentAlbumIndex")
				,	nextTrackIndex = curTrackIndex
				,	nextAlbumIndex = curAlbumIndex
				;

			if (curTrackIndex == 0)	 {
				if (curAlbumIndex == 0)	{
					curAlbumIndex = this.playlist.models.length - 1; /// set to last album
				} else {
					curAlbumIndex -= 1;
				}
				curTrackIndex = this.playlist.models[ curAlbumIndex ].get("tracks").length - 1;
			} else {
				curTrackIndex -= 1;
			}
			this.set({ currentTrackIndex: curTrackIndex, currentAlbumIndex: curAlbumIndex });
		}

		// you can add logCurrentAlbumAndTrack to log the data structure

	});

	window.library = new Albums();
	window.player = new Player();

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


	// this is the view that displays a single album - title and artist name
	// extends teh albumview - why? 
	window.LibraryAlbumView = AlbumView.extend({
		events: {
			'click .queue.add': 'select' // current view
		},

		select: function() {
			this.collection.trigger("select", this.model);
		}
	});

	window.PlaylistAlbumView = AlbumView.extend({});

	window.PlaylistView = Backbone.View.extend({
		tagName: 'section',

		className: 'playlist',

		initialize: function(options) {
			this.options = options || {};

			_.bindAll(this, 'render'); // set context to render function
			this.template = _.template( $('#playlist-template').html());

			this.collection.bind('reset', this.render); // call render when collection value is reset

			this.player = this.options.player; // arguments passed on a view is accesible in the this.options
			this.library = this.options.library;
		},

		render: function() {
			$(this.el).html( this.template( this.player.toJSON() ));

			this.$('button.play').toggle( this.player.isStopped() ); // toggle true will show false will hide
			this.$('button.pause').toggle( this.player.isPlaying() ); // toggle true will show false will hide
			return this;
		}
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
			// collection contains the playlist -- array of albums
			// player contains player model
			// 
			this.playlistView = new PlaylistView({
				collection: window.player.playlist,
				player: window.player,
				library: window.library
			});

			// should instantiate root level view
			this.libraryView = new LibraryView({
				collection: window.library
			});
			this.$container = $('.container');
		},

		home: function() {
			this.$container.empty();
			this.$container.append( this.playlistView.render().el );
			this.$container.append( this.libraryView.render().el );
		},

		blank: function() {
			this.$container.empty();
			this.$container.html('blank');
		}
	});

})(jQuery);