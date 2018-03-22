//https://github.com/xivdb/api/
import React from 'react';
import ReactDOM from 'react-dom';
import Character from '../lib/character';

var url = new URL(window.location.href);
var idParam = url.searchParams.get('ids');
var ids = (idParam === null) ? [] : idParam.split(' ');
var uniq = [...new Set(ids)];

function Characters() {
  var characters = [];
  uniq.forEach(function(id) {
    var isnum = /^\d+$/.test(id);
    if (isnum)
      characters.push(<Character key={id} id={id} />);
  }, this);
  return characters;
}
ReactDOM.render(
  <Characters />,
  document.getElementById('root')
);