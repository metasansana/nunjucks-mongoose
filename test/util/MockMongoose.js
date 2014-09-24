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

		return self;


	};

	/**
	 * findOne
	 * @method findOne
	 * params
	 * @return
	 *
	 */
	this.findOne = function() {

          this.ONE_MODE = true;
          return self;


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

		if (this.ONE_MODE) {
                  this.ONE_MODE =false;
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
