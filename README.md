# Ember Data Live FilterBy



## Install

### Ember CLI

`ember install ember-data-live-filter-by`


## Documentation 

Ember Data Live FilterBy adds an options argument to the `filterBy` method on `DS.RecordArrays` (the object returned from `store.peekAll`) and `DS.ManyArrays` (the object used to hold `DS.hasMany` relationships). When `{ live: true }` is passed as the options parameter to `filterBy` it will return a live array that will update whenever a record is added, removed or updated in the original array. If the options argument is not provided, or the `live` property is falsy then `filterBy` will return a normal array.

```js
App.PostController = Ember.Controller.extend({
  allPosts: function() {
    return this.store.peekAll('post');
  }.property()
  allUndeletedPosts: function() {
    return this.store.peekAll('post').filterBy('isDeleted', false, { live: true });
  }.property()
});
```

```js
App.Post = Ember.Model.extend({
  comments: DS.hasMany('comment'),
  undeletedComments: function() {
    return this.get('comments').filterBy('isDeleted', false, { live: true });
  }.property()
});
```

## Why?

Durring the Ember Data 1.0.0 betas and in the Ember Data 1.13 release. Records that were marked as deleted locally but not yet saved to the backend were automatically removed from the `RecordArray`s returned by `store.peekAll('type')` and the `ManyArray`s returned by `hasMany` relationships. In Ember Data 2.0.0 records are not removed from these arrays until they have acknowledged as deleted by the backend. This plugin makes it easier to transition old code from Ember Data 1.13 to work with Ember Data 2.0.

## I Don't Want to use this addon, are there alternateives?

You can combine `store.peekAll` or a hasMany relationship with a computed property to acheive the same functionality:

```js
// app/controllers/posts.js

export default Ember.Controller.extend({

  posts: Ember.computed(function() {
    return this.store.peekAll('post');
  }),

  filteredPosts: Ember.computed('posts.@each.isPublished', function() {
    return this.get('posts').filterBy('isPublished');
  })
});
```

```js
// app/models/post.js

export default Ember.Controller.extend({

  comments: DS.hasMany('comment'),

  maintainedComments: Ember.computed('comments.@each.isDeleted', function() {
    return this.get('comments').filterBy('isDeleted', false);
  })
});
```

## Development Installation

* `git clone` this repository
* `npm install`
* `bower install`

## Running

* `ember server`
* Visit your app at http://localhost:4200.

## Running Tests

* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [http://www.ember-cli.com/](http://www.ember-cli.com/).
