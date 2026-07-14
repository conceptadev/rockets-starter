# Rockets SDK - Advanced Authentication Guide

This guide covers advanced authentication patterns, customization techniques, and integration strategies for the Rockets Server SDK (@bitwild/rockets-server and @bitwild/rockets-server-auth).

> **⚠️ Important Note**: This guide contains advanced patterns and conceptual examples. Some examples may require additional services, dependencies, or custom implementations not provided by the SDK. Always verify method signatures and availability in your specific SDK version before implementation.

> **⚠️ Real contract (verified against `@bitwild/rockets-core@1.0.0-alpha.10`)**: the actual auth extension point is much simpler than most of what follows. There is no built-in local/OAuth/passport strategy system active in this version. Auth is one interface:
> ```typescript
> interface AuthAdapterInterface {
>   authenticate(request: AuthRequest): Promise<AuthAttemptResult>;
> }
> type AuthAttemptResult =
>   | { matched: false }
>   | { matched: true; user: AuthorizedUser }
>   | { matched: true; error: HttpException };
> interface AuthBootstrap<Adapter = AuthAdapterInterface> {
>   readonly adapter: Type<Adapter>;
>   readonly forRoot?: () => DynamicModule;
> }
> ```
> Register one or more adapters via `RocketsModule.forRoot({ auth: bootstrap | bootstrap[] })` — `AuthServerGuard` tries each per request in order and sets `request.user`. `extractBearerToken(request)` is exported from `@bitwild/rockets-core` for adapters that need it. Real, working example: `apps/api/src/auth-microsoft/` (`define-microsoft-auth.ts` returns the `AuthBootstrap`; the adapter validates a Microsoft-issued JWT via `jose` — `createRemoteJWKSet` + `jwtVerify` — against the tenant's JWKS; there is no local user table, the identity is the token's `oid` claim and profile data lives entirely in `user_metadata`). OAuth-provider modules (Google/GitHub/Apple) referenced later in this guide are **disabled upstream** in `@bitwild/rockets-auth` (v7/v8 `@concepta/nestjs-authentication` dependency conflict) — do not attempt to wire them up; write a custom `AuthAdapterInterface` adapter instead, following the Microsoft example.

## Table of Contents

