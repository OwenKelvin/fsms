import { HttpLink } from 'apollo-angular/http';
import { inject } from '@angular/core';
import { InMemoryCache } from '@apollo/client/core';

export const apolloConfig = () => {
  const httpLink = inject(HttpLink);

  return {
    link: httpLink.create({ uri: 'http://localhost:3000/graphql' }),
    cache: new InMemoryCache(),
  };
};
