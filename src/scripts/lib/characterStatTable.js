import React from 'react';

export default class CharacterStatTable extends React.Component {
  render() {       
    const propertyNames = Object.getOwnPropertyNames(this.props.attr);
    let rows = [];
    for(let i = 0, propertyCount = propertyNames.length; i < propertyCount; i++) {
      let key = propertyNames[i];
      let val = this.props.attr[key];
      let keyName = key + i;
            
      // var allKeys = document.querySelectorAll('.' + key);
      rows.push(
        <tr key={keyName} className={key}>
          <td className='title'>{key}</td>
          <td>{val}</td>
        </tr>
      );
    }
    return (
      <table className={this.props.className}>
        <caption>{this.props.title}</caption>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
}