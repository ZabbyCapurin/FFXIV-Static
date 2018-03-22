import React from 'react';
// import PropTypes from 'prop-types';
import XIVDB from  '../lib/xivdb';
import CharacterStatTable from '../lib/characterStatTable';
import CharacterGearTable from '../lib/characterGearTable';

export default class Character extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.id,
      name: '',
      img: '',
      server: '',
      gear: {},
      allGear: {},
      currentGearSet: {},
      allGearAndStats: {},
      currentGearIndex: -1,
      error: false
    };
    this.handleSetChange = this.handleSetChange.bind(this);
  }
  componentDidMount() {
    if (!this.state.error) 
      this.setup();
  }
  setup() {
    XIVDB.init(this.state.id)
      .then(results => this.displayCharacterInfo(results))
      .catch(e => this.setupErrorHandler(e));
  }
  setupErrorHandler(/* e */) {        
    return this.setState({
      error: true
    });
  }
  displayCharacterInfo(results) {
    var characterInfo = results[0].data;
    if (typeof characterInfo !== 'undefined') {
      var currentClass = characterInfo.active_class.role;
            
      var gearSet = results[1];
      var currentGearSet = gearSet.find(function(gear) {
        return gear.classjob_id === currentClass.id;
      });
      var currentGearSetIndex = gearSet.map(function (e) {return e.classjob_id;}).indexOf(currentClass.id);
      // var stats = currentGearSet.stats;
      // var gear = currentGearSet.gear;

      var updatedStateVal = {
        name: characterInfo.name,
        img: characterInfo.avatar,
        server: characterInfo.server,
        current_class_level: characterInfo.active_class.progress.level,
        url_lodestone: results[0].url_lodestone,
        currentGearSet: currentGearSet
      };
            
      updatedStateVal.currentGearIndex = (this.state.currentGearIndex === -1) ? currentGearSetIndex : this.state.currentGearIndex;

      let gearAndStatsHolder = [];

      for (let gs in gearSet) {                
        let gearHolder = [];
        let currentGearSet = gearSet[gs];
        let currentGearSet_Role = currentGearSet.role;
        let currentGearSet_Stats = currentGearSet.stats;
        let currentGearSet_Gear = currentGearSet.gear;

        for (let g in currentGearSet_Gear) {
          if (currentGearSet.hasOwnProperty(g)) {
            //console.log(g + " -> " + gear[g]);
            let data = currentGearSet_Gear[g].data;
            let attributes_base = data.attributes_base;
            let attributes_params = data.attributes_params;
            let classjob_category = data.classjob_category;
            let icon = data.icon;
            let level_item = data.level_item;
            let name = data.name;
            let slot_name = data.slot_name;
            let url = data.url_lodestone;
            gearHolder[g] = {
              attributes_base: attributes_base,
              attributes_params: attributes_params,
              classjob_category: classjob_category,
              icon: icon,
              level_item: level_item,
              name: name,
              slot_name: slot_name,
              url: url
            };
          }
        }
                
        gearAndStatsHolder[gs] = {
          stats: currentGearSet_Stats,
          gear: gearHolder,
          avgItemLvl: currentGearSet.item_level_avg,
          name: currentGearSet_Role.name,
          icon: currentGearSet_Role.icon,
          abbr: currentGearSet_Role.abbr,
          level: currentGearSet.level,
          id: currentGearSet.classjob_id
        };
      }
      updatedStateVal.allGearAndStats = gearAndStatsHolder;
      //updatedStateVal.gear = gearHolder;
            
      return this.setState(updatedStateVal);
    }
    else {
      return this.setState({
        name: results[0].message.toString(),
        current_class_level: '0',
        error: true
      });
    }
  }
  isEmptyObject(obj) {
    for(var prop in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, prop)) {
        return false;
      }
    }
    return true;
  }
  renderStatTable(className, title, field /* , currentStats */) {
    if (this.state.allGearAndStats !== null &&
            this.state.allGearAndStats.length > 0 &&       
            !this.isEmptyObject(this.state.allGearAndStats[this.state.currentGearIndex]) &&
            !this.isEmptyObject(this.state.allGearAndStats[this.state.currentGearIndex]['stats']) &&         
            !this.isEmptyObject(this.state.allGearAndStats[this.state.currentGearIndex]['stats'][field])
    ) {
      var fieldVal = this.state.allGearAndStats[this.state.currentGearIndex]['stats'][field];
      return <CharacterStatTable className={className} title={title} attr={fieldVal} />;
    }
    return null;
  }
  renderStatTables() {
    let attr_table = this.renderStatTable('attr_table', 'Attributes', 'attributes');
    let o_table = this.renderStatTable('o_table', 'Offensive', 'offensive');
    let d_table = this.renderStatTable('d_table', 'Defensive', 'defensive');
    let phys_table = this.renderStatTable('phys_table', 'Physical', 'physical');
    let mental_table = this.renderStatTable('mental_table', 'Mental', 'mental');
    let res_table = this.renderStatTable('res_table', 'Resistance', 'resistance');
    let core_table = this.renderStatTable('core_table', 'Core', 'core');
    return (
      <div className='charaStats'>
        {core_table}
        {attr_table}
        {o_table}
        {d_table}
        {phys_table}
        {mental_table}
        {res_table}
      </div>
    );
  }
  markLowestForItems() {
    this.markLowest('.mainhand_table .classJobLvlVal');
    this.markLowest('.offhand_table .classJobLvlVal');
    this.markLowest('.head_table .classJobLvlVal');
    this.markLowest('.body_table .classJobLvlVal');
    this.markLowest('.hands_table .classJobLvlVal');
    this.markLowest('.waist_table .classJobLvlVal');
    this.markLowest('.legs_table .classJobLvlVal');
    this.markLowest('.feets_table .classJobLvlVal');
    this.markLowest('.necklace_table .classJobLvlVal');
    this.markLowest('.earringss_table .classJobLvlVal');
    this.markLowest('.bracelets_table .classJobLvlVal');
    this.markLowest('.ring1_table .classJobLvlVal');
    this.markLowest('.ring2_table .classJobLvlVal');
  }
  markLowest(query) {
    var objsToCompare = document.querySelectorAll(query);
    let objsCount = objsToCompare.length;
    if (objsToCompare !== null && objsCount > 1) {
      var lowestObj = [];
      let orderedObjs = mergeSort(Array.prototype.slice.call(objsToCompare));

      for(let i = 0; i < objsCount; i++) {
        var obj = orderedObjs[i];
        obj.classList.remove('mark');
        var currentVal = parseInt(obj.innerHTML, 10);
        if (lowestObj === null || lowestObj.length === 0)
          lowestObj.push(obj);
        else {
          var original = lowestObj[0];
          if (parseInt(original.innerHTML, 10) === currentVal) {
            lowestObj.push(obj);
          }
          else {
            if (parseInt(original.innerHTML, 10) > currentVal) {
              lowestObj.push(obj);
            }
            else {
              lowestObj = [];
              lowestObj.push(original);
            }
          }
        }
      }
            
      if (lowestObj !== null && lowestObj.length > 0  && lowestObj.length < objsCount) {
        lowestObj.forEach(function(element) {
          element.classList.add('mark');
        }, this);
      }
    }
  }
  renderGearTable(className, field) {
    const { allGearAndStats, currentGearIndex } = this.state;

    if (allGearAndStats !== null &&
            allGearAndStats.length > 0 &&       
            !this.isEmptyObject(allGearAndStats[currentGearIndex]) &&
            !this.isEmptyObject(allGearAndStats[currentGearIndex]['gear'])
    ) {
      let gear = allGearAndStats[currentGearIndex]['gear'];
      if (!this.isEmptyObject(gear)) {
        return <CharacterGearTable className={className} attr={gear[field]} />;
      }
      else if (!this.isEmptyObject(gear.slot_mainhand)) {
        return <CharacterGearTable className={className} attr={gear[field]} />;
      }
    }
    return null;
  }
  renderGearTables() {
    const { allGearAndStats, currentGearIndex } = this.state;

    let mainhand_table = this.renderGearTable('mainhand_table', 'slot_mainhand');
    let offhand_table = this.renderGearTable('offhand_table', 'slot_offhand');
    let head_table = this.renderGearTable('head_table', 'slot_head');
    let body_table = this.renderGearTable('body_table', 'slot_body');
    let hands_table = this.renderGearTable('hands_table', 'slot_hands');
    let waist_table = this.renderGearTable('waist_table', 'slot_waist');
    let legs_table = this.renderGearTable('legs_table', 'slot_legs');
    let feets_table = this.renderGearTable('feets_table', 'slot_feet');
    let necklace_table = this.renderGearTable('necklace_table', 'slot_necklace');
    let earringss_table = this.renderGearTable('earringss_table', 'slot_earrings');
    let bracelets_table = this.renderGearTable('bracelets_table', 'slot_bracelets');
    let ring1_table = this.renderGearTable('ring1_table', 'slot_ring1');
    let ring2_table = this.renderGearTable('ring2_table', 'slot_ring2');                    

    if (allGearAndStats.length > 0) {
      this.markLowestForItems();
    }

    var itemLvlAvg = null;
    if (allGearAndStats !== null &&
            allGearAndStats.length > 0 &&       
            !this.isEmptyObject(allGearAndStats[currentGearIndex]) &&
            !this.isEmptyObject(allGearAndStats[currentGearIndex])
    ) {
      itemLvlAvg = allGearAndStats[currentGearIndex].avgItemLvl;
    }

    return (
      <div className='charaGear'>
        <div className='itemLvlAvg'><strong>Avg Item Lvl:</strong> {itemLvlAvg}</div>
        {mainhand_table}
        {offhand_table}
        {head_table}
        {body_table}
        {hands_table}
        {waist_table}
        {legs_table}
        {feets_table}
        {necklace_table}
        {earringss_table}
        {bracelets_table}
        {ring1_table}
        {ring2_table}
      </div>
    );
  }    
  handleSetChange(event) {
    this.setState({
      currentGearIndex: event.target.value
    });
    this.markLowestForItems();
  }
  renderCharaSets() {
    const { id, allGearAndStats, currentGearIndex } = this.state;
    var options = [];
    for(let i = 0, allGearAndStatsCount = allGearAndStats.length; i < allGearAndStatsCount; i += 1) {
      let gearSet = allGearAndStats[i];
      options.push(
        <option value={i} key={gearSet.id} className={gearSet.abbr}>{gearSet.name}</option>
      );
    }
    let optionId = 'gearSelect_' + id;
    return (
      <div className='currentGearSelect'>
        <select id={optionId} value={currentGearIndex} onChange={this.handleSetChange}>
          {options}
        </select>
      </div>
    );
  }
  render() {
    const { error, /* id, allGearAndStats, currentGearIndex, */ name, img, url_lodestone } = this.state;
    if (!error) setTimeout(function() { this.setup(); }.bind(this), 60000);

    var charaStats = this.renderStatTables();
    var charaGear = this.renderGearTables();
    var charaSets = this.renderCharaSets();

    var roleAbbr = null;
    var roleIcon = null;
    var roleName = null;
    var roleLvl = null;
    if (this.state.allGearAndStats !== null &&
            this.state.allGearAndStats.length > 0 &&       
            !this.isEmptyObject(this.state.allGearAndStats[this.state.currentGearIndex])
    ) {
      let current = this.state.allGearAndStats[this.state.currentGearIndex];
      roleAbbr = current.abbr;
      roleIcon = current.icon;
      roleName = current.name;
      roleLvl = current.level;
    }

    var charaClass = 'charaHolder slideExpandUp ' + roleAbbr;
    if (name !== '' && name !== null) {
      return (
        <div key='{id}' className={charaClass}>
          <div className='charaInfo'>
            <a href={url_lodestone}>
              <img className='charaImg' src={img} />
              <img className='charaImg' src={roleIcon} title={roleName} />
              <strong title={name}>{name}</strong> <span>lvl.{roleLvl}</span>
            </a>
          </div>
          {charaSets}
          {charaStats}
          {charaGear}
        </div>
      );
    }
    else {
      return null;
    }
  }
}

function mergeSort(arr)
{
  if (arr.length < 2)
    return arr;

  var middle = parseInt(arr.length / 2);
  var left   = arr.slice(0, middle);
  var right  = arr.slice(middle, arr.length);

  return merge(mergeSort(left), mergeSort(right));
}

function merge(left, right)
{
  var result = [];

  while (left.length && right.length) {
    if (parseInt(left[0].innerHTML, 10) <= parseInt(right[0].innerHTML, 10)) {
      result.push(left.shift());
    } else {
      result.push(right.shift());
    }
  }

  while (left.length)
    result.push(left.shift());

  while (right.length)
    result.push(right.shift());

  return result;
}