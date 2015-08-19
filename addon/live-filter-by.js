import FilteredSubset from 'ember-data-live-filter/filtered-subset';
export default function liveFailterBy(key, value, options) {
  options = options || {};

  if (options.live) {
    return FilteredSubset.create({
      filterByArgs: [key, value],
      recordArray: this
    });
  }

  return this._super.apply(this, arguments);
}
