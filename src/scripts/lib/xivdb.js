// fetch('http://api.xivdb.com/character/16738064');
// http://api.xivdb.com/character/16738064
// http://api.xivdb.com/character/16738064?data=gearsets
// http://api.xivdb.com/item/#####

import fetch from 'es6-promise';

var XIVDB = {
  handleErrors: function(response) {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    return response.json();
  },
  getCharacter: function(id) {
    var url = 'http://api.xivdb.com/character/' + id;
    return fetch(url)
      .then(this.handleErrors);
  },
  getGearSets: function(id) {
    var url = 'http://api.xivdb.com/character/' + id + '?data=gearsets';
    return fetch(url)
      .then(this.handleErrors);
  },
  init: function(id) {
    var character = this.getCharacter(id);
    var gearSets = this.getGearSets(id);

    return Promise.all([character, gearSets].map(p => p.catch(e => e)));
  }
};

module.exports = XIVDB;