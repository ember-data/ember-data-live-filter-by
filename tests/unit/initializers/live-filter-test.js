import Ember from 'ember';
import { initialize } from '../../../initializers/live-filter';
import { module, test } from 'qunit';
import DS from 'ember-data';

var registry, application, store;
var run = Ember.run;

module('Unit | Initializer | live filter', {
  beforeEach: function() {
    run(function() {
      application = Ember.Application.create();
      registry = application.registry;
      initialize(registry, application);
      var Chapter = DS.Model.extend({
        title: DS.attr(),
        pages: DS.hasMany('page', { async: false })
      });

      var Page = DS.Model.extend({
        number: DS.attr('number'),
        chapter: DS.belongsTo('chapter', { async: false })
      });
      registry.register('service:store', DS.Store);
      registry.register('model:chapter', Chapter);
      registry.register('model:page', Page);
      store = application.__container__.lookup('service:store');
    });
  },
  afterEach: function() {
    run(function() {
      application.destroy();
    });
  }
});

test('it works', function(assert) {

  // you would normally confirm the results of the initializer here
  assert.ok(store);
});


test("ManyArray#filterBy can filter records in the hasMany", function (assert) {
  var chapter, page;
  run(function() {
    store.push({
      data: {
        type: 'chapter',
        id: '1',
        relationships: {
          pages: {
            data: [
              { type: 'page', id: '2' },
              { type: 'page', id: '3' }
            ]
          }
        }
      },
      included: [{
        type: 'page',
        id: '2'
      }, {
        type: 'page',
        id: '3'
      }]
    });
    chapter = store.peekRecord('chapter', 1);
    page = store.peekRecord('page', 2);
  });
  var filteredManyArray;
  run(function() {
    filteredManyArray = chapter.get('pages').filterBy('isDeleted', true, { live: true });
    page.deleteRecord();
  });
  run(function() {
    assert.equal(filteredManyArray.get('length'), 1, "Can filter by deleted records");
  });
});


test("ManyArray#filterBy is a live filtered subset", function (assert) {
  var chapter;
  run(function() {
    store.push({
      data: {
        type: 'chapter',
        id: '1',
        relationships: {
          pages: {
            data: [
              { type: 'page', id: '2' },
              { type: 'page', id: '3' }
            ]
          }
        }
      },
      included: [{
        type: 'page',
        id: '2'
      }, {
        type: 'page',
        id: '3'
      }]
    });
    chapter = store.peekRecord('chapter', 1);
  });
  run(function() {
    store.peekRecord('page', 2).deleteRecord();
    var deletedChapters = chapter.get('pages').filterBy('isDeleted', true, { live: true });
    assert.equal(deletedChapters.get('length'), 1);
    store.peekRecord('page', 3).deleteRecord();
    assert.equal(deletedChapters.get('length'), 2);
  });
});

test("ManyArray#filterBy { live: false } returns a normal array", function (assert) {
  var chapter;
  run(function() {
    store.push({
      data: {
        type: 'chapter',
        id: '1',
        relationships: {
          pages: {
            data: [
              { type: 'page', id: '2' },
              { type: 'page', id: '3' }
            ]
          }
        }
      },
      included: [{
        type: 'page',
        id: '2'
      }, {
        type: 'page',
        id: '3'
      }]
    });
    chapter = store.peekRecord('chapter', 1);
  });
  run(function() {
    store.peekRecord('page', 2).deleteRecord();
    var deletedChapters = chapter.get('pages').filterBy('isDeleted');
    assert.equal(deletedChapters.get('length'), 1);
    store.peekRecord('page', 3).deleteRecord();
    assert.equal(deletedChapters.get('length'), 1);
  });
});


test("RecordArray#filterBy { live: false } returns a normal array", function (assert) {
  var pages;
  run(function() {
    store.push({
      data: {
        type: 'chapter',
        id: '1',
        relationships: {
          pages: {
            data: [
              { type: 'page', id: '2' },
              { type: 'page', id: '3' }
            ]
          }
        }
      },
      included: [{
        type: 'page',
        id: '2'
      }, {
        type: 'page',
        id: '3'
      }]
    });
    pages = store.peekAll('page');
  });
  run(function() {
    var deletedPages = pages.filterBy('isDeleted');
    assert.equal(deletedPages.length, 0);
    store.peekRecord('page', 2).deleteRecord();
    assert.equal(deletedPages.length, 0);
  });
});

test("RecordArray#filterBy { live: true } returns a live filtered array", function (assert) {
  var pages;
  run(function() {
    store.push({
      data: {
        type: 'chapter',
        id: '1',
        relationships: {
          pages: {
            data: [
              { type: 'page', id: '2' },
              { type: 'page', id: '3' }
            ]
          }
        }
      },
      included: [{
        type: 'page',
        id: '2'
      }, {
        type: 'page',
        id: '3'
      }]
    });
    pages = store.peekAll('page');
  });
  run(function() {
    var deletedPages = pages.filterBy('isDeleted', true, { live: true });
    assert.equal(deletedPages.get('length'), 0);
    store.peekRecord('page', 2).deleteRecord();
    assert.equal(deletedPages.get('length'), 1);
  });
});
