# ⚙️ CONFIGURATION GUIDE

> **For AI Tools**: This guide contains all application setup and configuration patterns for Rockets SDK. Use this when setting up new applications or configuring rockets-server and rockets-server-auth packages.

## 📋 **Quick Reference**

| Task | Section | Time |
|------|---------|------|
| **Module Import Order** | [Module Import Order](#module-import-order) | 2 min |
| Setup main.ts application | [Application Bootstrap](#application-bootstrap) | 5 min |
| Configure rockets-server | [Rockets Server Configuration](#rockets-server-configuration) | 10 min |
| Configure rockets-server-auth | [Rockets Server Auth Configuration](#rockets-server-auth-configuration) | 15 min |
| Environment variables | [Environment Configuration](#environment-configuration) | 5 min |
| Database setup | [Database Configuration](#database-configuration) | 10 min |

---

## ⚠️ **`RocketsModule.forRoot()` — the single wiring point**

> **Verified against `@bitwild/rockets@1.0.0-alpha.10` / `@bitwild/rockets-core@1.0.0-alpha.10`** (source: `../../rockets/packages/{rockets-server,rockets-core}`) and against this repo's actual `apps/api/src/app.module.ts`. Sections below describing a separate `RocketsAuthModule`/`RocketsServerModule` two-module wiring predate this package version and are **wrong for the currently installed SDK** — do not follow them.

There is one module import. `RocketsModule` (published as `@bitwild/rockets`, defined in `rockets-server`, thin composition layer over `@bitwild/rockets-core`) takes everything as `forRoot()` options: the auth adapter(s), the user-metadata config, the repository bootstrap, declarative CRUD resources, and — as of this version — **access control nested inside the same call**.

```typescript
// app.module.ts (real, current — see apps/api/src/app.module.ts)
import { Module } from '@nestjs/common';
import { RocketsModule, defineTypeOrmRepository } from '@bitwild/rockets';
import { defineMicrosoftAuth } from './auth-microsoft';
import { getDatabaseConfig } from './config/database.config';
import { userMetadata } from './modules/user-metadata';
import { workflowsResource } from './modules/workflows/workflows.resource';
import { appAcl } from './app.acl';
import { AppAccessControlService } from './access-control.service';

@Module({
  imports: [
    RocketsModule.forRoot({
      auth: defineMicrosoftAuth(),        // AuthBootstrap | AuthBootstrap[] — chain adapters here
      userMetadata,                        // RocketsUserMetadataConfig (entity/createDto/updateDto)
      repository: defineTypeOrmRepository(getDatabaseConfig()),
      resources: [workflowsResource],      // defineResource()/defineModuleResource()/zodResource() bundles
      enableGlobalGuard: true,             // registers AuthServerGuard as APP_GUARD
      accessControl: {                     // omit entirely to skip ACL — fully opt-in
        settings: { rules: appAcl },
        service: new AppAccessControlService(),
      },
    }),
  ],
})
export class AppModule {}
```

### **What each key does**

| Key | Type | Purpose |
|---|---|---|
| `auth` | `AuthBootstrap \| AuthBootstrap[]` | One or more `{ adapter, forRoot? }` bootstraps implementing `AuthAdapterInterface.authenticate(request)`. `AuthServerGuard` tries each adapter per request in order. Multiple identity providers = an array, e.g. `auth: [defineMicrosoftAuth(), someOtherAdapter]`. |
| `userMetadata` | `RocketsUserMetadataConfig` | `{ entity, createDto, updateDto, responseDto? }`. Powers `GET/PATCH /me`. Build by hand or via `defineZodUserMetadata()` (see below). |
| `repository` | `RepositoryModuleInterface \| RepositoryBootstrap` | `defineTypeOrmRepository(typeOrmModuleOptions)` wires TypeORM; core auto-derives the entity list from `resources` + `userMetadata` and calls `TypeOrmModule.forRoot()` itself — never list entities manually here. |
| `resources` | `ResourceInput[]` | CRUD resource bundles from `defineResource()`/`defineModuleResource()` (hand-built) or `zodResource()` (Zod-schema-derived). |
| `accessControl` | `AccessControlOptionsInterface & { imports?, queryServices? }` | Same shape `@concepta/nestjs-access-control`'s `AccessControlModule.forRoot()` always took (`settings.rules`, `service`), now nested here instead of a sibling top-level import. **Omit the key to run with no ACL at all.** |
| `enableGlobalGuard` | `boolean` | Registers `AuthServerGuard` globally so every route requires a matching auth adapter unless `@AuthPublic()`. |

### **Common error this version does NOT have**

The "wrong import order → `RocketsJwtAuthProvider` not found" error described in older docs does not apply — there is no `RocketsJwtAuthProvider` and no `RocketsAuthModule`/`RocketsModule` two-step dance in the currently installed SDK. If you see that error, you're reading generated code against a different (older or hypothetical) package version — check `node_modules/@bitwild/rockets/package.json` version and cross-reference `../../rockets/packages/rockets-server/src` directly, not this doc's older sections below.

---

## 🚀 **Application Bootstrap**

### **Main Application Setup (main.ts)**

Real, current pattern — see `apps/api/src/main.ts`. `SwaggerUiService` and `ExceptionsFilter` are re-exported from `@bitwild/rockets` (originating in `@bitwild/rockets-core`):

```typescript
// main.ts
import 'dotenv/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ExceptionsFilter, SwaggerUiService } from '@bitwild/rockets';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      forbidUnknownValues: true,
    }),
  );

  const swaggerUiService = app.get(SwaggerUiService);
  swaggerUiService
    .builder()
    .setTitle('Rockets Starter API')
    .setDescription('Rockets SDK starter')
    .setVersion('1.0')
    .addBearerAuth();

  const swaggerPath = process.env.SWAGGER_UI_PATH ?? 'api';
  const document = SwaggerModule.createDocument(app, swaggerUiService.builder().build());
  SwaggerModule.setup(swaggerPath, app, document);

  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new ExceptionsFilter(httpAdapterHost));

  await app.listen(Number(process.env.PORT ?? 3001));
}

bootstrap();
```

`SwaggerUiService.builder()` returns a standard `@nestjs/swagger` `DocumentBuilder` — chain `.addTag(...)` etc. on it same as vanilla NestJS. There is no separate "automatic setup" magic beyond this.

---

## 🔧 **Everything below this line predates the current package version**

> The "Rockets Server Configuration" / "Rockets Server Auth Configuration" sections below describe a `RocketsServerModule` + `RocketsAuthModule.forRootAsync({settings:{authLocal, authOAuth, otp, email, ...}})` split that **does not exist** in the currently installed `@bitwild/rockets@1.0.0-alpha.10`. There is one module (`RocketsModule.forRoot(...)`, documented above) and no built-in OTP/email/OAuth config block — those concerns live in the separate `@bitwild/rockets-auth` package's `defineRocketsAuth()` (password/JWT auth domain: user, credential, role, otp, invitation), which this project does not currently use (Microsoft Entra ID is the sole auth adapter). If a future project adds `defineRocketsAuth()`, read `../../rockets/packages/rockets-server-auth/src/define-rockets-auth.ts` directly rather than the sections below — they will not match.
>
> The Database Configuration, Environment Configuration, Docker, and general best-practice sections further down are still broadly accurate as generic NestJS/TypeORM advice and can be used as reference.

### **Basic Setup (External Auth Provider) — ⚠️ outdated, `RocketsServerModule` does not exist**

```typescript
// app.module.ts - rockets-server only
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RocketsServerModule } from '@bitwild/rockets-server';
import { YourExternalAuthProvider } from './auth/your-external-auth.provider';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
      }),
    }),

    RocketsServerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        authProvider: YourExternalAuthProvider, // Auth0, Firebase, etc.
        settings: {
          metadata: {
            enabled: true,
            userMetadataEntity: 'UserMetadataEntity',
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
```

### **External Auth Provider Example**

```typescript
// auth/auth0.provider.ts
import { Injectable } from '@nestjs/common';
import { AuthProviderInterface } from '@bitwild/rockets-server';

@Injectable()
export class Auth0Provider implements AuthProviderInterface {
  async validateUser(token: string): Promise<any> {
    // Validate JWT token with Auth0
    // Return user object or throw error
    try {
      const decoded = jwt.verify(token, process.env.AUTH0_PUBLIC_KEY);
      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

---

## 🔐 **⚠️ outdated — Rockets Server Auth Configuration**

### **Complete Auth System Setup**

```typescript
// app.module.ts - rockets-server-auth
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RocketsAuthModule } from '@bitwild/rockets-server-auth';

@Module({
  imports: [
    ConfigModule.forRoot({ 
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),
    
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        url: configService.get('DATABASE_URL'),
        autoLoadEntities: true,
        synchronize: configService.get('NODE_ENV') === 'development',
        logging: configService.get('NODE_ENV') === 'development',
        ssl: configService.get('NODE_ENV') === 'production' ? {
          rejectUnauthorized: false
        } : false,
      }),
    }),

    RocketsAuthModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        settings: {
          // JWT Configuration
          jwt: {
            secret: configService.get('JWT_SECRET'),
            expiresIn: configService.get('JWT_EXPIRES_IN', '1h'),
          },
          
          // Authentication Methods
          authLocal: {
            enabled: true,
            usernameField: 'email',
            passwordField: 'password',
          },
          
          authJwt: {
            enabled: true,
            secretKey: configService.get('JWT_SECRET'),
          },

          // OAuth Providers
          authOAuth: {
            enabled: true,
            google: {
              clientId: configService.get('GOOGLE_CLIENT_ID'),
              clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
              callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
            },
            github: {
              clientId: configService.get('GITHUB_CLIENT_ID'),
              clientSecret: configService.get('GITHUB_CLIENT_SECRET'),
              callbackURL: configService.get('GITHUB_CALLBACK_URL'),
            },
          },

          // Password Recovery
          authRecovery: {
            enabled: true,
            expiresIn: '1h',
            email: {
              from: configService.get('EMAIL_FROM'),
              subject: 'Password Recovery',
            },
          },

          // Email Verification
          authVerify: {
            enabled: true,
            expiresIn: '24h',
            email: {
              from: configService.get('EMAIL_FROM'),
              subject: 'Verify Your Email',
            },
          },

          // OTP/2FA
          otp: {
            enabled: true,
            expiresIn: '5m',
            length: 6,
            email: {
              from: configService.get('EMAIL_FROM'),
              subject: 'Your OTP Code',
            },
          },

          // User Management
          user: {
            enabled: true,
            adminRoleName: 'Admin',
            defaultRoleName: 'User',
          },

          // Admin Features
          userAdmin: {
            enabled: true,
            adminPath: '/admin',
          },

          // Email Configuration
          email: {
            transport: {
              host: configService.get('SMTP_HOST'),
              port: parseInt(configService.get('SMTP_PORT', '587')),
              secure: configService.get('SMTP_SECURE') === 'true',
              auth: {
                user: configService.get('SMTP_USER'),
                pass: configService.get('SMTP_PASS'),
              },
            },
            defaults: {
              from: configService.get('EMAIL_FROM'),
            },
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
```

### **Minimal Auth Configuration**

```typescript
// app.module.ts - minimal rockets-server-auth
RocketsAuthModule.forRoot({
  settings: {
    // Enable only what you need
    authLocal: { enabled: true },
    authJwt: { enabled: true },
    user: { enabled: true },
    
    // Minimal email configuration
    email: {
      transport: {
        host: 'localhost',
        port: 1025, // MailHog for development
      },
    },
  },
})
```

### **Complete Configuration with CRUD Admin**

```typescript
// app.module.ts - Complete auth with admin CRUD functionality
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExtModule } from '@concepta/nestjs-typeorm-ext';
import { RocketsAuthModule } from '@bitwild/rockets-server-auth';
import { 
  UserEntity, 
  RoleEntity, 
  UserTypeOrmCrudAdapter, 
  RoleTypeOrmCrudAdapter,
  RocketsAuthUserDto,
  RocketsAuthRoleDto,
  RocketsAuthUserCreateDto,
  RocketsAuthUserUpdateDto,
  RocketsAuthRoleCreateDto,
  RocketsAuthRoleUpdateDto,
} from '@bitwild/rockets-server-auth';

@Module({
  imports: [
    // Enhanced TypeORM for model services
    TypeOrmExtModule.forFeature({
      user: { entity: UserEntity },
      role: { entity: RoleEntity },
    }),
    
    // Standard TypeORM for CRUD operations (required for adapters)
    TypeOrmModule.forFeature([UserEntity, RoleEntity]),
    
    RocketsAuthModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        settings: {
          authLocal: { enabled: true },
          authJwt: { enabled: true },
          user: { enabled: true },
          userAdmin: { enabled: true },
        },
        
        // User CRUD Admin Configuration
        userCrud: {
          imports: [TypeOrmModule.forFeature([UserEntity])], // Required for adapter
          adapter: UserTypeOrmCrudAdapter,
          model: RocketsAuthUserDto,
          dto: {
            createOne: RocketsAuthUserCreateDto,
            updateOne: RocketsAuthUserUpdateDto,
          },
        },
        
        // Role CRUD Admin Configuration  
        roleCrud: {
          imports: [TypeOrmModule.forFeature([RoleEntity])], // Required for adapter
          adapter: RoleTypeOrmCrudAdapter,
          model: RocketsAuthRoleDto,
          dto: {
            createOne: RocketsAuthRoleCreateDto,
            updateOne: RocketsAuthRoleUpdateDto,
          },
        },
      }),
    }),
  ],
})
export class AppModule {}
```

**Key Points:**

### 📌 **TypeORM Module Usage: When to Use Which?**

#### **TypeOrmExtModule.forFeature({ ... })**

**Purpose:** Dynamic repository injection for Model Services

**When to use:**
- ✅ When you need to inject repositories into **Model Services** (e.g., `UserModelService`, `RoleModelService`)
- ✅ When using `@InjectDynamicRepository()` decorator
- ✅ **REQUIRED** by Rockets packages (rockets-server, rockets-server-auth) for their internal Model Services
- ✅ Provides enhanced repository features and dynamic token injection

**Pattern:**
```typescript
TypeOrmExtModule.forFeature({
  user: { entity: UserEntity },        // Key-based injection
  role: { entity: RoleEntity },
  pet: { entity: PetEntity },
})
```

**Usage in services:**
```typescript
@Injectable()
export class PetModelService {
  constructor(
    @InjectDynamicRepository('pet')  // Matches the key above
    private readonly repo: Repository<PetEntity>,
  ) {}
}
```

---

#### **TypeOrmModule.forFeature([...])**

**Purpose:** Standard TypeORM repository injection for CRUD operations

**When to use:**
- ✅ When you need to inject repositories into **CRUD Adapters** (e.g., `PetTypeOrmCrudAdapter`)
- ✅ When using `@InjectRepository()` decorator (standard TypeORM)
- ✅ **REQUIRED** for all CRUD operations with TypeORM adapters
- ✅ **REQUIRED** in CRUD configuration imports (userCrud, roleCrud, etc.)

**Pattern:**
```typescript
TypeOrmModule.forFeature([UserEntity, RoleEntity, PetEntity])  // Array of entities
```

**Usage in adapters:**
```typescript
@Injectable()
export class PetTypeOrmCrudAdapter {
  constructor(
    @InjectRepository(PetEntity)  // Standard TypeORM injection
    private readonly repo: Repository<PetEntity>,
  ) {}
}
```

---

#### **When You Need Both (Common Pattern)**

**For most CRUD modules, you'll use BOTH:**

```typescript
@Module({
  imports: [
    // For CRUD operations (adapters)
    TypeOrmModule.forFeature([PetEntity]),
    
    // For Model Services (model services used by Rockets)
    TypeOrmExtModule.forFeature({
      pet: { entity: PetEntity },
    }),
  ],
  providers: [
    PetTypeOrmCrudAdapter,  // Uses TypeOrmModule
    PetModelService,         // Uses TypeOrmExtModule
    PetCrudService,
  ],
})
export class PetModule {}
```

---

#### **Quick Decision Tree**

```
Are you implementing CRUD operations?
├─ YES → Use TypeOrmModule.forFeature([Entity])
│        (Required for CrudAdapter)
│
└─ Are you using Rockets Model Services?
   └─ YES → ALSO use TypeOrmExtModule.forFeature({ key: { entity: Entity } })
            (Required for ModelService injection)
```

---

#### **Common Mistakes to Avoid**

❌ **Mistake 1:** Only using `TypeOrmExtModule` for CRUD
```typescript
// WRONG - CRUD adapters need TypeOrmModule
@Module({
  imports: [
    TypeOrmExtModule.forFeature({ pet: { entity: PetEntity } }),
  ],
  providers: [PetTypeOrmCrudAdapter], // ❌ Won't work!
})
```

❌ **Mistake 2:** Forgetting `TypeOrmModule` in CRUD config imports
```typescript
// WRONG - CRUD config needs its own imports
userCrud: {
  adapter: UserTypeOrmCrudAdapter,  // ❌ Won't find repository!
  // Missing: imports: [TypeOrmModule.forFeature([UserEntity])]
}
```

✅ **Correct:** Include both when needed
```typescript
@Module({
  imports: [
    TypeOrmModule.forFeature([PetEntity]),      // For CRUD
    TypeOrmExtModule.forFeature({               // For Model Services
      pet: { entity: PetEntity },
    }),
  ],
})
```

---

#### **Summary**

| Module | Use For | Injection | Pattern |
|--------|---------|-----------|---------|
| `TypeOrmExtModule` | Model Services | `@InjectDynamicRepository('key')` | `{ key: { entity: Entity } }` |
| `TypeOrmModule` | CRUD Adapters | `@InjectRepository(Entity)` | `[Entity]` |

**Rule of Thumb:** If you're doing CRUD operations with Rockets → **Use both**

---

## 🗄️ **Database Configuration**

### **PostgreSQL (Recommended for Production)**

```typescript
// Database configuration with connection pooling
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'postgres',
    url: configService.get('DATABASE_URL'),
    autoLoadEntities: true,
    synchronize: configService.get('NODE_ENV') === 'development',
    logging: configService.get('NODE_ENV') === 'development',
    
    // Connection pooling
    extra: {
      max: parseInt(configService.get('DB_MAX_CONNECTIONS', '10')),
      min: parseInt(configService.get('DB_MIN_CONNECTIONS', '1')),
      acquire: parseInt(configService.get('DB_ACQUIRE_TIMEOUT', '60000')),
      idle: parseInt(configService.get('DB_IDLE_TIMEOUT', '10000')),
    },
    
    // SSL configuration for production
    ssl: configService.get('NODE_ENV') === 'production' ? {
      rejectUnauthorized: false
    } : false,
  }),
})
```

### **SQLite (Development Only)**

```typescript
// Simple SQLite for development
TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'database.sqlite',
  autoLoadEntities: true,
  synchronize: true,
  logging: true,
})
```

### **MySQL/MariaDB Alternative**

```typescript
TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    type: 'mysql',
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT', '3306')),
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_DATABASE'),
    autoLoadEntities: true,
    synchronize: configService.get('NODE_ENV') === 'development',
  }),
})
```

---

## 🌍 **Environment Configuration**

### **Complete Environment Variables**

```bash
# .env file
# Database Configuration
DATABASE_URL=postgresql://username:password@localhost:5432/rockets_db
DB_MAX_CONNECTIONS=10
DB_MIN_CONNECTIONS=1

