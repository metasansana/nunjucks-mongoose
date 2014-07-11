/**
 * MongooseExtenstion is a nunjucks extension that allows as to call
 * methods defined on mongoose models from within templates.
 * Usage:
 *
 *  {% mongoose model='product',bind=product,create={},chain=[{m:'findOne', a:{sku:12345}},
 *  {m:'limit',a:1}] %}
 * @class MongooseExtenstion
 * @param {String} register The tag name for this extension.
 * @param {Object} mongoose The mongoose object.
 * @constructor
 *
 */
module.exports = function MongooseExtenstion(register, mongoose) {

	var self = {};


	var isArray = function(value) {

		return (value && typeof value == 'object' && typeof value.length == 'number' &&
			toString.call(value) == '[object Array]') || false;

	};

	var toArray = function(o) {
		if (!isArray(o))
			return [o];
		return o;
	};


	self.tags = [register || 'mongoose'];

	self.parse = function(parser, nodes, lexer) {
		// get the tag token
		var tok = parser.nextToken();

		// parse the args and move after the block end. passing true
		// as the second arg is required if there are no parentheses
		var args = parser.parseSignature(null, true);

		parser.advanceAfterBlockEnd(tok.value);


		return new nodes.CallExtensionAsync(self, 'run', args, []);
	};

	self.run = function(env, params) {

		var final = function(err, result) {

			if (err)
				return cb(err, null);

			params.bind = params.bind || "results";
			env.ctx[params.bind] = result;
			cb(null, null);

		};

		var cb = arguments[arguments.length - 1];

		var model = mongoose.model(params.model);

		if (params.create)
			model = new model(params.create);

		if (!isArray(params.chain)) {
			//assume it is an object for now
			model[params.chain.m].
			apply(model, toArray(params.chain.a).push(final));



		} else {

			var target = model;
			var next;
			while (params.chain.length !== 0) {

				next = params.chain.shift();
				target = target[next.m].apply(target, toArray(next.a));

			}
			target.exec(final);

		}


	};




	return self;


};
