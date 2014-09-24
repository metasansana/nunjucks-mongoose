var env;
var app;
var must = require('must');
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

			render('single.html').expect(/[Mock Name]{2}/).end(function() {

				renderString('single.html', "{% provide 'data' from 'Mock' using 'findOne' %}{% done %}<p>{{data.name}}</p>" +
					"{% provide 'data2' from 'Mock' using 'findOne' with {name:'Mock2'} %}{% done %}<p>{{data2.name}}</p>").expect(/[Mock Name]{2}/).end(done);
			});

		});

		it('should not fail if rendered repeateadly', function(done) {

			var tmpl = "{% provide 'data' from 'Mock' using 'findOne' with 1,2,3 %}{% done %}{{data.name}}";

			[tmpl, tmpl, tmpl].
			forEach(function(tmpl) {

				env.renderString(tmpl).must.match(/[Mock Name]{1}/);

			});

	[tmpl + tmpl + tmpl, tmpl + tmpl + tmpl, tmpl + tmpl + tmpl].
			forEach(function(tmpl) {

				env.renderString(tmpl).must.match(/[Mock Name]{3}/);

			});

			done();


		});


	});

	describe('chained calls', function() {

		it('should render a view for chained method calls', function(done) {

			render('chained.html').expect(/[Mock Name]{3}/).end(done);

		});

		it('should not fail if rendered repeateadly', function(done) {

			var tmpl = "{% provide 'data' from 'Mock' using 'find' with {}, {} %}" +
				"{% then 'limit' with  10 %}{% then 'limit' with 10 %}{% done %}{{data[0].name}}";

			[tmpl, tmpl, tmpl].
			forEach(function(tmpl) {

				env.renderString(tmpl).must.match(/[Mock Name]{1}/);

			});

			[tmpl + tmpl + tmpl, tmpl + tmpl + tmpl, tmpl + tmpl + tmpl].
			forEach(function(tmpl) {

				env.renderString(tmpl).must.match(/[Mock Name]{3}/);

			});
			done();


		});

	});


});
