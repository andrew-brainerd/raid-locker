const fs = require('fs');
const luaparse = require('luaparse');

function parseSavedVariables(savedVariablesPath) {
  console.log('');
  try {
    const data = fs.readFileSync(savedVariablesPath, 'utf8');
    const savedInstances = luaparse.parse(data);

    const instances = getInstanceData(savedInstances);

    instances.forEach(instance => {
      const instanceId = instance.key.value;
      const instanceFields = instance.value.fields;

      console.log('Instance ID:', instanceId);

      instanceFields.forEach(field => {
        const key = removeQuotes(field.key.raw);
        const rawValue = field.value.raw;
        const jsValue = field.value.value;

        console.log({
          key,
          value: jsValue || removeQuotes(rawValue)
        });
      });

      console.log('');
      console.log('');
    });
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

module.exports = {
  parseSavedVariables
};
