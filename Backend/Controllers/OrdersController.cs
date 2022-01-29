using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Entities.OrderAggregate;
using Backend.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [Authorize]
    public class OrdersController : BaseApiController
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context) {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<List<OrderDto>>> GetOrders()
        {
            return await _context.Orders.ProjectOrderToDto()
                .Where(x => x.BuyerId == User.Identity.Name)
                .ToListAsync();
        }

        [HttpGet("{id}", Name = "GetOrder")]
        public async Task<ActionResult<OrderDto>> GetOrder(int id) 
        {
            return await _context.Orders.ProjectOrderToDto()
                .Where(x => x.BuyerId == User.Identity.Name && x.Id == id)
                .FirstOrDefaultAsync();
        }

        [HttpPost]
        public async Task<ActionResult<int>> CreateOrder(CreateOrderDto orderDto)
        {
            Basket basket = await _context.Baskets.RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();
            if(basket == null) return BadRequest(new ProblemDetails{Title = "Could not locate basket"});

            List<OrderItem> items = new List<OrderItem>();
            foreach (var item in basket.Items) {
                Product productItem = await _context.Products.FindAsync(item.ProductId);
                ProductItemOrdered itemOrdered = new ProductItemOrdered {
                    ProductId = productItem.Id,
                    Name = productItem.Name,
                    PictureUrl = productItem.PictureUrl
                };
                OrderItem orderItem = new OrderItem {
                    ItemOrdered = itemOrdered,
                    Price = productItem.Price,
                    Quantity = item.Quantity
                };
                items.Add(orderItem);
                productItem.QuantityInStock -= item.Quantity;
            }

            long subtotal = items.Sum(item => item.Price * item.Quantity);
            long deliveryFee = subtotal > 10000 ? 0 : 500;

            Order order = new Order {
                OrderItems = items,
                BuyerId = User.Identity.Name,
                ShippingAddress = orderDto.ShippingAddress,
                Subtotal = subtotal,
                DeliveryFee = deliveryFee
            };

            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);
            if(orderDto.SaveAddress) {
                User user = await _context.Users.Include(a => a.Address).FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);
                UserAddress address = new UserAddress {
                    FirstName = orderDto.ShippingAddress.FirstName,
                    LastName = orderDto.ShippingAddress.LastName,
                    Address1 = orderDto.ShippingAddress.Address1,
                    Address2 = orderDto.ShippingAddress.Address2,
                    City = orderDto.ShippingAddress.City,
                    State = orderDto.ShippingAddress.State,
                    Zip = orderDto.ShippingAddress.Zip,
                    Country = orderDto.ShippingAddress.Country
                };
                user.Address = address;
            }

            bool result = await _context.SaveChangesAsync() > 0;

            if(result) return CreatedAtRoute("GetOrder", new {id = order.Id}, order.Id);
            return BadRequest("Problem creating order");
        }
    }
}