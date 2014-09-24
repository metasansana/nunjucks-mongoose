/**
 * MongooseExtension is a nunjucks extension that allows us to call
 * methods defined on mongoose models from within templates.
 *
 * Currently it only supports methods that will return the mongoose Query object.
 * Usage:
 *
 *  {% provide 'products' from 'Product' using 'find' %}
 *  {% then 'limit' with 10 %}
 *  {% done %}
 * @class MongooseExtenstion
 * @param {Object} mongoose The mongoose object.
 * @param {String} name The tag name to use in the templates.
 * @constructor
 *
 */
module.exports = function MongooseExtension(mongoose, name) {

	this.tags = [name || 'get'];

	this.parse = function(parser, nodes, lexer) {

		var parseWith = function(nodeList) {

			//If it has args, then grab that too.
			if (parser.skipSymbol('with')) {

				nodeList.addChild(parser.parsePrimary());

				while (true) {

					if (parser.peekToken().type == lexer.TOKEN_BLOCK_END)
						break;

					if (!parser.skip(lexer.TOKEN_COMMA))
						parser.fail('Expected comma!');

					nodeList.addChild(parser.parsePrimary());



				}
			}
		};


		var firstCall = new nodes.Array();
		var meta = new nodes.Array();
		var nodeList = new nodes.NodeList();

		// get the tag token
		var tok = parser.nextToken();

		//Get the bind variable name
		meta.addChild(parser.parsePrimary());

		if (!parser.skipSymbol('from'))
			parser.fail('You must specify the model using the keyword \'from\'');

		//Get the target model name.
		meta.addChild(parser.parsePrimary());

		if (!parser.skipSymbol('using'))
			parser.fail('You must specify the first method called by using the keyword \'using\'!');


		//Get the name of the first method to call.
		firstCall.addChild(parser.parsePrimary());

		parseWith(firstCall);

		parser.advanceAfterBlockEnd(tok.value);

		nodeList.addChild(meta);
		nodeList.addChild(firstCall);

		var nextList;

		while (true) {

			nextList = new nodes.Array();

			parser.parseUntilBlocks('then', 'done');

			if (parser.peekToken().value == 'done')
			//We are at the end, no more work to do.
				break;
			//Deal with the next then tag.

			//Select the next then token
			parser.nextToken();

			//Grab the name of the method to be called.
			nextList.addChild(parser.parsePrimary());

			parseWith(nextList);

			nodeList.addChild(nextList);

			parser.advanceAfterBlockEnd('then');

		}
		var newShit = new nodes.NodeList();
		parser.advanceAfterBlockEnd();
		return new nodes.CallExtensionAsync(this, 'run', nodeList, []);
	};

	this.run = function(context, meta) {

		var cb = arguments[arguments.length - 1];
		var calls = new Array(arguments.length - 2);

		for (var i = 2; i < arguments.length - 1; ++i) {
			calls[i] = arguments[i];
		}

		var target = mongoose.model(meta[1]);
		var method;

		calls.forEach(function(call) {
			method = call.shift();
			target = target[method].apply(target, call);
		});

		target.exec(function(err, data) {

			if (err) return cb(err, null);
			context.ctx[meta[0]] = data;
			cb(null, null);

		});



	};






};
