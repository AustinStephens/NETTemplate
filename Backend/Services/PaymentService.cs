using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Backend.Entities;
using Microsoft.Extensions.Configuration;
using Stripe;

namespace Backend.Services
{
    public class PaymentService
    {
        public readonly IConfiguration _config;
        public PaymentService(IConfiguration config)
        {
            _config = config;
        }

        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket)
        {
            StripeConfiguration.ApiKey = _config["StripeSettings:SecretKey"];

            PaymentIntentService service = new PaymentIntentService();
            PaymentIntent intent = new PaymentIntent();
            long subtotal = basket.Items.Sum(item => item.Quantity * item.Product.Price);
            long deliveryFee = subtotal > 10000 ? 0 : 500;

            if(string.IsNullOrEmpty(basket.PaymentIntentId)) {
                PaymentIntentCreateOptions options = new PaymentIntentCreateOptions
                {
                    Amount = subtotal + deliveryFee,
                    Currency = "usd",
                    PaymentMethodTypes = new List<string> {"card"}
                };
                intent = await service.CreateAsync(options);
            } else {
                PaymentIntentUpdateOptions options = new PaymentIntentUpdateOptions { Amount = subtotal + deliveryFee };
                await service.UpdateAsync(basket.PaymentIntentId, options);
            }

            return intent;
        }
    }
}