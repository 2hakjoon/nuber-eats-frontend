/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { MyRestaurantInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: myRestaurantQuery
// ====================================================

export interface myRestaurantQuery_myRestaurant_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface myRestaurantQuery_myRestaurant_restaurant_menus_options_choice {
  __typename: "DishChoice";
  name: string;
  extra: number | null;
}

export interface myRestaurantQuery_myRestaurant_restaurant_menus_options {
  __typename: "DishOption";
  name: string;
  extra: number | null;
  choice: myRestaurantQuery_myRestaurant_restaurant_menus_options_choice[] | null;
}

export interface myRestaurantQuery_myRestaurant_restaurant_menus {
  __typename: "Dish";
  id: number;
  name: string;
  price: number;
  photo: string | null;
  description: string;
  options: myRestaurantQuery_myRestaurant_restaurant_menus_options[] | null;
}

export interface myRestaurantQuery_myRestaurant_restaurant_orders {
  __typename: "Order";
  id: number;
  createdAt: any;
  total: number | null;
}

export interface myRestaurantQuery_myRestaurant_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: myRestaurantQuery_myRestaurant_restaurant_category | null;
  address: string;
  isPromoted: boolean;
  menus: myRestaurantQuery_myRestaurant_restaurant_menus[] | null;
  orders: myRestaurantQuery_myRestaurant_restaurant_orders[];
}

export interface myRestaurantQuery_myRestaurant {
  __typename: "MyRestaurantOutput";
  ok: boolean;
  error: string | null;
  restaurant: myRestaurantQuery_myRestaurant_restaurant | null;
}

export interface myRestaurantQuery {
  myRestaurant: myRestaurantQuery_myRestaurant;
}

export interface myRestaurantQueryVariables {
  input: MyRestaurantInput;
}
