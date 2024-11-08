/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/_sitemap` | `/auth` | `/auth/` | `/auth/profile` | `/auth/profile/editprofile` | `/auth/profile/organisation/addactivity` | `/auth/profile/organisation/addcitizen` | `/auth/profile/organisation/editactivity` | `/auth/profile/organisation/weekplanscreen` | `/auth/profile/settings` | `/auth/profile/viewinvitation` | `/auth/register`;
      DynamicRoutes: `/auth/profile/organisation/${Router.SingleRoutePart<T>}`;
      DynamicRouteTemplate: `/auth/profile/organisation/[index]`;
    }
  }
}
