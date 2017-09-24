using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using DSJTournaments.Mvc.Responses;
using Xunit;

namespace DSJTournaments.Api.IntegrationTests.Util
{
    public static class ResponseAssert
    {
        public static async Task Ok(HttpResponseMessage response)
        {
            if (response.StatusCode != HttpStatusCode.OK)
            {
                var content = await response.Content.ReadAsStringAsync();
                Assert.True(false, $"Expected 200 OK, got {(int)response.StatusCode}. Response body:\n\n{content}");
            }
        }

        public static async Task<ErrorResponse> BadRequest(HttpResponseMessage response)
        {
            if (response.StatusCode != HttpStatusCode.BadRequest)
            {
                var content = await response.Content.ReadAsStringAsync();
                Assert.True(false, $"Expected 400 Bad Request, got {(int)response.StatusCode}. Response body:\n\n{content}");
                return null;
            }
            else
            {
                return await response.Content.ReadAsJsonAsync<ErrorResponse>();
            }
        }
    }
}