import React from 'react';

export default class CharacterGearTable extends React.Component {
  getbaseAttributes(baseAttrs) {
    var propertyNames = Object.getOwnPropertyNames(baseAttrs);
    var rows = [];
    for(let i = 0, propertyCount = propertyNames.length; i < propertyCount; i++) {
      let key = propertyNames[i];
      let val = baseAttrs[key];
      if (val !== 0 && val !== '0' && !key.endsWith('_hq') && key !== 'id' && key !== 'patch') {
        let keyName = key + i;
        var fixedName = key.replace('_', ' ').split(' ').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');

        rows.push(
          <tr key={keyName}>
            <td className='title'>{fixedName}</td>
            <td>{val}</td>
          </tr>
        );
      }
    }
    if (rows.length > 0) {
      return (
        <div className='attrs_holder'>
          <table className='base_attrs'>
            <caption>Base Attributes</caption>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      );
    }
    return <div className='attrs_holder'></div>;
  }
  getAttributes(baseAttrs) {
    var rows = [];
    for(let i = 0, baseAttrsCount = baseAttrs.length; i < baseAttrsCount; i++) {
      let baseAttr = baseAttrs[i];
      var name = baseAttr.name;
      var val = baseAttr.value;
      var valHq = baseAttr.value_hq;

      let keyName = name + i;

      rows.push(
        <tr key={keyName}>
          <td className='title'>{name}</td>
          <td>+{val}</td>
        </tr>
      );
    }
    if (rows.length > 0) {
      return (
        <div className='attrs_holder'>
          <table className='param_attrs'>
            <caption>Attributes</caption>
            <tbody>
              {rows}
            </tbody>
          </table>
        </div>
      );
    }
    return <div className='attrs_holder'></div>;
  }
  displayDetails(event) {
    let classList = event.currentTarget.parentNode.parentNode.classList.value;
    let gearClass = classList.replace(' gearTable', '');
    let gearDetails = document.querySelectorAll('.' + gearClass + ' .gearDetails');
    gearDetails.forEach(function(element) {
      var elementStyle = getComputedStyle(element)['display'];
      if (elementStyle === 'none')
        element.classList.remove('hide');//.display = 'block';
      else
        element.classList.add('hide');
    }, this);


    let toggleIcon = document.querySelectorAll('.' + gearClass + ' .toggleArrow');
    toggleIcon.forEach(function(element) {
      var val = element.innerHTML;
      if (val === '+')
        element.innerHTML = '-';
      else
        element.innerHTML = '+';
    }, this);

    if (gearClass === 'mainhand_table') {
      var offHand = document.querySelectorAll('.offhand_table');
      offHand.forEach(function(element) {
        var elementStyle = getComputedStyle(element)['display'];
        if (elementStyle === 'none')
          element.style.display = 'block';
        else
          element.style.display = 'none';
      }, this);

    }
  }
  render() {
    var className = this.props.className + ' gearTable';
    if(this.props.attr !== undefined) {

      var baseAttrs = this.getbaseAttributes(this.props.attr.attributes_base);
      var attrParams = this.getAttributes(this.props.attr.attributes_params);

      return (
        <div className={className}>
          <div className='gearInfo'>
            <div className='clickEventHolder' onClick={this.displayDetails}>
              <strong className='title'>{this.props.attr.slot_name}</strong>
              <span className='toggleArrow'>+</span>
            </div>
            <div className='slotInfo'>
              <a href={this.props.attr.url}>
                <img src={this.props.attr.icon} title={this.props.attr.name} />
                {this.props.attr.name}
              </a>
              <div className='classJob'>({this.props.attr.classjob_category})</div>
              <div className='classJobLvl'>lvl.<span className='classJobLvlVal'>{this.props.attr.level_item}</span></div>
            </div>
          </div>
          <div className='gearDetails hide'>
            {baseAttrs}
            {attrParams}
          </div>
        </div>
      );
    }
    else {
      return (
        <div className={className}>
          <div className='gearInfo'>
            <div className='clickEventHolder'>
              <strong className='title'></strong>
              <div className='slotInfo'></div>
            </div>
          </div>
          <div className='gearDetails hide'>
            {baseAttrs}
            {attrParams}
          </div>
        </div>
      );
    }
  }
}