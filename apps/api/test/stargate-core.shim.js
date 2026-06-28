class Registry {
  constructor(components) {
    this.components = components;
  }
}

class Workflow {
  constructor(options) {
    this.options = options;
  }
}

const schema = {
  optional() {
    return this;
  },
};

const z = {
  array: () => schema,
  number: () => schema,
  object: () => schema,
  record: () => schema,
  string: () => schema,
  unknown: () => schema,
};

const FieldType = {
  Json: 'Json',
  TextInput: 'TextInput',
};

function createAction(action) {
  return action;
}

function createParameter(parameter) {
  return parameter;
}

module.exports = {
  createAction,
  createParameter,
  FieldType,
  Registry,
  Workflow,
  z,
};
