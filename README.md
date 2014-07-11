nunjucks-mongoose
=================

Query mongoose models from nunjucks templates.

##Usage

```javascript
var ext = require('nunjucks-mongoose');

nunjucks.configure('views).addExtenstion(ext);
```
In your templates:

```html
<html>
{% mongoose model='product',bind=product,create={}, chain=[{m:'findOne', a:{sku:12345}}, {m:'limit',a:1}] %}

<p>You selected {{ product.title }} </p>

</html>
```

##Api

####model
The name of the model to query.

####bind
The name of the variable the model will be bound to.

####create
Pass an object for this value and the model will instantiated with its values. This is optional.

####chain
An array of objects that represents methods that will be called in a chain on the model. ('m' for the method name and 'a' and object representing arguments)


##Limitations

Try not to get to complicated with the chain, things get messy pretty quickly.

I created this because I wanted a way to let templates load models rather than
in the routes. I'm using it in a few projects but there are no tests yet. If it 
proves to be useful to you let [me](https://twitter.com/metasansana)

