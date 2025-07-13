const userController = require('../controllers/userController');
const User = require('../models/User');

// Helper untuk mock response Express
const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

// Mock model User
jest.mock('../models/User');

describe('User Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('should return all users without password', async () => {
            const req = {};
            const res = mockResponse();
            const users = [{ name: 'John', role: 'customer' }];

            User.find.mockReturnValue({
                select: jest.fn().mockResolvedValue(users)
            });

            await userController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(users);
        });

        it('should handle errors', async () => {
            const req = {};
            const res = mockResponse();

            User.find.mockImplementation(() => {
                throw new Error('Database error');
            });

            await userController.getAllUsers(req, res);

            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ message: 'Gagal mengambil data users' }));
        });
    });

    describe('updateUserRole', () => {
        it('should update user role', async () => {
            const req = {
                params: { userId: '123' },
                body: { role: 'admin' }
            };
            const res = mockResponse();
            const updatedUser = { _id: '123', name: 'Jane', role: 'admin' };

            const mockSelect = jest.fn().mockReturnValue(updatedUser);
            User.findByIdAndUpdate.mockReturnValue({ select: mockSelect });

            await userController.updateUserRole(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith(updatedUser);
        });

        it('should return 404 if user not found', async () => {
            const req = {
                params: { userId: '123' },
                body: { role: 'seller' }
            };
            const res = mockResponse();

            const mockSelect = jest.fn().mockReturnValue(null);
            User.findByIdAndUpdate.mockReturnValue({ select: mockSelect });

            await userController.updateUserRole(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' });
        });
    });

    describe('deleteUser', () => {
        it('should delete a user', async () => {
            const req = { params: { userId: '123' } };
            const res = mockResponse();
            const deletedUser = { _id: '123', name: 'Delete Me' };

            User.findByIdAndDelete.mockResolvedValue(deletedUser);

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ message: 'User berhasil dihapus' });
        });

        it('should return 404 if user not found', async () => {
            const req = { params: { userId: '123' } };
            const res = mockResponse();

            User.findByIdAndDelete.mockResolvedValue(null);

            await userController.deleteUser(req, res);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'User tidak ditemukan' });
        });
    });
});
