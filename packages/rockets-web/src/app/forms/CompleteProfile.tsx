import { RJSFSchema } from '@rjsf/utils';

const schema: RJSFSchema = {
  properties: {
    favoriteColor: {
      type: 'string',
      title: 'Favorite Color',
      minLength: 1,
      maxLength: 8,
    },
    favoriteCar: {
      type: 'string',
      title: 'Favorite Car',
      minLength: 1,
      maxLength: 12,
    },
    age: {
      type: 'number',
      title: 'Your Age',
      minimum: 1,
      maximum: 150,
    },
  },
  required: ['favoriteColor', 'age'],
};

export default schema;
