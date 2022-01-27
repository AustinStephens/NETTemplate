using System;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    public class BasketController : BaseApiController
    {
        private readonly StoreContext _context;

        public BasketController(StoreContext context)
        {
            _context = context;
        }

        [HttpGet(Name = "GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket()
        {
            Basket basket = await RetrieveBasket(GetBuyerId());

            if (basket == null) return NotFound();
            return basket.MapBasketToDto();
        }

        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId, int quantity) {
            Basket basket = await RetrieveBasket(GetBuyerId());
            if(basket == null) basket = CreateBasket();

            Product product = await _context.Products.FindAsync(productId);
            if(product == null) return BadRequest(new ProblemDetails{Title = "Product Not Found"});

            basket.AddItem(product, quantity);

            int results = await _context.SaveChangesAsync();
            if(results > 0) return CreatedAtRoute("GetBasket", basket.MapBasketToDto());
            
            return BadRequest(new ProblemDetails{Title = "Problem saving item to basket"});
        }

        [HttpDelete]
        public async Task<ActionResult> RemoveBasketItem(int productId, int quantity) {
            Basket basket = await RetrieveBasket(GetBuyerId());
            if(basket == null) return NotFound();

            basket.RemoveItem(productId, quantity);

            int results = await  _context.SaveChangesAsync();
            if(results > 0) return Ok();

            return BadRequest(new ProblemDetails{Title = "Problem removing item from basket"});
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

        private string GetBuyerId() 
        {
            return User.Identity?.Name ?? Request.Cookies["buyerId"];
        }

        private Basket CreateBasket()
        {
            string buyerId = User.Identity?.Name;
            if(string.IsNullOrEmpty(buyerId)) {
                buyerId = Guid.NewGuid().ToString();
                CookieOptions cookieOptions = new CookieOptions{IsEssential = true, Expires = DateTime.Now.AddDays(30)};
                Response.Cookies.Append("buyerId", buyerId, cookieOptions);
            }
            
            Basket basket = new Basket{BuyerId = buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }
    }
}