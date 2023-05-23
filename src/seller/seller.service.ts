import {
  BadRequestError,
  NotAuthorizedError,
} from "@nodetrainingcourses/common";
import {
  AddImagesDto,
  CreateProductDto,
  DeleteImagesDto,
  DeleteProductDto,
  UpdateProductDto,
} from "./dtos/product.dto";
import { ProductService, productService } from "./product/product.service";

export class SellerService {
  constructor(public productService: ProductService) {}

  async addProduct(createProductDto: CreateProductDto) {
    return await this.productService.create(createProductDto);
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    const product = await this.productService.getOneByIDd(
      updateProductDto.productId
    );
    if (!product) return new BadRequestError("product not found");
    if (product.user.toString() !== updateProductDto.userId) {
      return new NotAuthorizedError();
    }

    return await this.productService.updateProduct(updateProductDto);
  }

  async deleteProduct(deleteProductDto: DeleteProductDto) {
    const product = await this.productService.getOneByIDd(
      deleteProductDto.productId
    );
    if (!product) return new BadRequestError("product not found");

    if (product.user.toString() !== deleteProductDto.userId) {
      return new NotAuthorizedError();
    }

    return this.productService.deleteProduct(deleteProductDto);
  }

  async addProductImages(addImagesDto: AddImagesDto) {
    const product = await this.productService.getOneByIDd(
      addImagesDto.productId
    );
    if (!product) return new BadRequestError("product not found");

    if (product.user.toString() !== addImagesDto.userId) {
      return new NotAuthorizedError();
    }

    return await this.productService.addImages(addImagesDto);
  }

  async deleteProductImages(deleteImagesDto: DeleteImagesDto) {
    const product = await this.productService.getOneByIDd(
      deleteImagesDto.productId
    );
    if (!product) return new BadRequestError("product not found");

    if (product.user.toString() !== deleteImagesDto.userId) {
      return new NotAuthorizedError();
    }

    return await this.productService.deleteImages(deleteImagesDto);
  }
}

export const sellerService = new SellerService(productService);
