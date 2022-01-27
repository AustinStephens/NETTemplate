using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Backend.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace Backend.Services
{
    public class TokenService
    {
        private readonly IConfiguration _config;
        private readonly UserManager<User> _userManager;
        public TokenService(UserManager<User> userManager, IConfiguration config) 
        {
            _userManager = userManager;
            _config = config;

        }

        public async Task<String> GenerateToken(User user) 
        {
            List<Claim> claims = new List<Claim> {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Name, user.UserName)
            };

            IList<String> roles = await _userManager.GetRolesAsync(user);
            foreach(var role in roles) {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["JWTSettings:TokenKey"]));
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512);
            JwtSecurityToken tokenOptions = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.Now.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(tokenOptions);
        }
    }
}