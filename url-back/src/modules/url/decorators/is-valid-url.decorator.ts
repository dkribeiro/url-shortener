import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

export function IsValidUrl(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isValidUrl',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          try {
            const urlObject = new URL(value);
            if (!['http:', 'https:'].includes(urlObject.protocol)) {
              return false;
            }
            if (!urlObject.hostname) {
              return false;
            }
            const hostnameParts = urlObject.hostname.split('.');
            return hostnameParts.length >= 2 && !!hostnameParts[hostnameParts.length - 1];
          } catch (error) {
            return false;
          }
        },
        defaultMessage(args: ValidationArguments) {
          return 'Invalid URL format. URL must have a valid protocol (http/https) and domain';
        },
      },
    });
  };
}