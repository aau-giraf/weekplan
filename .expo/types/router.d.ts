/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/addactivity` | `/addcitizen` | `/editactivity` | `/editprofile` | `/login` | `/profile` | `/register` | `/settings` | `/viewinvitation` | `/weekplanscreen`;
      DynamicRoutes: `/vieworganisation/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/vieworganisation/[id]`;
    }
  }
}
