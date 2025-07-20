const jwt = require('jsonwebtoken');

class TokenRepository {
  constructor(config) {
    this.secret = config.secret;
    this.issuer = config.issuer;
    this.audience = config.audience;
    this.expiresIn = config.expiresIn || '1d';
  }

  createJWTToken(user, roles) {
    const claims = {
      email: user.email,
      username: user.userName || user.username,
      FirstName: user.firstName,
      LastName: user.lastName,
      nameid: user.id,
      role: roles
    };

    const token = jwt.sign(
      claims,
      this.secret,
      {
        issuer: this.issuer,
        audience: this.audience,
        expiresIn: this.expiresIn,
        algorithm: 'HS256'
      }
    );

    return token;
  }
}

module.exports = TokenRepository;
