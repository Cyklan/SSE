use futures_util::StreamExt;
use std::time::Duration;

use poem::{
    get, handler,
    web::sse::{Event, SSE},
    Route,
};
use tokio_stream::wrappers::IntervalStream;

#[handler]
fn index() -> SSE {
    return SSE::new(
        IntervalStream::new(tokio::time::interval(Duration::from_secs(2)))
            .map(move |_| Event::message("hello world")),
    );
}

pub fn api() -> Route {
    return Route::new().at("/", get(index));
}
