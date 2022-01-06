/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { RestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: myRestaurantQuery
// ====================================================

export interface myRestaurantQuery_restaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface myRestaurantQuery_restaurant_restaurant_menu_options_choice {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface myRestaurantQuery_restaurant_restaurant_menu_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choice: myRestaurantQuery_restaurant_restaurant_menu_options_choice[] | null;
}

export interface myRestaurantQuery_restaurant_restaurant_menu {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: myRestaurantQuery_restaurant_restaurant_menu_options[] | null;
}

export interface myRestaurantQuery_restaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: myRestaurantQuery_restaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  menu: myRestaurantQuery_restaurant_restaurant_menu[] | null;
}

export interface myRestaurantQuery_restaurant {
  __typename: "RestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: myRestaurantQuery_restaurant_restaurant | null;
}

export interface myRestaurantQuery {
  restaurant: myRestaurantQuery_restaurant;
}

export interface myRestaurantQueryVariables {
  input: RestaurantInput;
}
