var env;
var app;
var express = require('express');
var request = require('supertest');
var nunjucks = require('nunjucks');

describe('mongoose extension', function() {

	beforeEach(function() {

		var Mongoose = require('./util/MockMongoose');
		var Extension = require('../');
		app = express();
		env = new nunjucks.Environment(new nunjucks.FileSystemLoader('test/html'));
		env.addExtension('MongooseExtenstion', new Extension(new Mongoose(), 'provide'));
		env.express(app);

	});

	function render(file) {

		app.get('/' + file, function(req, res) {
			res.render(file);
		});

		return request(app).
		get('/' + file);


	}

	function renderString(file, string) {

		app.get('/' + file, function(req, res) {
			res.send(env.renderString(string));
		});
		return request(app).
		get('/' + file);


	}

	describe('single calls', function() {

		it('should render a view for one method call', function(done) {

			render('single.html').expect(/Mock Name/).expect(/Mock2/).end(done);

		});

		it('should render a string view for one method call', function(done) {

			renderString('single.html', "{% provide 'data' from 'Mock' using 'findOne' %}{% done %}<p>{{data.name}}</p>" +
				"{% provide 'data2' from 'Mock' using 'findOne' with {name:'Mock2'} %}{% done %}<p>{{data2.name}}</p>").expect(/Mock Name/).expect(/Mock2/).end(done);



		});


	});

	describe('chained calls', function() {

		it('should render a view for chained method calls', function(done) {

			render('chained.html').expect(/Mock Name/).expect(/Mock2/).end(done);

		});



	});


});
