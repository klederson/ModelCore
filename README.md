# ModelCore

## What is?

ModelCore is a very light and simple ActiveRecord and Data Mapper over REST ( with some nice features of course )

The reason i built it was to easly handle lots of data and "Models" from REST api that i already work nowdays. The lack of good tools in this area made me do this in a 24h programming day.

## Introduction

This is primary build to be used with AngularJS but will be soon ported to a framework free solution.

> This is the very first version of this and was coded (at least until the first version) in 24h ( between understand some ECMACScript stuff, research and angular learn curve + this documentation ).

> So be brave and use at your own risk!!!!! =)


## Usage

First of all ( and of course ) you need to include it's javascript in your html

The samples here are for AngularJS please keep that in mind for more informations please check  [their site](http://www.angularjs.org/)

```html
<script src="ModelCore.js"></script>
```

Than you need to setup your app to receive ModelCore

```javascript
var ExampleApp = angular.module('ExampleApp', ['ModelCore']); //injecting ModelCore

ExampleApp.factory("Users",function(ModelCore) {
  return ModelCore.instance({
    $type : "Users", //Define the Object type
    $pkField : "idUser", //Define the Object primary key
    $settings : {
      urls : {
        base : "http://myapi.com/users/:idUser",
      }
    }
  });
});
```

And Then we setup our Controller to use our model ( in this case Users )

```javascript
function MainCrtl($scope, Users) {
  //Setup a model to example a $find() call
  $scope.AllUsers = new Users();
  
  //Get All Users from the API
  $scope.AllUsers.$find();

  //Setup a model to example a $get(id) call
  $scope.OneUser = new Users();
  
  //Hey look there are promisses =)
  //Get the user with idUser 1 - look at $pkField
  $scope.OneUser.$get(1).success(function() {
    console.log("Done!",$scope.OneUser.$fetch());
});
```
    

And … that's all to be honest… =)

Now you have a Fully Functional model in your app… but HEY! Show me the magic!!!

Ok, you can see the sample's [source code](https://github.com/klederson/ModelCore/tree/master/sample)

### ModelCore.instance(options)

This method help you to create a new instance… for now it's just used at angular factory but soon will be updated to work with pure javascript and than… we provide more info about that. For now… just trust me on this.

### model.$settings

When you create the model using ModelCore.instance() you need to provide some basic settings and this are:

#### urls

Urls define witch url should be used in each REST Method case, example, if you want POST to have one url and GET to have another you just do this:

> **urls.base** is a very important trick because if your REST server follows the correct specifications you only need one url to rule them all and base does that

```javascript
ExampleApp.factory("Users",function(ModelCore) {
  return ModelCore.instance({
    $type : "Users",
    $pkField : "idUser",
    $settings : {
      urls : {
        base : "http://yourapi.com/users/:idUser",
        post : "http://myOtherApi.com/users/:id",
        get : "http://aThirdApi.com/users/get/"
      }
    }
  });
});
```

#### headers

This will setup your rest call headers

```javascript
…
$settings : {
    …
    headers : { 
        'Content-Type' : 'application/json'
    }
    …
}
…
```

#### dataField

This is a very special field that will define the container of your response data item(s), for example if your REST Server respond a JSON with an array of items in the field items then you should configure this like **many : "items"** and when you get a unique item it responds as content then you should setup like **one : "content"**.

I'll give you a example to better explain the idea.

##### JSON Response from SERVER

**One**

```javascript
//GET /api/users/1 HTTP/1.1
//Content-Type: application/json

{
"status": "OK",
"content": 
    {
        "idUser": "1",
        "fname": "Nome",
        "lname": "Admin",
        "uuid": "4f68f72080969"
    }
}
```

**Many**

```javascript
//GET /api/users/ HTTP/1.1
//Content-Type: application/json

{
"status": "OK",
"items": [
    {
        "idUser": "1",
        "fname": "Nome",
        "lname": "Admin",
        "uuid": "4f68f72080969"
    },
    {
        "idUser": "2",
        "fname": "Klederson",
        "lname": "Bueno",
        "uuid": "5192a8dfe289f"
    }]        
}
```

##### dataField configuration

> by the way this example is the default settings so if is like this you dont need to setup anything

```javascript
…
$settings : {
    …
    dataField : { 
        one : "content",
        many : "items"
    }
    …
}
…
```

And is basicaly that.

## Common Methods & Attributes

### model.$type
> Define the type of the ModelCore.instance() object to return.

### model.$pkField
> Define witch will be the pkField to some automatic operations refer to

### model.$find(query,options,incremental)
> Perform a call to the server using "GET"

```javascript
model.$find();
```

This method return a Promisse so you can handle the calls:

```javascript
model.$find().success(fn).error(fn).then(fn); 
```

You can also setup a query to complete your request such as filters or anything.

```javascript
model.$find({ filter : "John" }); 
//of course your REST server should accept the query string ?filter=…
//this will generate a requst like: http://myapi.com/users/?filter=John
```
And of course you can increment your dataset by adding an optional parameter called incremental

```javascript
model.$find({ filter : "John" },{},true); 
//this will increment your dataset instead of clean it and will join both previus and new data
```
> Note that i used a empty object as parameter this is the options parameter to be used as a future implementation

### model.$incremental(query,options)

### model.$get(id,field)
> This will retreive a given id User. Of course your server must reply following some REST basic patterns such as:
> 
> GET /api/users/1 HTTP/1.1

> Other important thing: this already performs **model.$fetch()** so is not needed to call twice


```javascript
model.$get(1); //it also uses promisses just like $find()
```

And you can onDemand change the "get" field just providing a second parameter with the model field name to use:

```javascript
model.$get(1,"otherId");
```
    
This case bellow your url MUST have the **:otherId** parameter otherwise will make no sense once it will not be applied anyway.

### model.$save()
> This will perform a POST (yes, for now we'll not add PUT as default save once we need to save and update automaticaly just like any ORM but in the future this will be configurable )

```javascript
model.$save()
```

This operation uses **model.$toObject()** to understand the changes and once everything is saved it will update your model so the new data will replace the original even in the model so commands like **model.$diff()** or **model.$isChanged()** will reply empty and/or false.

### model.$delete(id,field)
```javascript
model.$delete() //delete also return a Promisse
```

Just like get you can add an id and also change onDemand the idField

```javascript
model.$delete(1)
//of
model.$delete(1,'otherField');
```
    
### model.$fetch()
> This is a important stuff because anytime you need to instance a object you need to $fetch() that.

Example

```javascript
model.$find().success(function() {
	var returnedObject;
	
	console.log(model.$toObject()); //empty data just a master handler
	
	while(returnedObject = model.$fetch()) {
		console.log(returnedObject.$toObject()); //this are the child object
		
		console.log(model.$toObject()); //this are the master model object with child data
	}
});
```

### model.next()
> This is the man how makes **model.$fetch()** works

Example

```javascript
model.$find().success(function() {
	var returnedObject;
	
	console.log(model.$toObject()); //empty data just a master handler
	
	while(returnedObject = model.$next()) {
		console.log(returnedObject.$toObject()); //this are the child object
		
		console.log(model.$toObject()); //this are the master model object with child data
	}
});
```

### model.prev()
> Same as **model.$next()** but to move the cursor back.

## Auxiliar Methods

### model.$isChanged(field)
> This returns a Boolean if is or not changed based on the original data ( the REQUEST momentum )

This is cool and can be combined to alert the user about unsaved changes.

```javascript
model.$isChanged()
```
    
And also you can check for only one field

```javascript
model.$isChanged('fname')
```

Here is a pratical sample in the html using AngularJS

```html
<input ng-class="{unsaved: item.$isChanged('fname')}" ng-model="item.fname" />
```

That sample put in the input the class "unsaved" if the field "fname" is changed ( and will disappear once **model.$save()** is invoked and of course returns success )


### model.$diff()
> Display the difference between the original data and the staged data and returns a Object with all ( and only ) changed fields

```javascript
model.$diff(); //this will return something like { fname : "New data" }
```


### model.$toObject()
> Return a raw object with all **STAGED** ( not the original, not the saved, the STAGED/CURRENT ) data.

```javascript
model.$toObject()
```

Will return something like as a Javascript Object

```javascript
{
  idUser: "1",
  fname: "New Name",
  lname: "Admin",
  uuid: "4f68f72080969"
}
```


### model.$original()
> Return a raw object with all **ORIGINAL** data of the model even if there are changes.

```javascript
model.$original()
```

Will return something like as a Javascript Object
```javascript
{
  idUser: "1",
  fname: "Nome",
  lname: "Admin",
  uuid: "4f68f72080969"
}
```

### model.$url(method,parameters)
> This return the url to a given method and parameters (optional)

```javascript
console.log( model.$url('get') )
//or
console.log( model.$url('get',{ idUser : 1 }) )
```


## Really Deep Stuff

### model.$dataset
> This is an array from the MASTER model that contains ALL the child models and of course each item is also a model of the same instance of that master.

### model.$mapping
> For now this is automatic but in a VERY near future you will be able to setup and map your model and shape it as your will. More details later.

## Thanks to

Well, the first version (until the first version of this document) was written as i said in 24 hours and was only possible because some folks:

#### BreezeJS
Thankyou for be so awesome that made me really want to use your features but also be so complex/burocratic, heavy and so "microsoftized" that i give up before 4h trying to understand and customize a simple model.

That make me realize that i needed to search more and more or even make my own solution

[BreezeJS](http://www.breezejs.com)

#### angular-activerecord (github project)
This is a very nice project and very simple, works well but missed lots of stuff… at the beginning i wanted to do a fork of this and than just improve but ModelCore in my head would be so different that maybe would have dismissed the goal of this very nice project.

Also this gave me the guidlines to start building and also to the **ModelCore.instance()** code.

Checkout the project at [Github](https://github.com/bfanger/angular-activerecord)

## Roadmap

* Non-relational workflow ( it's almost but need more polish )
* Pure Javascript (not dependend on AngularJS but fully compatible)
* qUnit Tests =) (of course)
* Offline data
* Query like filters such as .where() .and() .or() ...
* OAuth

Of course i accept suggestions
