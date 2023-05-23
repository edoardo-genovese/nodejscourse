import { Request } from "express";

export interface CreateProductDto {
  userId: string;
  title: string;
  price: number;
  files: Request["files"];
}

export interface UpdateProductDto {
  userId: string;
  title: string;
  price: number;
  productId: string;
}

export interface DeleteProductDto {
  productId: string;
  userId: string;
}

export interface AddImagesDto {
  userId: string;
  productId: string;
  files: Request["files"];
}

export interface DeleteImagesDto {
  userId: string;
  productId: string;
  imagesIds: Array<string>;
}