# Application Settings
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=1h

# Email Configuration (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="Your App <noreply@yourapp.com>"

# OAuth Configuration
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:3000/auth/google/callback

GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:3000/auth/github/callback

# External Auth (if using rockets-server only)
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=your-auth0-client-id
AUTH0_CLIENT_SECRET=your-auth0-client-secret
AUTH0_PUBLIC_KEY=your-auth0-public-key

# File Storage (Optional)
S3_BUCKET=your-s3-bucket
S3_REGION=us-east-1
S3_ACCESS_KEY=your-access-key
S3_SECRET_KEY=your-secret-key

# Logging (Optional)
SENTRY_DSN=your-sentry-dsn
LOG_LEVEL=info
```

### **Environment Validation**

```typescript
// config/env.validation.ts
import { plainToClass, Transform } from 'class-transformer';
import { IsString, IsNumber, IsBoolean, validateSync } from 'class-validator';

export class EnvironmentVariables {
  @IsString()
  DATABASE_URL: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  PORT: number = 3000;

  @IsString()
  JWT_SECRET: string;

  @IsString()
  SMTP_HOST: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  SMTP_PORT: number = 587;

  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  SMTP_SECURE: boolean = false;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}

// Use in app.module.ts
ConfigModule.forRoot({
  validate,
  isGlobal: true,
})
```

---

## 🔧 **Advanced Configuration Patterns**

### **Multi-Environment Setup**

```typescript
// config/configuration.ts
export default () => ({
  port: parseInt(process.env.PORT, 10) || 3000,
  database: {
    url: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production',
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '1h',
  },
  email: {
    transport: {
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    },
  },
  oauth: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
  },
});

