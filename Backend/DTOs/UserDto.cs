using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTOs
{
    public class UserDto
    {
        public string EmailAddress { get; set; }
        public string Token { get; set; }
        public BasketDto Basket { get; set; }
    }
}