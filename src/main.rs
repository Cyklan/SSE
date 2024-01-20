use std::env::current_exe;

use poem::{
    endpoint::StaticFilesEndpoint, get, http::Method, listener::TcpListener, middleware::Cors,
    EndpointExt, Route, Server,
};

mod services;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let cors = Cors::new()
        .allow_method(Method::GET)
        .allow_origin_regex("*");

    let mut path = current_exe()?;
    path.pop();
    path.push("public");
    println!("Serving static files from {}", path.display());
    let app = Route::new()
        .nest(
            "/",
            get(StaticFilesEndpoint::new(path).index_file("index.html")),
        )
        .nest("/sse", services::sse::api())
        .with(cors);
    Server::new(TcpListener::bind("0.0.0.0:3000"))
        .run(app)
        .await
}
