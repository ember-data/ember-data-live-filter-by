import liveFilterBy from 'ember-data-live-filter-by/live-filter-by';
import DS from 'ember-data';

export function initialize(/* container, application */) {
  DS.RecordArray.reopen({
    filterBy: liveFilterBy
  });
  DS.ManyArray.reopen({
    filterBy: liveFilterBy
  });
}

export default {
  name: 'livefilter',
  initialize: initialize
};
