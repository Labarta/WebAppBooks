using Microsoft.AspNetCore.Mvc;

namespace BookAPI.Controllers
{
    using BookAPI.Models;
    using BookAPI.Services;
    using Microsoft.AspNetCore.Mvc;

    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookService _bookService;

        public BooksController(BookService bookService)
        {
            _bookService = bookService;
        }



        [HttpGet]
        public async Task<IActionResult> GetBooks()
        {
            var books = await _bookService.GetBooksAsync();
            return Ok(books);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetBookById(int id)
        {
            var book = await _bookService.GetBookByIdAsync(id);
            return Ok(book);
        }

        [HttpPost]
        public async Task<IActionResult> CreateBook([FromBody] Book book)
        {
            if (book == null)
            {
                return BadRequest("El libro no puede ser nulo.");
            }


            if (string.IsNullOrEmpty(book.title) || string.IsNullOrEmpty(book.description))
            {
                return BadRequest("Los campos título y descripción son requeridos.");
            }

            // Aquí, simplemente se crea el libro tal como lo recibimos
            var response = await _bookService.CreateBookAsync(book);

            if (!response.IsSuccessStatusCode)
            {
                return StatusCode((int)response.StatusCode, "Hubo un error al crear el libro.");
            }

            var createdBook = await response.Content.ReadFromJsonAsync<Book>();

            return CreatedAtAction(nameof(GetBookById), new { id = createdBook.id }, createdBook);

        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateBook(int id, [FromBody] Book book)
        {
            var response = await _bookService.UpdateBookAsync(id, book);
            return StatusCode((int)response.StatusCode);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBook(int id)
        {
            var response = await _bookService.DeleteBookAsync(id);
            return StatusCode((int)response.StatusCode);
        }
    }
}