1. [Introduction to Advanced Authentication Patterns](#introduction-to-advanced-authentication-patterns)
2. [Custom Authentication Providers](#custom-authentication-providers)
3. [Custom Strategies and Guards](#custom-strategies-and-guards)
4. [OAuth Integration Patterns](#oauth-integration-patterns)
5. [JWT Customization Patterns](#jwt-customization-patterns)
6. [Advanced Access Control Integration](#advanced-access-control-integration)
7. [Multi-factor Authentication Patterns](#multi-factor-authentication-patterns)
8. [Session Management and Token Handling](#session-management-and-token-handling)

---

## Introduction to Advanced Authentication Patterns

The Rockets Server SDK provides a comprehensive authentication system out of the box, but many applications require custom authentication logic, additional security measures, or integration with existing systems. This guide explores advanced patterns for customizing and extending the authentication system.

### Key Authentication Components

The Rockets authentication system consists of several core components:

- **Guards**: Protect routes and validate authentication state
- **Strategies**: Handle specific authentication methods (local, JWT, OAuth)
- **Providers**: Custom services for token validation and user resolution
- **Services**: Business logic for authentication operations
- **Controllers**: HTTP endpoints for authentication flows

### Authentication Flow Overview

```typescript
// 1. User submits credentials → AuthLocalGuard
// 2. Guard uses AuthLocalStrategy → CustomAuthLocalValidationService
// 3. Validation service checks credentials → User entity
// 4. Success → IssueTokenService generates JWT tokens
// 5. Subsequent requests → AuthJwtGuard → RocketsJwtAuthProvider
// 6. Provider validates token → Enriched user object with roles
```

### ⚠️ SDK Methods vs Custom Implementation

**What's Available in SDK:**
- ✅ `UserModelService.byId(id)` - Get user by ID
- ✅ `UserModelService.update(userData)` - Update user (data must include ID)
- ✅ `VerifyTokenService.accessToken(token)` - Verify JWT tokens
- ✅ `AuthLocalValidateUserService` - Base validation service

**What Requires Custom Implementation:**
- ❌ `UserModelService.byUsername()` - Not available, use UserLookupService
- ❌ `UserModelService.update(id, data)` - Wrong signature, use `update(data)`
- ❌ Custom user fields (failedAttempts, lastActivity) - Need custom User entity
- ❌ Security event logging - Custom implementation required

---

## Custom Authentication Providers

### Creating a Custom JWT Authentication Provider

The `RocketsJwtAuthProvider` can be extended or replaced to implement custom token validation logic:

```typescript
// providers/custom-jwt-auth.provider.ts
import { Injectable, Inject, UnauthorizedException, Logger } from '@nestjs/common';
import { VerifyTokenService } from '@concepta/nestjs-authentication';
import { UserModelService } from '@concepta/nestjs-user';
import { UserEntityInterface } from '@concepta/nestjs-common';

@Injectable()
export class CustomJwtAuthProvider {
  private readonly logger = new Logger(CustomJwtAuthProvider.name);

  constructor(
    @Inject(VerifyTokenService)
    private readonly verifyTokenService: VerifyTokenService,
    @Inject(UserModelService)
    private readonly userModelService: UserModelService,
  ) {}

  async validateToken(token: string) {
    try {
      // 1. Verify JWT signature and expiration
      const payload: { sub?: string; roles?: string[]; customClaim?: string } =
        await this.verifyTokenService.accessToken(token);

      if (!payload || !payload.sub) {
        throw new UnauthorizedException('Invalid token payload');
      }

      // 2. Custom validation logic
      if (payload.customClaim && !this.validateCustomClaim(payload.customClaim)) {
        throw new UnauthorizedException('Invalid custom claim');
      }

      // 3. Fetch user by ID (sub is the user ID)
      const user: UserEntityInterface | null = await this.userModelService.byId(
        payload.sub
      );

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      // 4. Additional security checks
      if (!user.active) {
        throw new UnauthorizedException('User account is inactive');
      }

      if (this.isAccountLocked(user)) {
        throw new UnauthorizedException('Account is temporarily locked');
      }

      // 5. Build enriched user object
      const enrichedUser = {
        id: user.id,
        sub: payload.sub,
        email: user.email,
        roles: this.extractRoles(user),
        permissions: await this.getUserPermissions(user),
        metadata: user.userMetadata,
        lastLogin: new Date(),
        claims: {
          ...payload,
          ipAddress: this.extractIpFromContext(),
          userAgent: this.extractUserAgentFromContext(),
        },
      };

      // 6. Update last activity
      await this.updateLastActivity(user.id);

      return enrichedUser;
    } catch (error) {
      this.logger.error(`Token validation failed: ${error.message}`);
      
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      
      throw new UnauthorizedException('Token validation failed');
    }
  }

  private validateCustomClaim(claim: string): boolean {
    // Implement custom claim validation logic
    return claim.startsWith('valid_');
  }

  private isAccountLocked(user: any): boolean {
    // Check if account is locked due to failed attempts
    if (!user.failedAttempts || user.failedAttempts < 5) {
      return false;
    }

    const lockoutTime = new Date(user.lastFailedAttempt).getTime();
    const now = Date.now();
    const lockoutDuration = 30 * 60 * 1000; // 30 minutes

    return (now - lockoutTime) < lockoutDuration;
  }

  private extractRoles(user: any): string[] {
    return user.userRoles?.map((ur: any) => ur.role.name) || [];
  }

  private async getUserPermissions(user: any): Promise<string[]> {
    // Implement custom permission resolution logic
    // This could involve fetching from a permissions service,
    // calculating based on roles, etc.
    return ['read:profile', 'write:profile'];
  }

  private async updateLastActivity(userId: string): Promise<void> {
    // Note: UserModelService.update() signature is update(data) where data includes id
    // For custom fields like lastActivity, you'd typically use UserMetadata
    await this.userModelService.update({
      id: userId,
      // Custom activity tracking would go in UserMetadata
    });
  }

  private extractIpFromContext(): string {
    // Implementation depends on your context extraction strategy
    return '127.0.0.1';
  }

  private extractUserAgentFromContext(): string {
    // Implementation depends on your context extraction strategy
    return 'Unknown';
  }
}
```

### Custom Local Authentication with Login Attempts

Extend the default local authentication to include advanced security features:

```typescript
// services/custom-auth-local-validation.service.ts
import { Injectable } from '@nestjs/common';
import { AuthLocalValidateUserService } from '@concepta/nestjs-auth-local';
import { AuthLocalValidateUserInterface } from '@concepta/nestjs-auth-local';
import { ReferenceIdInterface } from '@concepta/nestjs-common';

// Note: This example shows conceptual patterns. You may need to:
// 1. Implement UserLookupService or use available SDK methods
// 2. Create custom exception classes (UserLoginAttemptsException)
// 3. Add custom fields to User entity (failedAttempts, lastFailedAttempt)
// 4. Implement security event logging according to your requirements

@Injectable()
export class CustomAuthLocalValidationService extends AuthLocalValidateUserService {
  private readonly MAX_ATTEMPTS = 5;
  private readonly LOCKOUT_DURATION = 30 * 60 * 1000; // 30 minutes
  private readonly PROGRESSIVE_DELAY = [0, 1000, 2000, 5000, 10000]; // Progressive delays

  constructor(
    // Inject required services for user lookup and updates
    private readonly userLookupService: any, // Use proper UserLookupService interface
    private readonly userModelService: UserModelService,
  ) {
    super(/* parent constructor args */);
  }

  async validateUser(
    dto: AuthLocalValidateUserInterface,
  ): Promise<ReferenceIdInterface> {
    // Note: UserModelService doesn't have byUsername - you'd need UserLookupService
    const user = await this.userLookupService.byUsername(dto.username);
    
    if (user) {
      // Check for account lockout
      if (this.isAccountLocked(user)) {
        throw new UserLoginAttemptsException({
          message: 'Account is temporarily locked due to too many failed attempts',
          remainingTime: this.getRemainingLockoutTime(user),
        });
      }

      // Apply progressive delay for failed attempts
      if (user.failedAttempts > 0) {
        const delay = this.PROGRESSIVE_DELAY[Math.min(user.failedAttempts, this.PROGRESSIVE_DELAY.length - 1)];
        await this.sleep(delay);
      }
    }

    try {
      // Attempt standard validation
      const validatedUser = await super.validateUser(dto);
      
      // Reset failed attempts on successful login
      if (user && user.failedAttempts > 0) {
        await this.resetFailedAttempts(user);
      }

      // Log successful login
      await this.logSecurityEvent(user, 'LOGIN_SUCCESS', {
        ipAddress: this.getClientIp(),
        userAgent: this.getUserAgent(),
      });

      return validatedUser;
    } catch (error) {
      // Handle failed validation
      if (user) {
        await this.incrementFailedAttempts(user);
        
        // Log failed login attempt
        await this.logSecurityEvent(user, 'LOGIN_FAILED', {
          reason: error.message,
          ipAddress: this.getClientIp(),
          userAgent: this.getUserAgent(),
          attempt: user.failedAttempts + 1,
        });
      }
      
      throw error;
    }
  }

  private isAccountLocked(user: any): boolean {
    if (!user.failedAttempts || user.failedAttempts < this.MAX_ATTEMPTS) {
      return false;
    }

    const lockoutTime = new Date(user.lastFailedAttempt).getTime();
    const now = Date.now();
    
    return (now - lockoutTime) < this.LOCKOUT_DURATION;
  }

  private getRemainingLockoutTime(user: any): number {
    const lockoutTime = new Date(user.lastFailedAttempt).getTime();
    const now = Date.now();
    const remaining = this.LOCKOUT_DURATION - (now - lockoutTime);
    
    return Math.max(0, remaining);
  }

  private async incrementFailedAttempts(user: any): Promise<void> {
    const updatedUser = {
      ...user,
      failedAttempts: (user.failedAttempts || 0) + 1,
      lastFailedAttempt: new Date(),
    };
    
    await this.userModelService.update(updatedUser);
  }

  private async resetFailedAttempts(user: any): Promise<void> {
    if (user.failedAttempts > 0) {
      const updatedUser = {
        ...user,
        failedAttempts: 0,
        lastFailedAttempt: null,
      };
      
      await this.userModelService.update(updatedUser);
    }
  }

  private async logSecurityEvent(user: any, event: string, metadata: any): Promise<void> {
    // Implement security event logging
    console.log(`Security Event: ${event}`, {
      userId: user.id,
      username: user.username,
      timestamp: new Date(),
      ...metadata,
    });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getClientIp(): string {
    // Implementation depends on your request context
    return '127.0.0.1';
  }

  private getUserAgent(): string {
    // Implementation depends on your request context
    return 'Unknown';
  }
}
```

---

## Custom Strategies and Guards

### Custom JWT Strategy with Additional Claims

Create a custom JWT strategy that handles additional token claims:

```typescript
// strategies/custom-jwt.strategy.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { CustomJwtAuthProvider } from '../providers/custom-jwt-auth.provider';

@Injectable()
export class CustomJwtStrategy extends PassportStrategy(Strategy, 'custom-jwt') {
  constructor(
    private configService: ConfigService,
    private customJwtAuthProvider: CustomJwtAuthProvider,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
      passReqToCallback: true, // Pass request to validate method
    });
  }

  async validate(request: any, payload: any) {
    try {
      // Extract token from Authorization header
      const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);
      
      if (!token) {
        throw new UnauthorizedException('No token provided');
      }

      // Use custom provider for validation
      const user = await this.customJwtAuthProvider.validateToken(token);
      
      // Add request context to user object
      user.requestContext = {
        ip: request.ip,
        userAgent: request.get('User-Agent'),
        method: request.method,
        url: request.url,
      };

      return user;
    } catch (error) {
      throw new UnauthorizedException('Token validation failed');
    }
  }
}
```

### Role-Based Guard with Resource Context

Create a guard that provides role-based access control with resource context:

```typescript
// guards/role-resource.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ROLES_KEY = 'roles';
export const RESOURCE_KEY = 'resource';

export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
export const Resource = (resource: string) => SetMetadata(RESOURCE_KEY, resource);

@Injectable()
export class RoleResourceGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Get required roles and resource from metadata
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const resource = this.reflector.getAllAndOverride<string>(RESOURCE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true; // No roles required
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Check if user has required role
    const hasRole = requiredRoles.some(role => 
      user.roles?.includes(role)
    );

    if (!hasRole) {
      throw new ForbiddenException(`Insufficient permissions for resource: ${resource}`);
    }

    // Additional resource-specific logic
    if (resource) {
      return this.checkResourceAccess(user, resource, request);
    }

    return true;
  }

  private checkResourceAccess(user: any, resource: string, request: any): boolean {
    const method = request.method;
    const resourceId = request.params.id;

    // Implement resource-specific access logic
    switch (resource) {
      case 'user-profile':
        // Users can only access their own profile
        return user.roles.includes('admin') || user.id === resourceId;
      
      case 'sensitive-data':
        // Only admins can access sensitive data
        return user.roles.includes('admin');
      
      default:
        return true;
    }
  }
}
```

### Usage in Controllers

```typescript
// controllers/user-profile.controller.ts
import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthJwtGuard } from '@concepta/nestjs-auth-jwt';
import { RoleResourceGuard, Roles, Resource } from '../guards/role-resource.guard';

@Controller('users')
@UseGuards(AuthJwtGuard, RoleResourceGuard)
export class UserProfileController {
  
  @Get(':id/profile')
  @Roles('user', 'admin')
  @Resource('user-profile')
  getUserProfile(@Param('id') id: string) {
    return { message: `Profile for user ${id}` };
  }

  @Get('admin/sensitive')
  @Roles('admin')
  @Resource('sensitive-data')
  getSensitiveData() {
    return { message: 'Sensitive administrative data' };
  }
}
```

---

## OAuth Integration Patterns

### Custom OAuth Strategy

Extend OAuth integration to support custom providers:

```typescript
// strategies/custom-oauth.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class CustomOAuthStrategy extends PassportStrategy(Strategy, 'custom-oauth') {
  constructor(private configService: ConfigService) {
    super({
      authorizationURL: configService.get('CUSTOM_OAUTH_AUTH_URL'),
      tokenURL: configService.get('CUSTOM_OAUTH_TOKEN_URL'),
      clientID: configService.get('CUSTOM_OAUTH_CLIENT_ID'),
      clientSecret: configService.get('CUSTOM_OAUTH_CLIENT_SECRET'),
      callbackURL: configService.get('CUSTOM_OAUTH_CALLBACK_URL'),
      scope: ['openid', 'profile', 'email'],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any) {
    // Custom profile mapping
    const userProfile = {
      provider: 'custom-oauth',
      providerId: profile.id,
      email: profile.email,
      firstName: profile.given_name,
      lastName: profile.family_name,
      avatar: profile.picture,
      accessToken,
      refreshToken,
    };

    return userProfile;
  }
}
```

### OAuth User Creation Service

Handle OAuth user creation and linking:

```typescript
// services/oauth-user.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { UserModelService } from '@concepta/nestjs-user';
import { FederatedModelService } from '@concepta/nestjs-federated';

@Injectable()
export class OAuthUserService {
  constructor(
    @Inject(UserModelService)
    private userModelService: UserModelService,
    @Inject(FederatedModelService)
    private federatedModelService: FederatedModelService,
  ) {}

  async findOrCreateOAuthUser(oauthProfile: any) {
    // 1. Check if federated account exists
    let federatedAccount = await this.federatedModelService.findOne({
      provider: oauthProfile.provider,
      subject: oauthProfile.providerId,
    });

    if (federatedAccount) {
      // Return existing user
      return federatedAccount.user;
    }

    // 2. Check if user exists by email
    let user = await this.userModelService.byEmail(oauthProfile.email);

    if (!user) {
      // 3. Create new user
      user = await this.userModelService.create({
        email: oauthProfile.email,
        firstName: oauthProfile.firstName,
        lastName: oauthProfile.lastName,
        active: true,
        // Set a random password since OAuth users don't use password auth
        password: this.generateRandomPassword(),
      });
    }

    // 4. Create federated account link
    federatedAccount = await this.federatedModelService.create({
      user: { id: user.id },
      provider: oauthProfile.provider,
      subject: oauthProfile.providerId,
      accessToken: oauthProfile.accessToken,
      refreshToken: oauthProfile.refreshToken,
    });

    return user;
  }

  private generateRandomPassword(): string {
    return Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  }
}
```

---

## JWT Customization Patterns

### Custom JWT Payload

Extend JWT tokens with custom claims:

```typescript
// services/custom-issue-token.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { IssueTokenService } from '@concepta/nestjs-authentication';
import { UserModelService } from '@concepta/nestjs-user';

@Injectable()
export class CustomIssueTokenService extends IssueTokenService {
  constructor(
    @Inject(UserModelService)
    private userModelService: UserModelService,
    // ... other dependencies
  ) {
    super(/* base constructor arguments */);
  }

  async createAccessToken(userId: string): Promise<string> {
    // Fetch user data
    const user = await this.userModelService.byId(userId);

    if (!user) {
      throw new Error('User not found');
    }

    // Build custom payload
    const customPayload = {
      sub: user.id,
      email: user.email,
      roles: user.userRoles?.map(ur => ur.role.name) || [],
      permissions: user.permissions?.map(p => p.name) || [],
      department: user.userMetadata?.department,
      organizationId: user.userMetadata?.organizationId,
      customClaims: {
        feature_flags: await this.getUserFeatureFlags(user.id),
        subscription_tier: await this.getUserSubscriptionTier(user.id),
      },
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (60 * 60), // 1 hour
    };

    return this.signToken(customPayload);
  }

  private async getUserFeatureFlags(userId: string): Promise<string[]> {
    // Implement feature flag resolution
    return ['feature_a', 'feature_b'];
  }

  private async getUserSubscriptionTier(userId: string): Promise<string> {
    // Implement subscription tier resolution
    return 'premium';
  }

  private signToken(payload: any): string {
    // Implement JWT signing logic
    // This would typically use the jwt library
    return 'signed.jwt.token';
  }
}
```

### Token Refresh Strategy

Implement custom token refresh logic:

```typescript
// services/custom-refresh-token.service.ts
import { Injectable } from '@nestjs/common';
import { RefreshTokenService } from '@concepta/nestjs-authentication';

@Injectable()
export class CustomRefreshTokenService extends RefreshTokenService {
  
  async refreshToken(refreshToken: string) {
    // 1. Validate refresh token
    const payload = await this.verifyRefreshToken(refreshToken);
    
    // 2. Check if token is blacklisted
    if (await this.isTokenBlacklisted(refreshToken)) {
      throw new Error('Refresh token has been revoked');
    }
    
    // 3. Check user status
    const user = await this.getUserById(payload.sub);
    if (!user || !user.active) {
      throw new Error('User account is inactive');
    }
    
    // 4. Generate new tokens
    const newAccessToken = await this.createAccessToken(user.id);
    const newRefreshToken = await this.createRefreshToken(user.id);
    
    // 5. Blacklist old refresh token
    await this.blacklistToken(refreshToken);
    
    // 6. Update user's last login
    await this.updateLastLogin(user.id);
    
    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      tokenType: 'Bearer',
      expiresIn: 3600, // 1 hour
    };
  }

  private async isTokenBlacklisted(token: string): Promise<boolean> {
    // Check against blacklist (Redis, database, etc.)
    return false;
  }

  private async blacklistToken(token: string): Promise<void> {
    // Add token to blacklist
    // Implementation depends on your storage strategy
  }

  private async updateLastLogin(userId: string): Promise<void> {
    // Update user's last login timestamp
  }
}
```

---

## Advanced Access Control Integration

### Custom Access Control Service

Implement advanced access control with resource ownership:

```typescript
// services/advanced-access-control.service.ts
import { Injectable, ExecutionContext, UnauthorizedException, Logger } from '@nestjs/common';
import { AccessControlServiceInterface } from '@concepta/nestjs-access-control';

@Injectable()
export class AdvancedAccessControlService implements AccessControlServiceInterface {
  private readonly logger = new Logger(AdvancedAccessControlService.name);

  async getUser<T>(context: ExecutionContext): Promise<T> {
    const request = context.switchToHttp().getRequest();
    return request.user as T;
  }

  async getUserRoles(context: ExecutionContext): Promise<string | string[]> {
    const request = context.switchToHttp().getRequest();
    const endpoint = `${request.method} ${request.url}`;
    
    this.logger.debug(`[AccessControl] Checking roles for: ${endpoint}`);
    
    const user = await this.getUser<{
      id: string;
      userRoles?: { role: { name: string } }[];
      permissions?: string[];
      organizationId?: string;
    }>(context);

    if (!user || !user.id) {
      this.logger.warn(`[AccessControl] User not authenticated for: ${endpoint}`);
      throw new UnauthorizedException('User is not authenticated');
    }

    // Extract base roles
    const roles = user.userRoles?.map(ur => ur.role.name) || [];
    
    // Add context-specific roles
    const contextRoles = await this.getContextualRoles(user, request);
    
    const allRoles = [...roles, ...contextRoles];
    
    this.logger.debug(`[AccessControl] User ${user.id} has roles: ${JSON.stringify(allRoles)}`);
    
    return allRoles;
  }

  private async getContextualRoles(user: any, request: any): Promise<string[]> {
    const contextRoles: string[] = [];
    
    // Add organization-based roles
    if (user.organizationId) {
      const orgRole = await this.getOrganizationRole(user.organizationId, user.id);
      if (orgRole) {
        contextRoles.push(orgRole);
      }
    }
    
    // Add resource ownership roles
    const resourceId = request.params.id;
    if (resourceId && await this.isResourceOwner(user.id, resourceId, request.route.path)) {
      contextRoles.push('owner');
    }
    
    // Add time-based roles
    const timeBasedRoles = this.getTimeBasedRoles();
    contextRoles.push(...timeBasedRoles);
    
    return contextRoles;
  }

  private async getOrganizationRole(organizationId: string, userId: string): Promise<string | null> {
    // Implement organization role lookup
    // This could involve checking organization membership, hierarchy, etc.
    return 'org_member';
  }

  private async isResourceOwner(userId: string, resourceId: string, resourcePath: string): Promise<boolean> {
    // Implement resource ownership check
    // This would depend on your resource structure
    
    if (resourcePath.includes('/pets/')) {
      // Check if user owns the pet
      return this.checkPetOwnership(userId, resourceId);
    }
    
    if (resourcePath.includes('/documents/')) {
      // Check if user owns the document
      return this.checkDocumentOwnership(userId, resourceId);
    }
    
    return false;
  }

  private async checkPetOwnership(userId: string, petId: string): Promise<boolean> {
    // Implementation would check database
    return false;
  }

  private async checkDocumentOwnership(userId: string, documentId: string): Promise<boolean> {
    // Implementation would check database
    return false;
  }

  private getTimeBasedRoles(): string[] {
    const now = new Date();
    const hour = now.getHours();
    
    // Add business hours role
    if (hour >= 9 && hour <= 17) {
      return ['business_hours'];
    }
    
    return ['after_hours'];
  }
}
```

### Resource-Specific Access Query Service

Create custom access query services for complex ownership logic:

```typescript
// services/pet-access-query.service.ts
import { Injectable } from '@nestjs/common';
import { CanAccessQueryService } from '@concepta/nestjs-access-control';
import { QueryRunner, SelectQueryBuilder } from 'typeorm';

@Injectable()
export class PetAccessQueryService implements CanAccessQueryService {
  
  async canAccess(
    query: SelectQueryBuilder<any>,
    queryRunner: QueryRunner,
    user: any,
    permission: string,
  ): Promise<SelectQueryBuilder<any>> {
    
    // For 'own' permissions, filter by ownership
    if (permission.endsWith('Own')) {
      return this.applyOwnershipFilter(query, user);
    }
    
    // For 'any' permissions, check if user has admin/manager role
    if (permission.endsWith('Any')) {
      if (this.hasAnyAccess(user)) {
        return query; // No additional filtering
      }
      
      // If user doesn't have 'any' access, fall back to 'own' filtering
      return this.applyOwnershipFilter(query, user);
    }
    
    return query;
  }

  private applyOwnershipFilter(
    query: SelectQueryBuilder<any>,
    user: any,
  ): SelectQueryBuilder<any> {
    // Add ownership condition
    return query.andWhere('entity.ownerId = :userId', { userId: user.id });
  }

  private hasAnyAccess(user: any): boolean {
    const roles = user.userRoles?.map((ur: any) => ur.role.name) || [];
    return roles.includes('admin') || roles.includes('manager');
  }
}
```

---

## Multi-factor Authentication Patterns

### TOTP (Time-based One-Time Password) Implementation

```typescript
// services/totp-mfa.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TotpMfaService {
  
  async generateTotpSecret(userId: string, userEmail: string): Promise<{
    secret: string;
    qrCodeUrl: string;
    backupCodes: string[];
  }> {
    // Generate TOTP secret
    const secret = speakeasy.generateSecret({
      name: `YourApp (${userEmail})`,
      issuer: 'YourApp',
      length: 32,
    });

    // Generate QR code for easy setup
    const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

    // Generate backup codes
    const backupCodes = this.generateBackupCodes();

    // Store secret and backup codes (encrypted) in database
    await this.storeMfaSecret(userId, secret.base32, backupCodes);

    return {
      secret: secret.base32,
      qrCodeUrl,
      backupCodes,
    };
  }

  async verifyTotp(userId: string, token: string): Promise<boolean> {
    const userMfa = await this.getUserMfaData(userId);
    
    if (!userMfa || !userMfa.secret) {
      throw new BadRequestException('MFA not enabled for user');
    }

    // Verify TOTP token
    const verified = speakeasy.totp.verify({
      secret: userMfa.secret,
      encoding: 'base32',
      token,
      window: 1, // Allow for time skew
    });

    if (verified) {
      // Update last used timestamp
      await this.updateMfaLastUsed(userId);
      return true;
    }

    // Check if it's a backup code
    if (await this.isValidBackupCode(userId, token)) {
      await this.markBackupCodeUsed(userId, token);
      return true;
    }

    return false;
  }

  private generateBackupCodes(): string[] {
    const codes: string[] = [];
    for (let i = 0; i < 10; i++) {
      codes.push(Math.random().toString(36).substr(2, 8).toUpperCase());
    }
    return codes;
  }

  private async storeMfaSecret(userId: string, secret: string, backupCodes: string[]): Promise<void> {
    // Implement secure storage of MFA data
    // Encrypt secret and backup codes before storing
  }

  private async getUserMfaData(userId: string): Promise<any> {
    // Implement retrieval of user's MFA data
    return null;
  }

  private async updateMfaLastUsed(userId: string): Promise<void> {
    // Update last used timestamp for MFA
  }

  private async isValidBackupCode(userId: string, code: string): Promise<boolean> {
    // Check if the code is a valid, unused backup code
    return false;
  }

  private async markBackupCodeUsed(userId: string, code: string): Promise<void> {
    // Mark backup code as used
  }
}
```

### MFA Guard

```typescript
// guards/mfa.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class MfaGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private totpMfaService: TotpMfaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Check if MFA is required for this endpoint
    const requireMfa = this.reflector.get<boolean>('requireMfa', context.getHandler());
    
    if (!requireMfa) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    // Check if user has MFA enabled
    const mfaEnabled = await this.isMfaEnabled(user.id);
    
    if (!mfaEnabled) {
      throw new UnauthorizedException('MFA is required but not enabled');
    }

    // Check if current session is MFA verified
    const mfaVerified = this.isMfaVerified(request);
    
    if (!mfaVerified) {
      throw new UnauthorizedException('MFA verification required');
    }

    return true;
  }

  private async isMfaEnabled(userId: string): Promise<boolean> {
    // Check if user has MFA enabled
    return false;
  }

  private isMfaVerified(request: any): boolean {
    // Check if current session/token indicates MFA verification
    return request.user?.mfaVerified === true;
  }
}
```

---

## Session Management and Token Handling

### Redis-based Session Management

```typescript
// services/session-management.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';

@Injectable()
export class SessionManagementService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
  ) {}

  async createSession(userId: string, sessionData: any): Promise<string> {
    const sessionId = this.generateSessionId();
    const sessionKey = this.getSessionKey(sessionId);
    
    const session = {
      userId,
      createdAt: new Date(),
      lastActivity: new Date(),
      ipAddress: sessionData.ipAddress,
      userAgent: sessionData.userAgent,
      mfaVerified: false,
      ...sessionData,
    };

    // Store session with TTL
    await this.redis.setex(
      sessionKey,
      60 * 60 * 24 * 7, // 7 days
      JSON.stringify(session)
    );

    // Add to user's active sessions
    await this.addToUserSessions(userId, sessionId);

    return sessionId;
  }

  async getSession(sessionId: string): Promise<any | null> {
    const sessionKey = this.getSessionKey(sessionId);
    const sessionData = await this.redis.get(sessionKey);
    
    if (!sessionData) {
      return null;
    }

    return JSON.parse(sessionData);
  }

  async updateSession(sessionId: string, updates: any): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (!session) {
      throw new Error('Session not found');
    }

    const updatedSession = {
      ...session,
      ...updates,
      lastActivity: new Date(),
    };

    const sessionKey = this.getSessionKey(sessionId);
    await this.redis.setex(
      sessionKey,
      60 * 60 * 24 * 7, // Reset TTL
      JSON.stringify(updatedSession)
    );
  }

  async destroySession(sessionId: string): Promise<void> {
    const session = await this.getSession(sessionId);
    
    if (session) {
      await this.removeFromUserSessions(session.userId, sessionId);
    }

    const sessionKey = this.getSessionKey(sessionId);
    await this.redis.del(sessionKey);
  }

  async getUserSessions(userId: string): Promise<any[]> {
    const sessionIdsKey = this.getUserSessionsKey(userId);
    const sessionIds = await this.redis.smembers(sessionIdsKey);
    
    const sessions = [];
    for (const sessionId of sessionIds) {
      const session = await this.getSession(sessionId);
      if (session) {
        sessions.push({
          sessionId,
          ...session,
        });
      } else {
        // Clean up stale session reference
        await this.redis.srem(sessionIdsKey, sessionId);
      }
    }

    return sessions;
  }

  async destroyAllUserSessions(userId: string): Promise<void> {
    const sessions = await this.getUserSessions(userId);
    
    for (const session of sessions) {
      await this.destroySession(session.sessionId);
    }
  }

  private generateSessionId(): string {
    return Math.random().toString(36).substr(2, 16) + Date.now().toString(36);
  }

  private getSessionKey(sessionId: string): string {
    return `session:${sessionId}`;
  }

  private getUserSessionsKey(userId: string): string {
    return `user_sessions:${userId}`;
  }

  private async addToUserSessions(userId: string, sessionId: string): Promise<void> {
    const userSessionsKey = this.getUserSessionsKey(userId);
    await this.redis.sadd(userSessionsKey, sessionId);
    
    // Set TTL for user sessions tracking
    await this.redis.expire(userSessionsKey, 60 * 60 * 24 * 7);
  }

  private async removeFromUserSessions(userId: string, sessionId: string): Promise<void> {
    const userSessionsKey = this.getUserSessionsKey(userId);
    await this.redis.srem(userSessionsKey, sessionId);
  }
}
```

### Token Blacklist Service

```typescript
// services/token-blacklist.service.ts
import { Injectable, Inject } from '@nestjs/common';
import { Redis } from 'ioredis';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class TokenBlacklistService {
  constructor(
    @Inject('REDIS_CLIENT')
    private readonly redis: Redis,
    private readonly jwtService: JwtService,
  ) {}

  async blacklistToken(token: string): Promise<void> {
    try {
      // Decode token to get expiration
      const decoded = this.jwtService.decode(token) as any;
      
      if (!decoded || !decoded.exp) {
        throw new Error('Invalid token format');
      }

      const tokenId = this.getTokenId(token);
      const expiresAt = decoded.exp;
      const now = Math.floor(Date.now() / 1000);
      const ttl = expiresAt - now;

      if (ttl > 0) {
        // Store token in blacklist with TTL
        await this.redis.setex(
          this.getBlacklistKey(tokenId),
          ttl,
          '1'
        );
      }
    } catch (error) {
      // Log error but don't throw - blacklisting should not fail auth flow
      console.error('Failed to blacklist token:', error.message);
    }
  }

  async isBlacklisted(token: string): Promise<boolean> {
    try {
      const tokenId = this.getTokenId(token);
      const result = await this.redis.get(this.getBlacklistKey(tokenId));
      return result === '1';
    } catch (error) {
      // On error, assume token is not blacklisted to avoid false positives
      console.error('Failed to check token blacklist:', error.message);
      return false;
    }
  }

  async blacklistAllUserTokens(userId: string): Promise<void> {
    // This would require keeping track of all tokens for a user
    // One approach is to increment a "token version" for the user
    // and include this version in JWT tokens
    
    const userTokenVersionKey = this.getUserTokenVersionKey(userId);
    await this.redis.incr(userTokenVersionKey);
    
    // Set a reasonable TTL for the version key
    await this.redis.expire(userTokenVersionKey, 60 * 60 * 24 * 30); // 30 days
  }

  async getUserTokenVersion(userId: string): Promise<number> {
    const version = await this.redis.get(this.getUserTokenVersionKey(userId));
    return parseInt(version || '0', 10);
  }

  private getTokenId(token: string): string {
    // Create a hash of the token for consistent storage
    return require('crypto').createHash('sha256').update(token).digest('hex');
  }

  private getBlacklistKey(tokenId: string): string {
    return `blacklist:${tokenId}`;
  }

  private getUserTokenVersionKey(userId: string): string {
    return `token_version:${userId}`;
  }
}
```

### Enhanced Token Validation

```typescript
// services/enhanced-token-validation.service.ts
import { Injectable } from '@nestjs/common';
import { TokenBlacklistService } from './token-blacklist.service';
import { SessionManagementService } from './session-management.service';

@Injectable()
export class EnhancedTokenValidationService {
  constructor(
    private tokenBlacklistService: TokenBlacklistService,
    private sessionManagementService: SessionManagementService,
  ) {}

  async validateToken(token: string, payload: any): Promise<boolean> {
    // 1. Check if token is blacklisted
    if (await this.tokenBlacklistService.isBlacklisted(token)) {
      return false;
    }

    // 2. Check user token version
    const userTokenVersion = await this.tokenBlacklistService.getUserTokenVersion(payload.sub);
    if (payload.version && payload.version < userTokenVersion) {
      return false;
    }

    // 3. Validate session if session ID is in token
    if (payload.sessionId) {
      const session = await this.sessionManagementService.getSession(payload.sessionId);
      if (!session || session.userId !== payload.sub) {
        return false;
      }

      // Update session activity
      await this.sessionManagementService.updateSession(payload.sessionId, {
        lastActivity: new Date(),
      });
    }

    // 4. Additional custom validations
    return this.performCustomValidations(token, payload);
  }

  private async performCustomValidations(token: string, payload: any): Promise<boolean> {
    // Implement any additional custom validation logic
    // Examples:
    // - IP address validation
    // - Geographic restrictions
    // - Time-based restrictions
    // - Device fingerprinting
    
    return true;
  }
}
```

---

## Configuration and Module Setup

### Complete Authentication Module Configuration

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RocketsServerModule } from '@bitwild/rockets-server';
import { AccessControlModule } from '@concepta/nestjs-access-control';

// Custom services
import { CustomAuthLocalValidationService } from './services/custom-auth-local-validation.service';
import { CustomJwtAuthProvider } from './providers/custom-jwt-auth.provider';
import { TotpMfaService } from './services/totp-mfa.service';
import { SessionManagementService } from './services/session-management.service';
import { TokenBlacklistService } from './services/token-blacklist.service';
import { AdvancedAccessControlService } from './services/advanced-access-control.service';

// Guards and strategies
import { CustomJwtStrategy } from './strategies/custom-jwt.strategy';
import { RoleResourceGuard } from './guards/role-resource.guard';
import { MfaGuard } from './guards/mfa.guard';

// Access control
import { acRules } from './app.acl';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    
    // Rockets Server with custom authentication
    RocketsServerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService, CustomAuthLocalValidationService],
      useFactory: (
        configService: ConfigService,
        customValidationService: CustomAuthLocalValidationService,
      ) => ({
        // Custom authentication configuration
        authLocal: {
          validateUserService: customValidationService,
        },
        
        // JWT configuration
        jwt: {
          settings: {
            access: { 
              secret: configService.get('JWT_ACCESS_SECRET'),
              expiresIn: '1h',
            },
            refresh: { 
              secret: configService.get('JWT_REFRESH_SECRET'),
              expiresIn: '7d',
            },
          },
        },
        
        // Email/OTP configuration
        services: {
          mailerService: {
            sendMail: (options: any) => Promise.resolve(),
          },
        },
        
        // Entity configuration
        userCrud: {
          imports: [TypeOrmModule.forFeature([UserEntity])],
          adapter: CustomUserTypeOrmCrudAdapter,
        },
      }),
      
      providers: [
        CustomAuthLocalValidationService,
        CustomJwtAuthProvider,
        TotpMfaService,
        SessionManagementService,
        TokenBlacklistService,
      ],
    }),
    
    // Access Control
    AccessControlModule.forRoot({
      settings: { rules: acRules },
      service: AdvancedAccessControlService,
    }),
  ],
  
  providers: [
    // Authentication providers
    CustomAuthLocalValidationService,
    CustomJwtAuthProvider,
    CustomJwtStrategy,
    
    // MFA services
    TotpMfaService,
    
    // Session management
    SessionManagementService,
    TokenBlacklistService,
    
    // Access control
    AdvancedAccessControlService,
    
    // Guards
    RoleResourceGuard,
    MfaGuard,
  ],
})
export class AppModule {}
```

This comprehensive authentication guide provides advanced patterns for customizing and extending the Rockets Server SDK authentication system. Each pattern addresses specific use cases while maintaining security best practices and integrating seamlessly with the existing SDK architecture.