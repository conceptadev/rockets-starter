/**
 * Micro-app schema: a small JSON-Schema subset (authored in Zod in Cowork, shipped
 * as JSON Schema) plus `x-*` extensions that drive storage, authz and UI. This is
 * the single source of truth for validation + DB record shaping + generative UI.
 *
 * Supported `x-*` extensions:
 *   x-entity     logical entity name within the app (default = app name)
 *   x-primaryKey business key field(s) used to dedupe on upsert
 *   x-store      "upsert" (current state) | "append" (history/snapshots)
 *   x-rows       path into the flow result holding the array of rows to sync
 *   x-writeOn    "install" | "manual" (cron can be added later)
 *   x-version    integer schema version
 *   x-acl        { read?: "own"|"any"; write?: "own"|"any" }
 *   x-ui         presentation hints (passed through to the renderer)
 */

export type JsonSchemaType =
  | 'string'
  | 'number'
  | 'integer'
  | 'boolean'
  | 'array'
  | 'object';

export interface JsonSchemaProperty {
  type?: JsonSchemaType;
  format?: string;
  enum?: unknown[];
  items?: JsonSchemaProperty;
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  description?: string;
  [key: string]: unknown;
}

export type AclMode = 'own' | 'any';
export type StoreMode = 'upsert' | 'append';
export type WriteOn = 'install' | 'manual';

export interface AppSchema extends JsonSchemaProperty {
  type?: 'object';
  properties?: Record<string, JsonSchemaProperty>;
  required?: string[];
  'x-entity'?: string;
  'x-primaryKey'?: string | string[];
  'x-store'?: StoreMode;
  'x-rows'?: string;
  'x-writeOn'?: WriteOn;
  'x-version'?: number;
  'x-acl'?: { read?: AclMode; write?: AclMode };
  'x-ui'?: Record<string, unknown>;
}

const ALLOWED_TYPES: ReadonlySet<string> = new Set([
  'string',
  'number',
  'integer',
  'boolean',
  'array',
  'object',
]);

/** Validates that the *schema document itself* is safe and well-formed. */
export function validateSchemaShape(schema: unknown): string[] {
  const errors: string[] = [];
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) {
    return ['schema must be a JSON object'];
  }
  const s = schema as AppSchema;
  if (s.type && s.type !== 'object') {
    errors.push('schema.type must be "object"');
  }
  const props = s.properties ?? {};
  if (typeof props !== 'object') {
    errors.push('schema.properties must be an object');
    return errors;
  }
  for (const [name, prop] of Object.entries(props)) {
    if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(name)) {
      errors.push(`property "${name}" has an unsafe name`);
    }
    if (prop?.type && !ALLOWED_TYPES.has(prop.type)) {
      errors.push(`property "${name}" has unsupported type "${prop.type}"`);
    }
  }
  const store = getStoreMode(s);
  if (store === 'upsert' && getPrimaryKey(s).length === 0) {
    errors.push('x-store "upsert" requires x-primaryKey');
  }
  return errors;
}

/** Validates a row value against the schema. Returns a list of errors (empty = ok). */
export function validateRow(schema: AppSchema, value: unknown): string[] {
  return validateObject(schema, value, '');
}

function validateObject(
  schema: JsonSchemaProperty,
  value: unknown,
  path: string,
): string[] {
  const errors: string[] = [];
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return [`${path || 'value'} must be an object`];
  }
  const obj = value as Record<string, unknown>;
  const props = schema.properties ?? {};
  for (const req of schema.required ?? []) {
    if (obj[req] === undefined || obj[req] === null) {
      errors.push(`${join(path, req)} is required`);
    }
  }
  for (const [name, prop] of Object.entries(props)) {
    if (obj[name] === undefined || obj[name] === null) continue;
    errors.push(...validateValue(prop, obj[name], join(path, name)));
  }
  return errors;
}

function validateValue(
  prop: JsonSchemaProperty,
  value: unknown,
  path: string,
): string[] {
  if (Array.isArray(prop.enum) && prop.enum.length > 0) {
    if (!prop.enum.some((e) => e === value)) {
      return [`${path} must be one of ${JSON.stringify(prop.enum)}`];
    }
  }
  switch (prop.type) {
    case undefined:
      return [];
    case 'string':
      return typeof value === 'string' ? [] : [`${path} must be a string`];
    case 'number':
      return typeof value === 'number' && !Number.isNaN(value)
        ? []
        : [`${path} must be a number`];
    case 'integer':
      return typeof value === 'number' && Number.isInteger(value)
        ? []
        : [`${path} must be an integer`];
    case 'boolean':
      return typeof value === 'boolean' ? [] : [`${path} must be a boolean`];
    case 'array': {
      if (!Array.isArray(value)) return [`${path} must be an array`];
      if (!prop.items) return [];
      return value.flatMap((item, i) =>
        validateValue(prop.items as JsonSchemaProperty, item, `${path}[${i}]`),
      );
    }
    case 'object':
      return validateObject(prop, value, path);
    default:
      return [];
  }
}

function join(path: string, key: string): string {
  return path ? `${path}.${key}` : key;
}

export function getEntityKey(schema: AppSchema, app: string): string {
  return schema['x-entity'] ?? app;
}

export function getPrimaryKey(schema: AppSchema): string[] {
  const pk = schema['x-primaryKey'];
  if (!pk) return [];
  return Array.isArray(pk) ? pk : [pk];
}

export function getStoreMode(schema: AppSchema): StoreMode {
  return schema['x-store'] === 'append' ? 'append' : 'upsert';
}

export function getWriteOn(schema: AppSchema): WriteOn {
  return schema['x-writeOn'] === 'manual' ? 'manual' : 'install';
}

export function getRowsPath(schema: AppSchema): string | undefined {
  return typeof schema['x-rows'] === 'string' ? schema['x-rows'] : undefined;
}

export function getVersion(schema: AppSchema): number {
  const v = schema['x-version'];
  return typeof v === 'number' && Number.isInteger(v) && v > 0 ? v : 1;
}

export function getReadAcl(schema: AppSchema): AclMode {
  return schema['x-acl']?.read === 'any' ? 'any' : 'own';
}

export function getWriteAcl(schema: AppSchema): AclMode {
  return schema['x-acl']?.write === 'any' ? 'any' : 'own';
}

/** Derives the dedupe key for `upsert` from the schema's x-primaryKey. */
export function deriveBusinessKey(
  schema: AppSchema,
  row: Record<string, unknown>,
): string | null {
  const keys = getPrimaryKey(schema);
  if (keys.length === 0) return null;
  return keys.map((k) => String(row[k] ?? '')).join('|');
}

/** Reads a dotted path (e.g. "compose.accounts") out of a result object. */
export function readPath(source: unknown, path: string): unknown {
  return path
    .split('.')
    .reduce<unknown>(
      (acc, key) =>
        acc && typeof acc === 'object'
          ? (acc as Record<string, unknown>)[key]
          : undefined,
      source,
    );
}
