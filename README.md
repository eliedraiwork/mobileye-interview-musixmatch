# Assignment Mobileye - Musixmatch API

## Node JS script

You can use this script by running

```
$ node src/index.js {arg}
```

Where _arg_ should be the string for the API query.

By default _arg="car"_

## Docker

There are two files related to docker in the project root:

- Dockerfile
- docker-compose.yml

In the Dockerfile we expose the service which can accept an argument for specifying the string for the API query.

To build the image using docker:

```
docker build -t {username}/{image-tag} .
```

Using docker compose:

```
docker compose build
```

### API key

It's mandatory to provide an environment variable for the API key.
For security reasons we removed it from the code.

For example after building the image, you should run this command:

```
$ docker run \
    -it \
    -e MUSIX_MATCH_API_KEY={MUSIX_MATCH_API_KEY} \
    {username}/{image-tag} {arg}
```

Or simply provide a .env file with this variable inside it and with the following command:

```
$ docker run \
    -it \
    --env-file /path/to/env/file \
    {username}/{image-tag} {arg}
```

It is also possible to define the environment variable **DEFAULT_WORD** to define another default word for query instead of "car".
```
$ docker run \
    -it \
    -e MUSIX_MATCH_API_KEY={MUSIX_MATCH_API_KEY} \
    -e DEFAULT_WORLD=Hello
    {username}/{image-tag} {arg}
```

### CSV

The purpose of this service is to output a CSV of all tracks matching the request parameters.
The CSV could be retrieved outside of the container using volumes.
The output will be available in a file with path **$(pwd)/output/results.csv**

Using docker:

```
docker run \
    -v $(pwd)/output:/output \
    -it \
    -e MUSIX_MATCH_API_KEY={MUSIX_MATCH_API_KEY} \
    {username}/{image-tag} {arg}
```

Using docker compose (volumes already defined in the yml file):

```
docker compose run \
    -e MUSIX_MATCH_API_KEY={MUSIX_MATCH_API_KEY} \
    musixmatch-api-service {arg}
```
