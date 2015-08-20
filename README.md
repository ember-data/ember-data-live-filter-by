# Ember Data Live FilterBy



## Install

### Ember CLI

`ember install ember-data-live-filter-by`

## Why?

Durring the Ember Data 1.0.0 betas and in the Ember Data 1.13 release. Records that were marked as deleted locally but not yet saved to the backend were automatically removed from the `RecordArray`s returned by `store.peekAll('type')` and the `ManyArray`s returned when 


The Filter API is about to under-go some heavy churn to fix issues with
it.

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
