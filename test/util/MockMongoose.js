/**
 * MockMongoose
 * @class MockMongoose
 *
 * @constructor
 *
 */
module.exports = function MockMongoose() {


	/**
	 * model mocks the mongoose.model method.
	 *
	 * @method model
	 * @param {String} name
	 * @return
	 *
	 */
	this.model = function(name) {

            return new Mock();


	};




};

var Mock = function() {


	/**
	 * find
	 *
	 * @method find
	 * params
	 * @return
	 *
	 */
	this.find = function() {



	};

	/**
	 * findOne
	 * @method findOne
	 * params
	 * @return
	 *
	 */
	this.findOne = function(o) {

		return {

			exec: function(cb) {
				if (o)
					cb(null, o);

				cb(null, {
					name: 'Mock Name'
				});

			}

		};

	};


	/**
	 * limit
	 *
	 * @method limit
	 * params
	 * @return
	 *
	 */
	this.limit = function() {



	};


	/**
	 * where
	 *
	 * @method where
	 * params
	 * @return
	 *
	 */
	this.where = function() {



	};

	/**
	 * exec
	 *
	 * @method exec
	 * @param {Function} cb
	 * @return
	 *
	 */
	this.exec = function(cb) {

		if (one) {
			if (!data)
				data = {
					name: 'Mock Name'
				};
			cb(null, data);

		}


	};






};
