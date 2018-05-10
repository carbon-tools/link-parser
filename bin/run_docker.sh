# Build the docker image.
# docker build -t carbon-parser .

# Start docker machine.
docker-machine start default

# Run the app and stream the app files from local machine to allow edits to be caught on the fly.
docker run -p 8080:8080 -v /Documents/carbon-parser/:/app:rw carbon-parser

# Get into a bash inside the docker.
# docker run -it -p 8080:8080 -v /Documents/carbon-parser/:/app:rw carbon-parser /bin/bash

# Upload app files and build image on cloud (this could timeout if the build takes more than 10mins)
gcloud app deploy --project carbon-parser --version=new-version


# Upload a locally built image
docker tag carbon-parser gcr.io/carbon-parser/manual-builds:small-build
gcloud docker -- push gcr.io/carbon-parser/manual-builds

# Deploy a custom image
gcloud app deploy --image-url gcr.io/carbon-parser/manual-builds:small-build --project carbon-parser
