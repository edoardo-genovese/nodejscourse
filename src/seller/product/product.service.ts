import { ProductModel, uploadDir } from "@nodetrainingcourses/common";
import { Product } from "./product.model";
import {
  AddImagesDto,
  CreateProductDto,
  DeleteImagesDto,
  DeleteProductDto,
  UpdateProductDto,
} from "../dtos/product.dto";
import fs from "fs";
import path from "path";

export class ProductService {
  constructor(public productModel: ProductModel) {}

  async getOneByIDd(productId: string) {
    return await this.productModel.findById(productId);
  }

  async create(createProductDto: CreateProductDto) {
    const images = this.generateProductImages(createProductDto.files);
    const product = new this.productModel({
      title: createProductDto.title,
      price: createProductDto.price,
      user: createProductDto.userId,
      images: images,
    });

    return await product.save();
  }

  async updateProduct(updateProductDto: UpdateProductDto) {
    return await this.productModel.findOneAndUpdate(
      {
        _id: updateProductDto.productId,
      },
      {
        $set: { title: updateProductDto.title, price: updateProductDto.price },
      },
      {
        new: true,
      }
    );
  }

  async deleteProduct(deleteProductDto: DeleteProductDto) {
    return await this.productModel.findOneAndRemove({
      _id: deleteProductDto.productId,
    });
  }

  async addImages(addImagesDto: AddImagesDto) {
    const images = this.generateProductImages(addImagesDto.files);
    return await this.productModel.findOneAndUpdate(
      { _id: addImagesDto.productId },
      { $push: { images: { $each: images } } }, //without each images will push arrays into images
      { new: true }
    );
  }

  async deleteImages(deleteImagesDto: DeleteImagesDto) {
    return await this.productModel.findByIdAndUpdate(
      { _id: deleteImagesDto.productId },
      { $pull: { images: { _id: { $in: deleteImagesDto.imagesIds } } } }, //we pull out every image that exist in images id
      { new: true }
    );
  }

  generateBase64Url(contentType: string, buffer: Buffer) {
    return `data.${contentType};base64.${buffer.toString("base64")}`;
  }

  generateProductImages(
    files: CreateProductDto["files"]
  ): Array<{ src: string }> {
    let images: Array<Express.Multer.File>;

    if (typeof files === "object") {
      images = Object.values(files).flat(); //flat create a new array with all sub array elements
    } else {
      images = files ? [...files] : [];
    }

    return images.map((file: Express.Multer.File) => {
      let srcObj = {
        src: this.generateBase64Url(
          file.mimetype,
          fs.readFileSync(path.join(uploadDir + file.filename)) //Buffer
        ),
      };
      fs.unlink(path.join(uploadDir + file.filename), () => {}); //remove file from path upload

      return srcObj;
    });
  }
}

export const productService = new ProductService(Product);
