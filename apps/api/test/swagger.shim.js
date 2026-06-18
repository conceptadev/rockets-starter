const noopDecorator = () => () => undefined;

class EmptyDto {}

const SwaggerModule = {
  createDocument: () => ({
    openapi: '3.0.0',
    info: { title: 'test', version: 'test' },
    paths: {},
  }),
  setup: () => undefined,
};

class DocumentBuilder {
  constructor() {
    return new Proxy(this, {
      get(target, property) {
        if (property in target) {
          return target[property];
        }

        return () => target;
      },
    });
  }

  build() {
    return {
      openapi: '3.0.0',
      info: { title: 'test', version: 'test' },
      paths: {},
    };
  }
}

const mappedTypes = {
  PartialType: (classRef) => classRef ?? EmptyDto,
  PickType: (classRef) => classRef ?? EmptyDto,
  OmitType: (classRef) => classRef ?? EmptyDto,
  IntersectionType: (classRef) => classRef ?? EmptyDto,
};

module.exports = new Proxy(
  {
    SwaggerModule,
    DocumentBuilder,
    ...mappedTypes,
  },
  {
    get(target, property) {
      if (property in target) {
        return target[property];
      }

      return noopDecorator;
    },
  },
);
