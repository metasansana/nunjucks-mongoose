nunjucks-mongoose
=================

# Status: Cancelled. Here for reference purposes only.

Call query methods on mongoose models straight from your nunjucks templates.

##Motivation
Sometimes it seems more intuitive to load database data in  views from them, instead
of in route handlers. I wrote this to do just that.

##Installation

``` npm install nunjucks-mongoose ```

In your express app:

```javascript
var MongooseExtension = require('nunjucks-mongoose');
var nunjucks = require('nunjucks');

//nunjucks.configure returns an Environment
var env = nunjucks.configure('views');
env.addExtension('MongooseExtension', new MongooseExtension(mongoose, 'get'));
```

##Usage

**Note: Version 0.2.x breaks compatibility with previous releases.**

With 0.2.x ownwards, I tried to make the syntaxe fluid and easier to remember:

```html
{% get <variable> from <model> using <method> with <arg1>,<arg2>,.. %}
{% done %}
```

Where ``<variable>(string|required)`` is the name of the variable to bind to (will be available in your template via {{name}} etc).

``<model>(string|required)`` is the name of the model you should have already registered with mongoose.

``<method>(string|required)`` is the method we will use on the model. If you want to use a custom
method, you will have to ensure it returns the mongoose Query object. The extension
internally calls methods by using ``exec``.

``with`` indicates to the parser that the rest of the block contains arguments to pass 
to the method. That will be ``<arg1>,<arg2>`` etc. If a method receives no args, then ommit with.

###Chaining

You can chain multiple method calls like ``limit``, ``populate`` etc. Each additional method call must use a ``then`` block. This has nothing to do with promises, it's just easier to read:

```html
{% get <variable> from <model> using <method> with <arg1>,<arg2>,.. %}
{% then <method> with <arg1>,<arg2>,.. %}
{% then <method> %}
{% done %}
```

##Example

Here is an example use case:

```html
<html>
{% get 'products' from 'Product' using 'find' with {_id:false} %}
{% then 'limit' with 10 %}
{% then 'populate' %}
{% done %}
<body>
{% for product in products %}
<p>We sell {{ product.title }} in category {{product.category}}</p>
{% endfor %}
</body>
</html>
```
##Issues

If you come across bugs or have ideas on improving this, please file an issue.

##Tests
I added some basic tests, hope to bring more in the future. ```npm test```

##Documentation

You just read it. If you need more infomation than this email me lmurray at quenk dot com. Or tweet me [@metasansana](https://twitter.com/metasansana).
