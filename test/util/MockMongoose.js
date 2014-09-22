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

	var one = false;
        var self = this;

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

		return self;


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


		return self;

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

		var data = {
			name: 'Mock Name'
		};

		if (one) {
			cb(null, data);

		} else {

			cb(null, [data, data, data, data]);


		}


	};


	/**
	 * populate
	 *
	 * @method populate
	 * params
	 * @return
	 *
	 */
	this.populate = function() {

		return self;


	};







};
