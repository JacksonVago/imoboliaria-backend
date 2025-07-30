import {
  ContextType,
  ExecutionContext,
  createParamDecorator,
} from '@nestjs/common';
import { UserPayload } from '../estrategies/jwt.strategy';

// Interface for the request payload in HTTP context
interface UserRequestPayload {
  user: UserPayload;
}

// Decorator to get the current user from the context
export const CurrentUser = createParamDecorator(
  (_: never, context: ExecutionContext) => {
    const contextType = context.getType<ContextType>();
    const request = extractContextData(contextType, context);
    return request.user;
  },
);

// Helper function to extract the request or client depending on the context type
function extractContextData(
  type: ContextType,
  context: ExecutionContext,
): UserRequestPayload {
  if (type === 'http') {
    return context.switchToHttp().getRequest<UserRequestPayload>();
  }

  //add more context types as needed
  throw new Error('Unsupported context type, add more types as needed');
}
