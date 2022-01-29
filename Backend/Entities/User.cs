using Microsoft.AspNetCore.Identity;

namespace Backend.Entities
{
    public class User : IdentityUser<int>
    {
        public UserAddress Address { get; set; }
    }
}