// Use in app.module.ts
ConfigModule.forRoot({
  load: [configuration],
  isGlobal: true,
})
```

### **Custom Configuration Service**

```typescript
// config/app.config.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private configService: ConfigService) {}

  get jwtSecret(): string {
    return this.configService.get('JWT_SECRET');
  }

  get databaseUrl(): string {
    return this.configService.get('DATABASE_URL');
  }

  get emailConfig() {
    return {
      host: this.configService.get('SMTP_HOST'),
      port: parseInt(this.configService.get('SMTP_PORT', '587')),
      secure: this.configService.get('SMTP_SECURE') === 'true',
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    };
  }

  get googleOAuth() {
    return {
      clientId: this.configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: this.configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: this.configService.get('GOOGLE_CALLBACK_URL'),
    };
  }
}
```

---

## 🐳 **Docker Configuration**

### **Docker Compose for Development**

```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
      - DATABASE_URL=postgresql://postgres:password@db:5432/rockets_db
      - JWT_SECRET=your-super-secret-jwt-key
    depends_on:
      - db
      - redis
    volumes:
      - .:/app
      - /app/node_modules

  db:
    image: postgres:15
    environment:
      - POSTGRES_DB=rockets_db
      - POSTGRES_USER=postgres
      - POSTGRES_PASSWORD=password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

  mailhog:
    image: mailhog/mailhog:latest
    ports:
      - "1025:1025"
      - "8025:8025"

