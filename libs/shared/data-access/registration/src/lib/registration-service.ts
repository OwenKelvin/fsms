import { inject, Injectable } from '@angular/core';
import { ApolloClient } from '@apollo/client';

@Injectable()
export class RegistrationService {
  apollo = inject(ApolloClient);
}
