const fs = require('fs');
const luaparse = require('luaparse');
const moment = require('moment');

const includedProperties = ['secondsRemaining', 'name'];

function getInstanceText(instance) {
  let spaces = '';
  for (let i = 0; i < 18 - instance.name.length; i++) {
    spaces += ' ';
  }

  return `${instance.name} ${spaces} | ${instance.resetDate} @ 10AM\n`;
}

function getTimeRemaining(secondsRemaining) {
  return moment().add(secondsRemaining, 'seconds').format('dddd MM/DD/YY');
}

function parseSavedVariables(savedVariablesPath) {
  console.log('');
  try {
    const data = fs.readFileSync(savedVariablesPath, 'utf8');
    const savedInstances = luaparse.parse(data);

    const instances = getInstanceData(savedInstances);

    const lockedInstances = instances.map(instance => {
      const instanceId = instance.key.value;
      const instanceFields = instance.value.fields;

      const instanceData = {};

      instanceFields.forEach(field => {
        const key = removeQuotes(field.key.raw);
        const rawValue = field.value.raw;
        const jsValue = field.value.value;

        if (includedProperties.includes(key)) {
          let value = jsValue || removeQuotes(rawValue);

          if (key === 'secondsRemaining') {
            value = getTimeRemaining(value);
            instanceData.resetDate = value;
          } else if (key === 'name') {
            instanceData.name = value;
          }
        }
      });

      return instanceData;
    }).sort(sortInstances);

    console.log(lockedInstances);
    writeInstancesToFile(lockedInstances);
  } catch (err) {
    console.error(err);
  }
}

function getInstanceData(data) {
  return data.body[0].init[0].fields;
}

function removeQuotes(str) {
  return str.replace(/"/g, '');
}

function sortInstances(i, j) {
  return moment(i.resetDate).isBefore(j.resetDate);
}

function writeInstancesToFile(instances) {
  const filePath = 'H:\\MyLockedInstances';

  try {
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error(err);
  }

  instances.forEach(instance => {
    fs.appendFile(filePath, getInstanceText(instance), err => {
      if (err) {
        console.error(err);
        return;
      }
    })
  });
}

module.exports = {
  parseSavedVariables
};