volumes:
  postgres_data:
```

### **Dockerfile**

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
```

---

## ✅ **Configuration Best Practices**

### **1. Security Configuration**
```typescript
// Security headers
app.use(helmet({
  crossOriginEmbedderPolicy: false,
}));

// Rate limiting
app.use(rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));
```

### **2. Logging Configuration**
```typescript
// Enhanced logging
const logger = new Logger('Bootstrap');
logger.log(`🚀 Application running on port ${port}`);
logger.log(`📚 API Documentation: http://localhost:${port}/api`);
logger.log(`🗄️ Database: ${configService.get('NODE_ENV')}`);
```

### **3. Graceful Shutdown**
```typescript
// main.ts
process.on('SIGTERM', async () => {
  logger.log('SIGTERM received, shutting down gracefully');
  await app.close();
  process.exit(0);
});
```

---

## 🎯 **Configuration Checklist**

### **✅ Essential Configuration**
- [ ] Environment variables configured
- [ ] Database connection working
- [ ] JWT secret set (minimum 32 characters)
- [ ] Email transport configured
- [ ] Swagger documentation accessible
- [ ] CORS configured for frontend

### **✅ Production Ready**
- [ ] SSL/TLS enabled
- [ ] Database connection pooling
- [ ] Environment validation
- [ ] Logging configured
- [ ] Error monitoring (Sentry)
- [ ] Rate limiting enabled
- [ ] Security headers applied

### **✅ Optional Features**
- [ ] OAuth providers configured
- [ ] File storage (S3) configured
- [ ] Redis caching enabled
- [ ] Email templates customized
- [ ] Admin panel enabled

---

## 🚀 **Next Steps**

After completing configuration:

1. **📖 Read [CRUD_PATTERNS_GUIDE.md](./CRUD_PATTERNS_GUIDE.md)** - Implement business modules
2. **📖 Read [ACCESS_CONTROL_GUIDE.md](./ACCESS_CONTROL_GUIDE.md)** - Configure security
3. **📖 Read [AI_TEMPLATES_GUIDE.md](./AI_TEMPLATES_GUIDE.md)** - Generate modules

**⚡ Your Rockets application is now configured and ready for development!**