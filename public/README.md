Backbone Music Player Application
=================================

- Goal to be able to grasp basic backbone features 
- Deadline until friday.

To test Model View:
	1. Create a Model 
	2. Then pass the model to the a new view, call render form, the view should have a template and render function will use it and set it to the views el property.
	3. use view.el -- append to the page

_.bindAll - function = permanently associate metods with a specific object
	http://blog.bigbinary.com/2011/08/18/understanding-bind-and-bindall-in-backbone.html

	- bindAll uses bind and bind uses apply --
		apply lets us control the value of this when the function is invoked.
		.apply(context, arrayOfArgs)
		.call(context, arg1, arg2)

		_.bind - 

Jasmine: 
	describe is usually for class
	'it' is for method or use case

	