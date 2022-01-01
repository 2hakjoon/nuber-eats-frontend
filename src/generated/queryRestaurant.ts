/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: queryRestaurant
// ====================================================

export interface queryRestaurant_restaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface queryRestaurant_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: queryRestaurant_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
}

export interface queryRestaurant_restaurant {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: queryRestaurant_restaurant_restaurant | null;
}

export interface queryRestaurant {
  restaurant: queryRestaurant_restaurant;
}

export interface queryRestaurantVariables {
  input: RestaurantInput;
}
