const { successResponse } = require('../../utils/responses');

class UsersHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;
 
    this.postUserHandler = this.postUserHandler.bind(this);
  }
 
  async postUserHandler(request, h) {
      this._validator.validateUserPayload(request.payload);
 
      const userId = await this._service.addUser(request.payload);
 
      return successResponse(h, {
        responseMessage: 'User berhasil ditambahkan',
        responseData: { userId: userId },
        responseCode: 201,
      });
  }
}

module.exports = UsersHandler;