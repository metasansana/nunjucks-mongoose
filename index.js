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
module.exports = function MongooseExtenstion(mongoose, name) {

	this.tags = [name || 'get'];
	this.calls = [];

	this.parse = function(parser, nodes, lexer) {


		var calls = [];
		var childs = [];
		var args;

		// get the tag token
		var tok = parser.nextToken();
		childs.push(parser.parsePrimary());

		if (!parser.skipSymbol('from'))
			parser.fail('You must specify the model using the keyword \'from\'');
		childs.push(parser.parsePrimary());

		if (!parser.skipSymbol('using'))
			parser.fail('You must specify the first method called by using the keyword \'using\'!');

		childs.push(parser.parsePrimary());

		parser.skipSymbol('with');
		args = parser.parseSignature(null, true);

		calls.push({
			head: 0,
			offset: args.children.length + 1,
			next: args.children.length + 1
		});

		args.children.unshift.apply(args.children, childs);
		parser.advanceAfterBlockEnd(tok.value);

		var thenArgs;
		var tmp;
		var nextCall;
		var currentToken;


		while (true) {

			nextCall = {
				head: '',
				offset: '',
				next: ''
			};

			parser.parseUntilBlocks('then', 'done');

			if (parser.peekToken().value == 'done')
			//We are at the end, no more work to do.
				break;


			//Deal with the next then tag.

			//Save the token we are working with
			currentToken = parser.nextToken();

			//Grab the name of the method to be called.
			tmp = parser.parsePrimary();

			//Does this method come with arguments?
			if (parser.skipSymbol('with')) {

				//Then gooble them up and use them as the NodeList
				thenArgs = parser.parseSignature(null, true);
				thenArgs.children.unshift(tmp);

				args.children.push.apply(args.children, thenArgs.children);

				nextCall.offset = thenArgs.children.length;


			} else {


				nextCall.offset = 1;
				args.children.push(tmp);


			}
			nextCall.head = calls[calls.length - 1].next;
			nextCall.next = nextCall.head + nextCall.offset;
			calls.push(nextCall);

			parser.advanceAfterBlockEnd('then');

		}
		parser.advanceAfterBlockEnd();
		this.calls.push(calls);
		return new nodes.CallExtensionAsync(this, 'run', args);
	};

	this.run = function(context, bindName, modelName) {

		var cb = arguments[arguments.length - 1];
		var params = new Array(arguments.length - 3);
		var calls = this.calls.shift();

		for (var i = 3; i < arguments.length - 1; ++i) {
			params[i - 3] = arguments[i];
		}

		var model = mongoose.model(modelName);
		var target = model;
		var next;
		var method;
		var args;
		var src;
		calls.forEach(function(call) {

			args = null;
			src = params.slice();
			method = src[call.head];
			args = src.splice(call.head + 1, call.offset - 1);
			target = model[method].apply(target, args);


		});
		target.exec(function(err, data) {

			if (err) return cb(err, null);
			context.ctx[bindName] = data;
			cb(null, null);

		});



	};






};
