/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { CategoryInput } from "./globalTypes";

// ====================================================
// GraphQL query operation: queryCategory
// ====================================================

export interface queryCategory_category_category {
  __typename: "Category";
  id: number;
  name: string;
  coverImg: string | null;
  slug: string;
  restaurantCount: number;
}

export interface queryCategory_category_restaurant_category {
  __typename: "Category";
  name: string;
}

export interface queryCategory_category_restaurant {
  __typename: "Restaurant";
  id: number;
  name: string;
  coverImg: string;
  category: queryCategory_category_restaurant_category | null;
  address: string;
  isPromoted: boolean;
}

export interface queryCategory_category {
  __typename: "CategoryOutput";
  error: string | null;
  ok: boolean;
  totalPages: number | null;
  totalResults: number | null;
  category: queryCategory_category_category | null;
  restaurant: queryCategory_category_restaurant[] | null;
}

export interface queryCategory {
  category: queryCategory_category;
}

export interface queryCategoryVariables {
  input: CategoryInput;
}
