# Carbon Parser
Carbon Parser is a micro-service ready to deploy on Google AppEngine Flex that runs headless chrome and exposes an endpoint `GET /api/parse` that takes a `url` parameter and returns JSON representation of some meta data about the page: `title`, `description`, `image`, `images`.

After deploying the service you can configure and install `carbon.LinkEmbeddingExtension` with your Carbon Editor and configure the extension with `carbon.CarbonParser` service passing the proper endpoint.

This allows the editor to make calls to your service when a link is pasted in the editor and embed a card for the link into the editor.