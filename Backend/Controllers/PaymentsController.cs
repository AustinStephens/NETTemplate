using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Backend.Data;
using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;
using Backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Backend.Controllers
{
    public class PaymentsController : BaseApiController
    {
        private readonly StoreContext _context;
        private readonly IConfiguration _config;
        private readonly PaymentService _paymentService;
        public PaymentsController(PaymentService paymentService, StoreContext context, IConfiguration  config)
        {
            _paymentService = paymentService;
            _context = context;
            _config = config;
        }

        [Authorize]
        [HttpPost]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent()
        {
            Basket basket = await _context.Baskets.RetrieveBasketWithItems(User.Identity.Name).FirstOrDefaultAsync();
            if(basket == null) return NotFound();

            var intent = await _paymentService.CreateOrUpdatePaymentIntent(basket);
            if(intent == null) return BadRequest(new ProblemDetails{Title = "Problem creating payment intent"});

            basket.PaymentIntentId = basket.PaymentIntentId ?? intent.Id;
            basket.ClientSecret = basket.ClientSecret ?? intent.ClientSecret;

            _context.Update(basket);
            bool result = await _context.SaveChangesAsync() > 0;

            if(!result) return BadRequest(new ProblemDetails{Title = "Problem updating basket with intent"});
            return basket.MapBasketToDto();
        }

        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook()
        {
            string json = await new StreamReader(HttpContext.Request.Body).ReadToEndAsync();

            Event stripeEvent = EventUtility.ConstructEvent(json, Request.Headers["Stripe-Signature"],
                _config["StripeSettings:WhSecret"]);
            Charge charge = (Charge)stripeEvent.Data.Object;

            Entities.OrderAggregate.Order order = await _context.Orders.FirstOrDefaultAsync(x => x.PaymentIntentId == charge.PaymentIntentId);
            if(charge.Status == "succeeded") order.OrderStatus = Entities.OrderAggregate.OrderStatus.PaymentReceived;
            await _context.SaveChangesAsync();
            
            return new EmptyResult();
        }
    }
}