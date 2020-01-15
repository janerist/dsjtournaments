using System;
using System.Globalization;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace DSJTournaments.Upload.IntegrationTests.Util
{
    public static class HttpClientExtensions
    {
        public static async Task<HttpResponseMessage> UploadStatsAsync(this HttpClient client, 
            string stats, string fileName = "test.txt", string contentType = "text/plain")
        {
            var content = new MultipartFormDataContent();

            var streamContent = new StreamContent(stats.Trim().ToStream());
            if (contentType != null)
            {
                streamContent.Headers.Add("Content-Type", contentType);
            }
            
            content.Add(streamContent, "file", fileName);

            return await client.PostAsync("upload", content);
        }

        public static async Task<T> ReadAsJsonAsync<T>(this HttpContent content)
        {
            var json = await content.ReadAsStringAsync();
            return JsonConvert.DeserializeObject<T>(json);
        }
    }
}