using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Backend.DTOs
{
    public class RegisterDto : LoginDto
    {
        public string EmailAddress { get; set; }
    }
}