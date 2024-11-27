namespace BookAPI.Services
{
    using System.Net.Http;
    using System.Text.Json;
    using System.Text;
    using System.Threading.Tasks;
    using BookAPI.Models;

    public class BookService
    {
        private readonly HttpClient _httpClient;

        public BookService(HttpClient httpClient)
        {
            _httpClient = httpClient;
            _httpClient.BaseAddress = new Uri("https://fakerestapi.azurewebsites.net/api/v1/");
        }

        public async Task<List<Book>> GetBooksAsync()
        {
            var response = await _httpClient.GetAsync("Books");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<List<Book>>(content);
            


        }

        public async Task<Book> GetBookByIdAsync(int id)
        {
            var response = await _httpClient.GetAsync($"Books/{id}");
            response.EnsureSuccessStatusCode();
            var content = await response.Content.ReadAsStringAsync();
            return JsonSerializer.Deserialize<Book>(content);
        }

        public async Task<HttpResponseMessage> CreateBookAsync(Book book)
        {
            var content = new StringContent(JsonSerializer.Serialize(book), Encoding.UTF8, "application/json");
            return await _httpClient.PostAsync("Books", content);
        }

        public async Task<HttpResponseMessage> UpdateBookAsync(int id, Book book)
        {
            var content = new StringContent(JsonSerializer.Serialize(book), Encoding.UTF8, "application/json");
            return await _httpClient.PutAsync($"Books/{id}", content);
        }

        public async Task<HttpResponseMessage> DeleteBookAsync(int id)
        {
            return await _httpClient.DeleteAsync($"Books/{id}");
        }
    }

}
