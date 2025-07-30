import { EnvService } from '@/env/env.service';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { z } from 'zod';
import { Role } from '../enums/roles.enum';

const tokenPayloadSchema = z.object({
  id: z.string().uuid(),
  role: z.nativeEnum(Role),
});

export type UserPayload = z.infer<typeof tokenPayloadSchema>;
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(env: EnvService) {
    const publicKey = env.get('JWT_PUBLIC_KEY');

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        //Extracts from HTTP headers if it is an HTTP request and the scheme
        (req) => {
          if (req.headers && req.headers.authorization) {
            return ExtractJwt.fromAuthHeaderWithScheme('Bearer')(req);
          }
          return null;
        },
      ]),
      secretOrKey: Buffer.from(publicKey, 'base64'),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: UserPayload) {
    return tokenPayloadSchema.parse(payload);
  }
}
