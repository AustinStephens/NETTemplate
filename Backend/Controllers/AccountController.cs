using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    public class AccountController : BaseApiController
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        public readonly StoreContext _context;

        public AccountController(UserManager<User> userManager, TokenService tokenService, StoreContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;
        }

        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto) 
        {
            User user = await _userManager.FindByNameAsync(loginDto.UserName);
            if(user == null || !await _userManager.CheckPasswordAsync(user, loginDto.Password)) {
                return Unauthorized();
            }

            Basket userBasket = await RetrieveBasket(user.UserName);
            Basket anonBasket = await RetrieveBasket(Request.Cookies["buyerId"]);
            if(anonBasket != null) {
                if(userBasket != null) _context.Baskets.Remove(userBasket);
                anonBasket.BuyerId = user.UserName;
                Response.Cookies.Delete("buyerId");
                await _context.SaveChangesAsync();
            }

            return new UserDto
            {
                EmailAddress = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = anonBasket != null ? anonBasket.MapBasketToDto() : userBasket?.MapBasketToDto()
            };
        }
        
        [HttpPost("register")]
        public async Task<ActionResult> Register(RegisterDto registerDto) 
        {
            User user = new User{UserName = registerDto.UserName, Email = registerDto.EmailAddress};

            IdentityResult result = await _userManager.CreateAsync(user, registerDto.Password);
            if(!result.Succeeded) {
                foreach(IdentityError error in result.Errors) {
                    ModelState.AddModelError(error.Code, error.Description);
                }
                return ValidationProblem();
            }

            await _userManager.AddToRoleAsync(user, "Member");
            return StatusCode(201);
        }

        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            User user = await _userManager.FindByNameAsync(User.Identity.Name);
            Basket userBasket = await RetrieveBasket(user.UserName);

            return new UserDto
            {
                EmailAddress = user.Email,
                Token = await _tokenService.GenerateToken(user),
                Basket = userBasket?.MapBasketToDto()
            };
        }

        [Authorize]
        [HttpGet("savedAddress")]
        public async Task<ActionResult<UserAddress>> GetSavedAddress()
        {
            return await _userManager.Users.Where(x => x.UserName == User.Identity.Name)
                    .Select(user => user.Address)
                    .FirstOrDefaultAsync();
        }

        private async Task<Basket> RetrieveBasket(string buyerId)
        {
            if(string.IsNullOrEmpty(buyerId)) {
                Response.Cookies.Delete("buyerId");
                return null;
            }

            return await _context.Baskets.Include(i => i.Items)
                        .ThenInclude(p => p.Product)
                        .FirstOrDefaultAsync(x => x.BuyerId == buyerId);
        }
    }
}