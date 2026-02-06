import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'libs/backend/graphql/src/lib/schemas/*.graphql',
  generates: {
    'libs/shared/data-access/core/src/generated/graphql.ts': {
      plugins: ['typescript'],
      config: {
        addExplicitOverride: true,
        typesPrefix: 'I',
      },
    },
    'libs/shared/data-access/core/src/generated.schema.json': {
      plugins: ['introspection'],
    },
    'libs/shared/data-access/registration/src/generated/graphql.ts': {
      documents: `libs/shared/data-access/registration/src/lib/**/*.gql`,
      plugins: ['typescript-operations', 'typescript-document-nodes'],
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: '~@fsms/data-access/core',
      },
      config: {
        gqlImport: '@apollo/client#gql',
        addExplicitOverride: true,
        typesPrefix: 'I',
        skipTypename: true,
        scalars: {
          DateTime: 'string',
          URL: 'string',
          UUID: 'string',
          PositiveInt: 'number',
          PositiveFloat: 'number',
          EmailAddress: 'string',
          PhoneNumber: 'string',
        },
      },
    },
    'libs/shared/data-access/auth/src/generated/graphql.ts': {
      documents: `libs/shared/data-access/auth/src/lib/**/*.gql`,
      plugins: ['typescript-operations', 'typescript-document-nodes'],
      preset: 'near-operation-file',
      presetConfig: {
        extension: '.generated.ts',
        baseTypesPath: '~@fsms/data-access/core',
      },
      config: {
        gqlImport: '@apollo/client#gql',
        addExplicitOverride: true,
        typesPrefix: 'I',
        skipTypename: true,
        scalars: {
          DateTime: 'string',
          URL: 'string',
          UUID: 'string',
          PositiveInt: 'number',
          PositiveFloat: 'number',
          EmailAddress: 'string',
          PhoneNumber: 'string',
        },
      },
    },
  },
};

export default config;
