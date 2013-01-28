var Router = require('../');

var Router = Router.extend({
	routes: {
		"/": "Index",
		"/user/:id": "UserWithId",
		"/user/:id?": "UserWithoutId",
		"/user/:id?/edit": "UserEdit",
		"/user/1:id/edit": "UserEditWithId",
		"*": "Default"
	},

	Index: function() {
		console.log('index');
	},

	UserWithId: function(id) {

		console.log('UserWithId', id);
	},

	UserWithoutId: function(id) {

		console.log('UserWithoutId', id);
	},

	UserEdit: function(id) {

		console.log('UserEdit', id);
	},

	UserEditWithId: function(id) {

		console.log('UserEditWithId', id);
	},

	Default: function() {

		console.log('Default');
	}
});

// var router = new Router({
// 	routes: {
// 		"/user/:id": "UserWithId",
// 		"/user/:id?": "UserWithoutId",
// 		"/user/:id?/edit": "UserEdit",
// 		"/user/1:id/edit": "UserEditWithId",
// 		"*": "Default"
// 	},
// });

var router = new Router();

console.log(router._routes);

// router.navigate({url: "/"});

router.navigate("/");
router.navigate("/user");
router.navigate("/user/1");
router.navigate("/user/edit/");
router.navigate("/user/1/edit/");
router.navigate("/default/");

router.navigate("asd")