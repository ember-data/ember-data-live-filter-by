import liveFilterBy from 'ember-data-live-filter-by/live-filter-by';
import DS from 'ember-data';

let initialized = false;

export function initialize(/* container, application */) {
  if (initialized) return;

  DS.RecordArray.reopen({
    filterBy: liveFilterBy
  });
  DS.ManyArray.reopen({
    filterBy: liveFilterBy
  });

  initialized = true;
}

export default {
  name: 'livefilter',
  initialize: initialize
};
