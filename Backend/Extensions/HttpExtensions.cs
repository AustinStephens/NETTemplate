using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Metadata;
using System.Text.Json;
using System.Threading.Tasks;
using Backend.RequestHelpers;
using Microsoft.AspNetCore.Http;

namespace Backend.Extensions
{
    public static class HttpExtensions
    {
        public static void AddPaginationHeader(this HttpResponse response, MetaData metaData) {
            response.Headers.Add("Pagination", JsonSerializer.Serialize(metaData, new JsonSerializerOptions{PropertyNamingPolicy = JsonNamingPolicy.CamelCase}));
            response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
        }
    }
}