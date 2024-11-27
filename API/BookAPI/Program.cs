using BookAPI.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhost8000", policy =>
    {
        policy.WithOrigins("http://localhost:8000")  
              .AllowAnyHeader()                      
              .AllowAnyMethod();                     
    });
});

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpClient<BookService>();


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Aplicar CORS
app.UseCors("AllowLocalhost8000");

app.UseAuthorization();

app.MapControllers();

app.Run();
