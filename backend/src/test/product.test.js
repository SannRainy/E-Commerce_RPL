// src/test/product.test.js
const productController = require('../controllers/productController');
const Product = require('../models/Product');

jest.mock('../models/Product'); // Mock model Product

// Helper mock response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

// Helper mock request with params
const mockRequest = (params = {}, body = {}, file = null) => ({
  params,
  body,
  file,
});

describe('Product Controller', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAllProducts', () => {
    it('should return all products', async () => {
      const req = mockRequest();
      const res = mockResponse();

      const fakeProducts = [{ name: 'Prod1' }, { name: 'Prod2' }];
      Product.find.mockReturnValue({
        populate: jest.fn().mockResolvedValue(fakeProducts),
      });

      await productController.getAllProducts(req, res);

      expect(Product.find).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeProducts);
    });

    it('should handle errors', async () => {
      const req = mockRequest();
      const res = mockResponse();

      Product.find.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('DB error')),
      });

      await productController.getAllProducts(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Gagal mengambil produk',
      }));
    });
  });

  describe('getProductById', () => {
    it('should return product if found', async () => {
      const req = mockRequest({ productId: 'id123' });
      const res = mockResponse();

      const fakeProduct = { name: 'Product A' };
      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(fakeProduct),
      });

      await productController.getProductById(req, res);

      expect(Product.findById).toHaveBeenCalledWith('id123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(fakeProduct);
    });

    it('should return 404 if product not found', async () => {
      const req = mockRequest({ productId: 'id123' });
      const res = mockResponse();

      Product.findById.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await productController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produk tidak ditemukan' });
    });

    it('should handle errors', async () => {
      const req = mockRequest({ productId: 'id123' });
      const res = mockResponse();

      Product.findById.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('DB error')),
      });

      await productController.getProductById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Gagal mengambil produk',
      }));
    });
  });

  describe('createProduct', () => {
    it('should create a product', async () => {
      const req = mockRequest(
        {},
        {
          name: 'New Product',
          description: 'Great product',
          price: 1000,
          stock: 10,
          category: 'catid',
        },
        { filename: 'image.jpg' }
      );

      const res = mockResponse();

      const productData = {
        name: 'New Product',
        description: 'Great product',
        price: 1000,
        stock: 10,
        category: 'catid',
        imageUrl: '/images/image.jpg',
      };

      Product.mockImplementation(() => ({
        ...productData,
        save: jest.fn().mockResolvedValue(productData),
      }));

      await productController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        name: 'New Product',
        imageUrl: '/images/image.jpg',
      }));
    });

    it('should handle error on create product', async () => {
      const req = mockRequest({}, { name: 'Bad Product' });
      const res = mockResponse();

      Product.mockImplementation(() => ({
        save: jest.fn().mockRejectedValue(new Error('Failed to save')),
      }));

      await productController.createProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Gagal menambahkan produk',
      }));
    });
  });

  describe('updateProduct', () => {
    it('should update product', async () => {
      const req = mockRequest(
        { productId: 'id123' },
        { name: 'Updated Product' },
        { filename: 'newimage.jpg' }
      );
      const res = mockResponse();

      const updatedProduct = {
        name: 'Updated Product',
        imageUrl: '/images/newimage.jpg',
        category: { _id: 'catid', name: 'Category' },
      };

      Product.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(updatedProduct),
      });

      await productController.updateProduct(req, res);

      expect(Product.findByIdAndUpdate).toHaveBeenCalledWith(
        'id123',
        expect.objectContaining({ name: 'Updated Product', imageUrl: '/images/newimage.jpg' }),
        { new: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedProduct);
    });

    it('should return 404 if product not found', async () => {
      const req = mockRequest({ productId: 'id123' }, { name: 'Updated Product' });
      const res = mockResponse();

      Product.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockResolvedValue(null),
      });

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produk tidak ditemukan' });
    });

    it('should handle error on update', async () => {
      const req = mockRequest({ productId: 'id123' }, { name: 'Updated Product' });
      const res = mockResponse();

      Product.findByIdAndUpdate.mockReturnValue({
        populate: jest.fn().mockRejectedValue(new Error('Update failed')),
      });

      await productController.updateProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Gagal mengubah produk',
      }));
    });
  });

  describe('deleteProduct', () => {
    it('should delete product', async () => {
      const req = mockRequest({ productId: 'id123' });
      const res = mockResponse();

      Product.findByIdAndDelete.mockResolvedValue({ _id: 'id123' });

      await productController.deleteProduct(req, res);

      expect(Product.findByIdAndDelete).toHaveBeenCalledWith('id123');
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produk berhasil dihapus' });
    });

    it('should return 404 if product not found', async () => {
      const req = mockRequest({ productId: 'id123' });
      const res = mockResponse();

      Product.findByIdAndDelete.mockResolvedValue(null);

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: 'Produk tidak ditemukan' });
    });

    it('should handle error on delete', async () => {
      const req = mockRequest({ productId: 'id123' });
      const res = mockResponse();

      Product.findByIdAndDelete.mockRejectedValue(new Error('Delete failed'));

      await productController.deleteProduct(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        message: 'Gagal menghapus produk',
      }));
    });
  });
});
