/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: myRestaurant
// ====================================================

export interface myRestaurant_restaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface myRestaurant_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: myRestaurant_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
}

export interface myRestaurant_restaurant {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: myRestaurant_restaurant_restaurant | null;
}

export interface myRestaurant {
  restaurant: myRestaurant_restaurant;
}

export interface myRestaurantVariables {
  input: RestaurantInput;
}
